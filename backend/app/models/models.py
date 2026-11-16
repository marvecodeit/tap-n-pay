from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Student(Base):
    __tablename__ = "students"

    student_id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=True, unique=True)
    phone = Column(String(32), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    cards = relationship("Card", back_populates="student")

class Card(Base):
    __tablename__ = "cards"

    card_id = Column(String(32), primary_key=True, index=True) # 12-16 char random token
    student_id = Column(String(64), ForeignKey("students.student_id"), nullable=False)
    balance = Column(Integer, default=0, nullable=False) # stored in kobo (source of truth)
    version = Column(Integer, default=1, nullable=False) # version increments on update
    blocked = Column(Integer, default=0, nullable=False) # 0 = active, 1 = hotlisted
    issued_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    student = relationship("Student", back_populates="cards")

class Ledger(Base):
    __tablename__ = "ledger"

    entry_id = Column(String(64), primary_key=True, index=True)
    card_id = Column(String(32), nullable=False, index=True)
    type = Column(String(32), nullable=False) # TOPUP | PURCHASE | REFUND | VOID
    amount = Column(Integer, nullable=False) # positive = credit, negative = debit
    reference = Column(String(128), nullable=True) # Paystack ref, txn_id
    terminal_id = Column(String(64), nullable=True)
    cashier_id = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    metadata_json = Column(Text, nullable=True)

class Terminal(Base):
    __tablename__ = "terminals"

    terminal_id = Column(String(64), primary_key=True, index=True)
    location = Column(String(255), nullable=False)
    last_sync_at = Column(DateTime, nullable=True)
    disabled = Column(Integer, default=0, nullable=False)

class Refund(Base):
    __tablename__ = "refunds"

    refund_id = Column(String(64), primary_key=True, index=True)
    txn_id = Column(String(64), nullable=False, index=True)
    card_id = Column(String(32), nullable=False)
    amount = Column(Integer, nullable=False) # kobo
    reason = Column(Text, nullable=False)
    cashier_id = Column(String(64), nullable=True)
    status = Column(String(32), default="PENDING", nullable=False) # PENDING | APPROVED | REJECTED
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
