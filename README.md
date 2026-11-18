TapNPay
A fast, offline-capable meal payment system for campus cafeterias.

## Run the web apps locally

From the parent workspace, `npm run dev` starts the Student Web app. From this
TapNPay workspace, start one app with:

```sh
corepack pnpm dev:admin
corepack pnpm dev:student
corepack pnpm dev:terminal
```

The Student Web command also starts the Landing Pages app it embeds on its
home page. Run all apps together with `corepack pnpm dev:apps`. They prefer
these local URLs:

- Admin: http://localhost:5175
- Terminal: http://localhost:5174
- Student: http://localhost:5180
- Landing Pages (Student home dependency): http://localhost:5176

From the parent workspace, the equivalent commands are `npm run dev:admin`,
`npm run dev:student`, `npm run dev:terminal`, and `npm run dev:tapnpay`.
If a preferred port is occupied, Vite automatically selects another available
port and prints its URL. Open the URL it prints. Leave the command terminal
open while using the app; closing it stops the development server.

Students top up their wallet in the TapNPay web app, receive a card with a printed QR code, and pay at the cafeteria POS in under 7 seconds — no OTP, no PIN, no network dependency at checkout.

Everything is a web app. The student app runs in a browser. The terminal app runs in the POS browser. No mobile builds, no custom hardware.

What We're Building
TapNPay is three web applications and one physical thing:

1. Student Web App
Browser-based (mobile-first, responsive)

Top up wallet via Paystack

View balance and transaction history

View digital receipts

Report a lost or stolen card

2. Terminal Web App (runs in the POS browser)
Cashier enters the price

Student taps their card on the scanner

Money is deducted from the student's wallet instantly

Receipt prints via the POS printer

Works offline as a PWA (service worker + IndexedDB)

Syncs with the server when Wi-Fi is available

3. Backend Server
Holds every student's wallet balance (source of truth)

Receives top-ups from Paystack

Keeps all POS terminals updated with the latest balances and block list

Reconciles transactions from terminals

Generates daily reconciliation reports

The Card
Plastic or laminated paper with a printed QR code

The QR code contains only a random 12–16 character student ID

No balance is stored on the card

How It Works
Top-Up
Student opens the web app and enters an amount

Pays via Paystack

Money lands in the cafeteria's Paystack wallet

Student's wallet balance on the server goes up

The POS terminals pick up the new balance on their next sync

Checkout
Cashier enters the price on the POS web app

Student taps their card on the scanner

POS looks up the student in its local IndexedDB balance cache

Balance is checked, amount is deducted, receipt is printed

Transaction is marked pending and uploaded to the server on the next sync

The 7-Second Target
Step	Time
Cashier enters price	1–2s
Student taps card	0.5s
Local lookup + debit	< 0.1s
Receipt print + screen confirmation	1–2s
Total	< 5s
Core Principle
QR card = identity. Server = wallet. POS = fast local ledger. Sync = reconciliation.

Every design decision follows from this.

The card is a static identity token — nothing more

The wallet lives on the server

The POS web app keeps a local copy of balances (IndexedDB) so payments work instantly and offline

Sync keeps everything consistent

Never store balance on the card. Never require a network call at checkout.

System Architecture
text
┌──────────────┐         ┌──────────────────┐         ┌─────────────────┐
│ Student Web  │────────▶│   Backend API    │◀────────│   Admin Web     │
│ App (browser)│         │  + Database      │         │  (refunds,      │
│              │         │                  │         │   reports)      │
└──────────────┘         └────────┬─────────┘         └─────────────────┘
                                  │
                    ┌─────────────┼─────────────┐
                    │             │             │
              ┌─────▼─────┐ ┌────▼────┐ ┌──────▼──────┐
              │ Paystack  │ │ Sync    │ │ Sync        │
              │ Webhook   │ │ (Wi-Fi) │ │ (Wi-Fi)     │
              └───────────┘ └────┬────┘ └──────┬──────┘
                                 │             │
                          ┌──────▼─────┐ ┌─────▼──────┐
                          │ POS 1      │ │ POS 2      │  ...
                          │ (browser   │ │ (browser   │
                          │  PWA +     │ │  PWA +     │
                          │  IndexedDB)│ │  IndexedDB)│
                          └────────────┘ └────────────┘
Components
Student Web App
Browser-based, mobile-first

