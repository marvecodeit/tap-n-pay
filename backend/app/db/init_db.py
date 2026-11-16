import logging
from sqlalchemy import select
from app.db.session import engine, AsyncSessionLocal
from app.models.models import Base, Student, Card, Terminal

logger = logging.getLogger(__name__)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if student exists
        res = await session.execute(select(Student).limit(1))
        existing_student = res.scalars().first()

        if not existing_student:
            logger.info("Seeding initial demo students and cards...")

            demo_students = [
                Student(
                    student_id="STU-001",
                    name="John Okafor",
                    email="john.okafor@university.edu.ng",
                    phone="08012345678",
                ),
                Student(
                    student_id="STU-002",
                    name="Fatima Aliyu",
                    email="fatima.aliyu@university.edu.ng",
                    phone="08023456789",
                ),
                Student(
                    student_id="STU-003",
                    name="Chinedu Eze",
                    email="chinedu.eze@university.edu.ng",
                    phone="08034567890",
                ),
                Student(
                    student_id="STU-004",
                    name="Tunde Bakare",
                    email="tunde.bakare@university.edu.ng",
                    phone="08045678901",
                ),
            ]
            session.add_all(demo_students)
            await session.commit()

            demo_cards = [
                Card(
                    card_id="CARD-A3F2-9K2",
                    student_id="STU-001",
                    balance=150000, # ₦1,500.00
                    version=1,
                    blocked=0,
                ),
                Card(
                    card_id="CARD-7B4C-1L9",
                    student_id="STU-002",
                    balance=500000, # ₦5,000.00
                    version=1,
                    blocked=0,
                ),
                Card(
                    card_id="CARD-2E8M-5Q4",
                    student_id="STU-003",
                    balance=40000, # ₦400.00
                    version=1,
                    blocked=0,
                ),
                Card(
                    card_id="CARD-BLOCKED-99",
                    student_id="STU-004",
                    balance=350000,
                    version=1,
                    blocked=1, # Hotlisted
                ),
            ]
            session.add_all(demo_cards)

            demo_terminals = [
                Terminal(terminal_id="POS-001", location="Counter 1 (Main Hall)", disabled=0),
                Terminal(terminal_id="POS-002", location="Counter 2 (Drinks & Snacks)", disabled=0),
                Terminal(terminal_id="POS-003", location="Annex Cafeteria", disabled=0),
            ]
            session.add_all(demo_terminals)

            await session.commit()
            logger.info("Demo database seeded successfully.")

        # Repair disposable demo cards left negative by older test builds.
        demo_balances = {
            "CARD-A3F2-9K2": 150000,
            "CARD-7B4C-1L9": 500000,
            "CARD-2E8M-5Q4": 40000,
            "CARD-BLOCKED-99": 350000,
        }
        result = await session.execute(
            select(Card).where(Card.card_id.in_(demo_balances))
        )
        repaired_demo_card = False
        for card in result.scalars():
            if card.balance < 0:
                card.balance = demo_balances[card.card_id]
                card.version += 1
                repaired_demo_card = True
        if repaired_demo_card:
            await session.commit()
            logger.info("Repaired negative demo card balances.")
