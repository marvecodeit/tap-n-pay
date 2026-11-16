import hmac
import hashlib
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.config import settings
from app.db.session import get_db
from app.models.models import Card, Ledger, Student
from app.schemas.schemas import TopUpInitRequest, TopUpInitResponse

router = APIRouter(prefix="/topups", tags=["topups"])

@router.post("/init", response_model=TopUpInitResponse)
async def init_topup(payload: TopUpInitRequest, db: AsyncSession = Depends(get_db)):
    # Verify student exists
    res = await db.execute(select(Student).where(Student.student_id == payload.student_id))
    student = res.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    reference = f"topup_{payload.student_id}_{int(datetime.utcnow().timestamp())}"
    # In production, this calls https://api.paystack.co/transaction/initialize
    return TopUpInitResponse(
        authorization_url=f"https://checkout.paystack.com/{reference}",
        access_code=f"acc_{reference}",
        reference=reference,
    )

@router.post("/webhook")
async def paystack_webhook(
    request: Request,
    x_paystack_signature: str = Header(None),
    db: AsyncSession = Depends(get_db),
):
    body_bytes = await request.body()

    # In production, verify HMAC signature:
    # computed_sig = hmac.new(settings.PAYSTACK_SECRET_KEY.encode(), body_bytes, hashlib.sha512).hexdigest()
    # if computed_sig != x_paystack_signature:
    #     raise HTTPException(status_code=400, detail="Invalid signature")

    payload = await request.json()
    event = payload.get("event")

    if event == "charge.success":
        data = payload.get("data", {})
        reference = data.get("reference")
        amount_kobo = data.get("amount") # in kobo
        metadata = data.get("metadata", {})
        card_id = metadata.get("card_id")
        student_id = metadata.get("student_id")

        # Idempotency check
        existing = await db.execute(select(Ledger).where(Ledger.reference == reference))
        if existing.scalars().first():
            return {"status": "already_processed"}

        # Find card
        if card_id:
            res = await db.execute(select(Card).where(Card.card_id == card_id.upper()))
            card = res.scalars().first()
        elif student_id:
            res = await db.execute(
                select(Card).where(Card.student_id == student_id, Card.blocked == 0).order_by(Card.issued_at.desc())
            )
            card = res.scalars().first()
        else:
            card = None

        if card:
            card.balance += amount_kobo
            card.version += 1

            ledger = Ledger(
                entry_id=f"top_{reference[:16]}",
                card_id=card.card_id,
                type="TOPUP",
                amount=amount_kobo,
                reference=reference,
            )
            db.add(ledger)
            await db.commit()

    return {"status": "success"}
