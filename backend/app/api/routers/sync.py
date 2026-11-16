from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import Card, Ledger, Student
from app.schemas.schemas import SyncUploadBatch, SyncResponse, CardResponse, RejectedTxn

router = APIRouter(prefix="/sync", tags=["sync"])

@router.post("", response_model=SyncResponse)
async def process_sync(batch: SyncUploadBatch, db: AsyncSession = Depends(get_db)):
    accepted_txn_ids = []
    rejected_txns = []

    for txn in batch.transactions:
        # Check if transaction was already processed in ledger
        existing_ledger = await db.execute(
            select(Ledger).where(Ledger.reference == txn.txn_id)
        )
        if existing_ledger.scalars().first():
            # Idempotent: already accepted
            accepted_txn_ids.append(txn.txn_id)
            continue

        # Fetch card
        res = await db.execute(select(Card).where(Card.card_id == txn.card_id))
        card = res.scalars().first()

        if not card:
            rejected_txns.append(
                RejectedTxn(txn_id=txn.txn_id, reason="Card not found on server")
            )
            continue

        if txn.amount <= 0:
            rejected_txns.append(
                RejectedTxn(txn_id=txn.txn_id, reason="Transaction amount must be positive")
            )
            continue

        if txn.status == "PENDING" or txn.status == "APPROVED":
            if card.balance < txn.amount:
                rejected_txns.append(
                    RejectedTxn(
                        txn_id=txn.txn_id,
                        reason="Insufficient balance for this transaction",
                    )
                )
                continue

            # Apply debit on server source of truth only when funds are available.
            card.balance -= txn.amount
            card.version += 1

            ledger_entry = Ledger(
                entry_id=f"led_{txn.txn_id[:12]}",
                card_id=card.card_id,
                type="PURCHASE",
                amount=-txn.amount,
                reference=txn.txn_id,
                terminal_id=txn.terminal_id,
                cashier_id=txn.cashier_id,
                metadata_json=f'{{"verification_code": "{txn.verification_code}"}}',
            )
            db.add(ledger_entry)
            accepted_txn_ids.append(txn.txn_id)

        elif txn.status == "VOID":
            # Cashier immediate void
            ledger_entry = Ledger(
                entry_id=f"void_{txn.txn_id[:12]}",
                card_id=card.card_id,
                type="VOID",
                amount=0,
                reference=txn.txn_id,
                terminal_id=txn.terminal_id,
                cashier_id=txn.cashier_id,
            )
            db.add(ledger_entry)
            accepted_txn_ids.append(txn.txn_id)

    await db.commit()

    # Get updated card balances and hotlist to send back to terminal
    cards_query = await db.execute(select(Card, Student.name).join(Student, Card.student_id == Student.student_id))
    cards_rows = cards_query.all()

    balance_updates = [
        CardResponse(
            card_id=c.card_id,
            student_id=c.student_id,
            student_name=student_name,
            balance=c.balance,
            version=c.version,
            blocked=c.blocked,
            issued_at=c.issued_at,
        )
        for c, student_name in cards_rows
    ]

    return SyncResponse(
        accepted_txn_ids=accepted_txn_ids,
        rejected_txns=rejected_txns,
        balance_updates=balance_updates,
        server_time=datetime.utcnow().isoformat(),
        server_version=int(datetime.utcnow().timestamp()),
    )