Paystack checkout integration

Read-only view of balance and transactions

Lost/stolen card reporting

Digital receipts after sync

Terminal Web App (PWA on POS browser)
Runs in the POS browser — no app install required

Service worker for offline caching and startup

IndexedDB for cached balances and pending transactions

Numeric keypad for fast price entry

QR scanning:

Primary: USB or Bluetooth 2D scanner acting as a keyboard-wedge input (fastest, most reliable, no camera permissions)

Fallback: POS camera via getUserMedia + a JS QR library (ZXing, html5-qrcode, or jsQR)

Thermal receipt printing via the POS browser's print pipeline (see Printing)

Background sync: uploads pending transactions, downloads updated balances and block list

Backend Server
Student account management

Paystack webhook handler (signature-verified, idempotent)

Wallet ledger (double-entry)

Transaction upload endpoint for terminals

Balance snapshot/delta endpoint for terminals

Card block/unblock management

Refund processing (admin-approved)

Daily reconciliation report

Admin Web App
Approve refunds

View per-cashier void and refund reports

Manage cards (issue, block, replace)

Manage terminals (onboard, disable, view sync status)

View reconciliation reports

Card
Plastic or laminated paper

Printed QR code containing a random 12–16 character ID

High-contrast, large QR for fast scanning under cafeteria lighting

Terminal Behaviour Rules
Situation	Terminal Behaviour
Unreadable / failed scan	Red "Scan failed — try again" + Rescan button. No debit.
Card blocked (hotlist)	Red "Card blocked — see admin". No debit. No balance shown.
Insufficient balance	Red "Insufficient — ₦X available". No debit, no partial.
Wrong student scanned	Debit completes; confirmation screen shows name + balance + amount with a VOID button. Cashier voids immediately → balance restored locally, no receipt printed, re-scan correct card.
Duplicate scan within 10 seconds	Ignored (debounce). Prevents double-charge from jittery scanner.
Damaged / unreadable QR	Manual entry fallback: cashier types last 4 characters of card ID, selects student from short list, confirms. Slow path only.
Terminal offline past its limit	Big red banner "Terminal offline too long — call admin". Stops accepting payments until synced.
UX rules:

VOID button on the same screen as approval — no menus, no navigation

Large green "Approved" with amount; nothing else competes for the cashier's attention

Sync status indicator always visible: 🟢 synced / 🟡 pending / 🔴 offline too long

Void & Refund Policy
Void (terminal-side, immediate)
Rule	Detail
Allowed when	Only on the confirmation screen, within 90 seconds, before receipt is handed over
Mechanics	Local balance restored; transaction marked VOID; receipt not printed (or "VOID" slip printed if already out — cashier keeps it)
Fraud guard	Max 3 voids per cashier per shift before admin alert
Refund (server-side, after the fact)
Rule	Detail
Allowed when	Receipt already handed over, or transaction already synced
Who approves	Cafeteria manager or TapNPay admin via admin panel
Mechanics	Wallet credited; two ledger entries written (PURCHASE debit + REFUND credit); reason logged
Paystack	No Paystack call. Money is already in the cafeteria wallet; pure bookkeeping
Reporting	Weekly refund report per cashier and per cafeteria
Data Model
Terminal Local Store (IndexedDB)
The POS web app keeps three object stores:

js
// balances — cached card balances, refreshed on sync
{
  card_id:      "a3f2k9m2p7q1",   // key
  student_name: "John O.",
  balance:      150000,            // kobo
  version:      42,                // server version for conflict detection
  blocked:      0
}

// transactions — local log, uploaded on sync
{
  txn_id:      "7f3a-9b2c",        // key, UUID generated on POS
  card_id:     "a3f2k9m2p7q1",
  amount:      150000,             // kobo
  terminal_id: "T-003",
  cashier_id:  "c-019",
  created_at:  "2026-10-20T12:34:56Z",
  status:      "PENDING",          // PENDING | VOID | SYNCED
  synced_at:   null
}

// sync_state — key/value metadata
// last_sync_at, offline_txn_count, offline_txn_value, terminal_id, auth_token
Note: If you prefer SQL, SQLite compiled to WASM (e.g. sql.js or wa-sqlite) works well inside the browser and persists to IndexedDB. IndexedDB directly is simpler for MVP; SQLite+WASM is a good upgrade if queries get complex.

