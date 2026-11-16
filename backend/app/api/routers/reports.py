from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.db.session import get_db
from app.models.models import Card, Ledger, Refund
from app.schemas.schemas import ReconciliationResponse

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/reconciliation", response_model=ReconciliationResponse)
async def get_reconciliation_report(db: AsyncSession = Depends(get_db)):
    # 1. Total wallet balance across all student cards (excluding blocked)
    bal_res = await db.execute(select(func.sum(Card.balance)).where(Card.blocked == 0))
    total_wallet_kobo = bal_res.scalar() or 0

    # 2. Total Paystack deposits
    topup_res = await db.execute(
        select(func.sum(Ledger.amount)).where(Ledger.type == "TOPUP")
    )
    total_topup_kobo = topup_res.scalar() or 0

    # 3. Total purchase debits
    purchase_res = await db.execute(
        select(func.sum(Ledger.amount)).where(Ledger.type == "PURCHASE")
    )
    total_purchase_kobo = purchase_res.scalar() or 0 # negative integer

    # 4. Total counts
    txn_count_res = await db.execute(
        select(func.count(Ledger.entry_id)).where(Ledger.type == "PURCHASE")
    )
    total_txns = txn_count_res.scalar() or 0

    void_count_res = await db.execute(
        select(func.count(Ledger.entry_id)).where(Ledger.type == "VOID")
    )
    total_voids = void_count_res.scalar() or 0

    refund_count_res = await db.execute(
        select(func.count(Refund.refund_id))
    )
    total_refunds = refund_count_res.scalar() or 0

    # Paystack 1.5% fee estimate
    fees_kobo = int(total_topup_kobo * 0.015)
    payouts_kobo = 0

    # Invariant: Wallet float should match net funds
    net_funds_kobo = total_topup_kobo - fees_kobo - payouts_kobo
    difference_kobo = abs(total_wallet_kobo - (total_topup_kobo + total_purchase_kobo))

    return ReconciliationResponse(
        date=datetime.utcnow().strftime("%Y-%m-%d"),
        total_wallet_balance_kobo=total_wallet_kobo,
        total_paystack_balance_kobo=total_topup_kobo,
        total_fees_kobo=fees_kobo,
        total_payouts_kobo=payouts_kobo,
        difference_kobo=difference_kobo,
        is_balanced=difference_kobo == 0,
        total_transactions_count=total_txns,
        total_voids_count=total_voids,
        total_refunds_count=total_refunds,
    )
