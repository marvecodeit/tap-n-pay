# backend

FastAPI backend service:
- Student wallet balance (source of truth)
- Paystack webhook handler (HMAC-verified)
- POS terminal sync endpoints (`POST /sync/transactions`, `GET /sync/delta`)
- Double-entry ledger records
- Daily reconciliation invariants