Server Database
sql
-- Student accounts
CREATE TABLE students (
    student_id TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    email      TEXT,
    phone      TEXT,
    created_at TEXT NOT NULL
);

-- Cards
CREATE TABLE cards (
    card_id    TEXT PRIMARY KEY,   -- random 12-16 char
    student_id TEXT NOT NULL REFERENCES students(student_id),
    blocked    INTEGER DEFAULT 0,
    issued_at  TEXT NOT NULL
);

-- Double-entry ledger
CREATE TABLE ledger (
    entry_id    TEXT PRIMARY KEY,
    card_id     TEXT NOT NULL,
    type        TEXT NOT NULL,      -- TOPUP | PURCHASE | REFUND | VOID
    amount      INTEGER NOT NULL,   -- positive = credit, negative = debit
    reference   TEXT,               -- Paystack ref, txn_id, refund id
    terminal_id TEXT,
    cashier_id  TEXT,
    created_at  TEXT NOT NULL,
    metadata    TEXT                -- JSON
);

-- Terminal registry
CREATE TABLE terminals (
    terminal_id  TEXT PRIMARY KEY,
    location     TEXT NOT NULL,
    last_sync_at TEXT,
    disabled     INTEGER DEFAULT 0
);
Sync Strategy
When terminals sync
Timer: every 2–5 minutes when Wi-Fi is available

Opportunistic: immediately when Wi-Fi comes back after an outage

End of day: always sync before close

What syncs
Direction	Data
Terminal → Server	Batch of PENDING transactions
Server → Terminal	Updated balance deltas, block list (hotlist), terminal config
Offline safety limits
Limit	Suggested value
Max single purchase	₦2,000
Max cumulative offline spend per student	₦5,000
Max offline transactions per terminal	200 (or ₦100,000 total)
Max time offline before terminal locks	4 hours
When any limit is hit, the terminal shows a red banner and stops accepting payments until it syncs.

Conflict handling
Server is source of truth

If a terminal uploads a transaction that would overdraw the account (double-spend), the server accepts the transaction (student ate the food) but flags the account and notifies admin

The student's balance goes negative in the ledger; they must top up before using the card again

Printing
Printing from a browser to a POS thermal printer is the one part of this design that needs validation in Phase 1. Three realistic options:

