# Running Signal locally

## 1. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env            # then fill in DATABASE_URL, SECRET_KEY, GROQ_API_KEY

alembic upgrade head            # creates all tables in your database

uvicorn app.main:app --reload   # runs on http://localhost:8000
```

Swagger docs: http://localhost:8000/docs
(Note: the "Authorize" padlock button in Swagger no longer works for `/auth/login`
since it now takes JSON, not a form. To test in Swagger, use the login endpoint's
"Try it out" with a JSON body, copy the `access_token` from the response, then
click Authorize and paste `Bearer <token>` manually.)

## 2. Frontend

```bash
cd frontend
npm install
npm run dev                     # runs on http://localhost:5173
```

The dev server proxies `/api/*` to `http://localhost:8000`, so make sure the
backend is running first. In production, point the proxy/base URL at your
deployed API instead.

## 3. Creating your first admin account

There's no public "become an admin" button (by design). Register a normal
account through the app, then promote it directly in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@company.com';
```

Log out and back in afterward so your session token reflects the new role.
Once you have one admin, you can promote/demote everyone else from the
Admin panel itself.
