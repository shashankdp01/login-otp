# OTP Based User Login

Three layers: **React (Vite)** frontend, **Django REST Framework** API, **Postgres** database.

## Run locally
```bash
# API (uses SQLite locally if DATABASE_URL is not set)
cd backend && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver          # http://localhost:8000

# Frontend
cd frontend && cp .env.example .env && npm install && npm run dev   # http://localhost:5173
```

## API
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/register/` | `{email, first_name, last_name}` → `{code}` (6 digits, shown once, stored hashed) |
| GET | `/api/recognize/?email=` | `{registered: bool}` |
| POST | `/api/verify/` | `{email, code}` → `{token, first_name, last_name}` or 400 |
| POST | `/api/checkout/` | `{email, phone, shipping_address}` with `Authorization: Bearer <token>`. Returns 401 if not signed in, 403 if the email differs from the account. Phone is validated and stored as E.164 |

## Database
`db/schema.sql` holds the Postgres schema (users, checkouts). Run it in the Supabase SQL editor, or let `python manage.py migrate` create the same tables.

## Deploy (all free tier)
1. **Database:** create a Supabase project, run `db/schema.sql`, copy the Postgres connection string (use the pooler URI).
2. **API on Render** (Web Service, root dir `backend`):
   - Build: `pip install -r requirements.txt && python manage.py migrate`
   - Start: `gunicorn config.wsgi`
   - Env: `DATABASE_URL`, `SECRET_KEY` (random), `DEBUG=0`, `ALLOWED_HOSTS=<your-api>.onrender.com`, `CORS_ALLOWED_ORIGINS=https://<your-app>.vercel.app`
   - Note: if you ran `schema.sql` first, run `python manage.py migrate --fake-initial` instead.
3. **Frontend on Vercel** (root dir `frontend`, framework Vite): env `VITE_API_URL=https://<your-api>.onrender.com`.
4. Push to GitHub, then add `boltapp-hiring` as a collaborator (Settings → Collaborators).

## Notes
- The recognize endpoint reveals whether an email is registered, as the brief requires. It is rate limited (60/min) and `/verify/` is limited to 10/min per IP.
- Login tokens are signed and expire after 24 hours.