Option	How it works	When to use
Browser print dialog	window.print() with a CSS @media print receipt layout sized to the paper width	Works if the POS has a printer driver exposed to the browser
POS SDK / bridge	A small local service (or the POS vendor's JS SDK) exposes a print endpoint the browser calls	Needed if window.print() doesn't reach the thermal printer cleanly
Direct ESC/POS over WebUSB / WebBluetooth	Browser talks to the printer directly	Only if the POS supports WebUSB or WebBluetooth and the printer speaks ESC/POS
Action for Phase 1: test window.print() on the actual school POS model before committing. If it doesn't work, fall back to the vendor SDK. Design the receipt as a fixed-width CSS layout so it works in either path.

Security & Risk Management
Risk	Mitigation
Double-spending across offline terminals	Per-student offline spend cap; frequent sync; server flags overdrafts
Card cloning / sharing	Random 12–16 char ID (not matric number); block list synced to terminals
Lost/stolen card	Block via app or admin → pushed to terminals on next sync (≤5 min latency)
Cashier fraud (fake voids)	Void cap (3/shift); weekly void report per cashier
Collusion (cashier + student)	Weekly refund report; reconciliation invariant checked daily
Paystack webhook replay	Signature verification + idempotency keyed by payment reference
Terminal compromise	Offline transaction limits; remote disable from admin panel; terminal auth token revoked
Clock drift	NTP not available in browser — validate Date.now() against server time on every sync; store offset
Browser storage cleared	POS clears IndexedDB → app must re-sync before accepting payments (guard: require successful sync on startup)
Hardware
Per Terminal
Component	Purpose	Approx. Cost
School's existing Android POS terminal (with a browser)	Runs the POS web app; screen, thermal printer, network	₦0 (existing) or ₦80k–₦200k if dedicated
USB or Bluetooth 2D QR scanner (keyboard-wedge)	Scans card QR — acts as fast keyboard input, no camera needed	₦15k–₦40k
Cards
Item	Approx. Cost
Plastic card with printed QR	₦100–₦300 each
Laminated paper card	₦20–₦50 each
Receipt Specification
The receipt is a bearer instrument — the student hands it to the food server to collect the meal. It must be non-forgeable at a glance.

Printed receipt content
text
┌─────────────────────────────────┐
│        [CAFETERIA NAME]         │
│      Terminal: T-003            │
│─────────────────────────────────│
│                                 │
│         ₦ 1,500.00              │   ◀── LARGE
│                                 │
│  Student: John O. (…A3F2)       │
│  Date: 2026-10-20  12:34:56     │
│  Txn: 7f3a-9b2c                 │
│  Code: K7M2PQ                   │   ◀── 6-char verification code
│                                 │
│           PAID                  │
│─────────────────────────────────│
│  Keep this receipt.             │
│  It is your meal voucher.       │
└─────────────────────────────────┘
Rules
Amount printed in largest font on the receipt

6-character code derived from txn_id — allows manual verification if disputed

Receipt not printed on void (or "VOID" slip if already out)

Digital copy pushed to the student web app after sync

Reconciliation Invariant
This must hold at all times:

Sum of all student wallet balances = Cafeteria Paystack balance − withdrawals − Paystack fees

A daily reconciliation report is auto-generated and checked. If it doesn't balance, an alert is sent the same day.

Implementation Phases
Phase	Activities	Deliverable
1. Design & Validation	Finalize card ID format, receipt layout, void/refund policy (get school sign-off). Validate browser printing on the actual POS model. Confirm QR scanner works as keyboard-wedge.	Architecture doc, signed policy, POS print + scan validated
2. Terminal Web App	Build the PWA: service worker, IndexedDB cache, QR input handling, price keypad, debit flow, receipt print, void button.	Working PWA doing offline debits on a test POS
3. Backend & Wallet	Build API: student accounts, Paystack webhook (idempotent), ledger, card management.	Server that can create accounts, receive top-ups, hold balances
4. Sync & Reconciliation	PWA sync client + server sync endpoints. Daily reconciliation report.	End-to-end: offline debit → sync → server ledger matches
5. Pilot	2–3 POS terminals at one cafeteria, 20–50 students, fake balances for 1–2 weeks. Simulate offline, double-spend, wrong amounts, lost cards.	Validated pilot with real transaction data
6. Rollout	Scale to all cafeterias. Real top-ups with low limits first. Establish support line (WhatsApp/phone).	Fully operational TapNPay
Tech Stack (suggested, not locked)
Layer	Options
Student web app	React / Vue / Svelte + Tailwind, mobile-first
Terminal web app	React / Vue / Svelte, PWA (service worker + IndexedDB via idb)
QR decoding (camera fallback)	html5-qrcode, jsQR, or @zxing/browser
Printing	window.print() + CSS, or POS vendor SDK
Backend	NestJS API
Database	PostgreSQL (ledger, accounts)
Paystack	Server-side webhook + inline JS in student app
Operational Notes
Power: Private school with solar — but put the POS thermal printer on the same UPS

Cleaning: Food environment = grease and spills. POS enclosure matters

Support: Students need a WhatsApp/phone line for "my balance is wrong"

Minimum top-up: Set a floor (e.g., ₦500) to avoid Paystack fees eating small top-ups

Clock: Validate Date.now() against server time on every sync; store the offset and apply it to created_at so receipts are accurate

Terms: One-paragraph policy on top-ups, refunds, and liability if a card is lost — displayed in the student web app

Open Decisions (Confirm Before Build)
Who approves refunds? (Cafeteria manager? TapNPay admin? Both?)

What is the void cap per cashier per shift? (Suggested: 3)

What POS model does the school use, and does its browser support printing to the thermal printer? — validate in Phase 1

Does the POS have a camera, or will you supply a USB/Bluetooth keyboard-wedge scanner?

What NOT to Do
❌ Do not store balance on the card

❌ Do not require OTP, PIN, or token at checkout

❌ Do not query the server synchronously on every tap

❌ Do not try to "update" a printed QR code after top-up

❌ Do not route refunds through Paystack

❌ Do not build custom hardware — use the school's POS

❌ Do not assume browser printing works — test it on the real POS first

Status
Phase: Pre-build — architecture locked, pending school sign-off on void/refund policy and Phase 1 validation of POS printing and scanning.

Next artefact: Terminal PWA scaffold + sync payload format.