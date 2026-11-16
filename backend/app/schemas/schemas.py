from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class CardBase(BaseModel):
    card_id: str
    student_id: str
    balance: int
    version: int
    blocked: int
    issued_at: datetime

class CardResponse(CardBase):
    student_name: str

    class Config:
        from_attributes = True

class StudentCreateRequest(BaseModel):
    name: str
    student_id: str
    email: Optional[str] = None
    phone: Optional[str] = None
    initial_balance_kobo: int = 0

class StudentResponse(BaseModel):
    student_id: str
    name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    created_at: str
    active_card_id: Optional[str] = None
    balance: int = 0

class TransactionItem(BaseModel):
    txn_id: str
    card_id: str
    student_name: Optional[str] = None
    amount: int
    terminal_id: str
    cashier_id: str
    created_at: str
    status: str
    verification_code: Optional[str] = None

class SyncUploadBatch(BaseModel):
    terminal_id: str
    cashier_id: str
    client_time: str
    transactions: List[TransactionItem] = Field(default_factory=list)

class RejectedTxn(BaseModel):
    txn_id: str
    reason: str

class SyncResponse(BaseModel):
    accepted_txn_ids: List[str]
    rejected_txns: List[RejectedTxn] = Field(default_factory=list)
    balance_updates: List[CardResponse] = Field(default_factory=list)
    server_time: str
    server_version: int

class TopUpInitRequest(BaseModel):
    student_id: str
    amount_kobo: int
    email: Optional[str] = None

class TopUpInitResponse(BaseModel):
    authorization_url: str
    access_code: str
    reference: str

class IssueCardRequest(BaseModel):
    student_id: str
    card_id: str
    balance: int = 0

class ReconciliationResponse(BaseModel):
    date: str
    total_wallet_balance_kobo: int
    total_paystack_balance_kobo: int
    total_fees_kobo: int
    total_payouts_kobo: int
    difference_kobo: int
    is_balanced: bool
    total_transactions_count: int
    total_voids_count: int
    total_refunds_count: int
