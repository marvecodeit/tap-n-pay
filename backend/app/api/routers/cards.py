from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import Card, Student, Ledger
from app.schemas.schemas import CardResponse, IssueCardRequest

router = APIRouter(prefix="/cards", tags=["cards"])

@router.get("", response_model=List[CardResponse])
async def list_cards(db: AsyncSession = Depends(get_db)):
    query = await db.execute(
        select(Card, Student.name).join(Student, Card.student_id == Student.student_id)
    )
    results = query.all()
    return [
        CardResponse(
            card_id=c.card_id,
            student_id=c.student_id,
            student_name=name,
            balance=c.balance,
            version=c.version,
            blocked=c.blocked,
            issued_at=c.issued_at,
        )
        for c, name in results
    ]

@router.post("", response_model=CardResponse)
async def issue_card(payload: IssueCardRequest, db: AsyncSession = Depends(get_db)):
    # Check student exists
    student_res = await db.execute(select(Student).where(Student.student_id == payload.student_id))
    student = student_res.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    new_card = Card(
        card_id=payload.card_id.upper(),
        student_id=payload.student_id,
        balance=payload.balance,
        version=1,
        blocked=0,
        issued_at=datetime.utcnow(),
    )
    db.add(new_card)

    if payload.balance > 0:
        ledger = Ledger(
            entry_id=f"init_{payload.card_id[:8]}",
            card_id=payload.card_id.upper(),
            type="TOPUP",
            amount=payload.balance,
            reference="INITIAL_ISSUE",
        )
        db.add(ledger)

    await db.commit()
    await db.refresh(new_card)

    return CardResponse(
        card_id=new_card.card_id,
        student_id=new_card.student_id,
        student_name=student.name,
        balance=new_card.balance,
        version=new_card.version,
        blocked=new_card.blocked,
        issued_at=new_card.issued_at,
    )

@router.post("/{card_id}/block")
async def block_card(card_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Card).where(Card.card_id == card_id.upper()))
    card = res.scalars().first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    card.blocked = 1
    card.version += 1
    await db.commit()
    return {"message": "Card added to hotlist/blocked successfully", "card_id": card.card_id, "blocked": 1}

@router.post("/{card_id}/unblock")
async def unblock_card(card_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Card).where(Card.card_id == card_id.upper()))
    card = res.scalars().first()
    if not card:
        raise HTTPException(status_code=404, detail="Card not found")
    card.blocked = 0
    card.version += 1
    await db.commit()
    return {"message": "Card unblocked successfully", "card_id": card.card_id, "blocked": 0}
