# student-web

React SPA for students:
- Register and sign in through the NestJS API
- Restore authenticated sessions using the API's HTTP-only refresh cookie
- View student portal pages
- View digital receipts
- Report lost or stolen card

Set `VITE_API_URL` in `apps/student-web/.env` to the NestJS API origin, then
restart the student app. For example, enter your API's URL as the value; do not
include an API route path such as `/api/auth`. The checked-in `.env.example`
shows the required variable. The NestJS API must allow the student app origin in
`CORS_ORIGINS` and have its database, JWT, and email settings configured.
Registration requires email verification before sign-in.
Apply the NestJS schema migrations from `backend/api` with `pnpm run db:migrate`
before starting the API.
The NestJS API does not yet expose wallet, top-up, card-control, or transaction
history endpoints, so those student features remain unavailable.
