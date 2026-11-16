import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db
from app.models.models import Student, Card, Ledger
from app.schemas.schemas import StudentCreateRequest, StudentResponse

router = APIRouter(prefix="/students", tags=["students"])

def generate_card_token() -> str:
    chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    part1 = "".join(random.choice(chars) for _ in range(4))
    part2 = "".join(random.choice(chars) for _ in range(4))
    return f"CARD-{part1}-{part2}"

@router.post("", response_model=StudentResponse)
async def create_student_account(
    payload: StudentCreateRequest, db: AsyncSession = Depends(get_db)
):
    student_id = payload.student_id.strip().upper()

    # Check if student already exists
    res = await db.execute(select(Student).where(Student.student_id == student_id))
    existing = res.scalars().first()
    if existing:
        # Check active card
        card_res = await db.execute(
            select(Card).where(Card.student_id == student_id, Card.blocked == 0).order_by(Card.issued_at.desc())
        )
        active_card = card_res.scalars().first()
        return StudentResponse(
            student_id=existing.student_id,
            name=existing.name,
            email=existing.email,
            phone=existing.phone,
            created_at=existing.created_at.isoformat(),
            active_card_id=active_card.card_id if active_card else None,
            balance=active_card.balance if active_card else 0,
        )

    # Create new student
    student = Student(
        student_id=student_id,
        name=payload.name.strip(),
        email=payload.email.strip() if payload.email else f"{student_id.lower()}@university.edu.ng",
        phone=payload.phone.strip() if payload.phone else None,
        created_at=datetime.utcnow(),
    )
    db.add(student)

    # Auto-issue new card token
    card_id = generate_card_token()
    card = Card(
        card_id=card_id,
        student_id=student_id,
        balance=payload.initial_balance_kobo,
        version=1,
        blocked=0,
        issued_at=datetime.utcnow(),
    )
    db.add(card)

    if payload.initial_balance_kobo > 0:
        ledger = Ledger(
            entry_id=f"top_{card_id[:8]}_{int(datetime.utcnow().timestamp())}",
            card_id=card_id,
            type="TOPUP",
            amount=payload.initial_balance_kobo,
            reference="SIGNUP_WELCOME_BONUS",
            created_at=datetime.utcnow(),
        )
        db.add(ledger)

    await db.commit()
    await db.refresh(student)
    await db.refresh(card)

    return StudentResponse(
        student_id=student.student_id,
        name=student.name,
        email=student.email,
        phone=student.phone,
        created_at=student.created_at.isoformat(),
        active_card_id=card.card_id,
        balance=card.balance,
    )

@router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: str, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Student).where(Student.student_id == student_id.upper()))
    student = res.scalars().first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")

    # Get active card
    card_res = await db.execute(
        select(Card).where(Card.student_id == student_id.upper(), Card.blocked == 0).order_by(Card.issued_at.desc())
    )
    active_card = card_res.scalars().first()

    return StudentResponse(
        student_id=student.student_id,
        name=student.name,
        email=student.email,
        phone=student.phone,
        created_at=student.created_at.isoformat(),
        active_card_id=active_card.card_id if active_card else None,
        balance=active_card.balance if active_card else 0,
    )
