# 🤖 Nova — AI Customer Support System

An AI-powered Customer Support Platform built with **FastAPI**, **React**, **PostgreSQL**, and **Groq LLM**. Nova combines a RAG-based AI concierge with a full human-support ticketing system and an admin console — giving customers instant AI answers while keeping a human safety net for anything that needs one.

live Url : novaai-hassan-8c87.vercel.app

The project demonstrates practical implementation of **RAG (Retrieval-Augmented Generation)**, **JWT authentication**, **role-based access control**, and a **production-ready full-stack deployment**.

---

## 📌 Features

- 🤖 AI concierge chatbot powered by Groq (openai/gpt-oss-20b)
- 🔎 RAG-based knowledge retrieval (LangChain + ChromaDB + HuggingFace embeddings)
- 💬 Persistent multi-conversation chat history
- 🎫 Human support ticket system (priority levels, open/resolved tracking)
- 🔐 JWT-based authentication with role-based access (customer / admin)
- 🛡️ Admin console — manage users, view stats, activate/deactivate/delete accounts
- ⚡ FastAPI backend with async PostgreSQL (SQLAlchemy + Alembic migrations)
- 🎨 React + Vite frontend styled with Tailwind CSS
- ☁️ Fully deployed on cloud infrastructure (FastAPI Cloud + Vercel + Neon)

---

## 🏗️ How It Works

```
                    ┌─────────────────────┐
                    │   Customer Message   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   RAG Retriever      │
                    │ Search Knowledge Base│
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Groq LLM (Llama)   │
                    │ Generate AI Response │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  Needs a human?      │
                    └──────────┬──────────┘
                        Yes ▼       ▼ No
              ┌─────────────────┐  ┌──────────────┐
              │  Support Ticket │  │ AI Answer sent│
              │     Created     │  │  to customer  │
              └─────────────────┘  └──────────────┘
```

## 🧠 Core Flow

### 1. Customer Chat
The customer talks to the AI concierge through the Console. The RAG pipeline searches the knowledge base for relevant context before Groq's Llama model generates a response.

### 2. Escalation via Tickets
If the AI can't resolve the issue, the customer can raise a support ticket with a subject, description, and priority (Low / Medium / High) — tracked from **open** to **resolved**.

### 3. Admin Oversight
Admins log in through the same portal and get access to `/admin` — a dashboard showing total users, conversations, tickets, and per-user management tools (activate, deactivate, delete, change role).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| 🐍 Backend | FastAPI (Python) |
| 🗄️ Database | PostgreSQL (SQLAlchemy + Alembic) |
| 🤖 LLM | Groq (Llama 3.3 70B Versatile) |
| 🔎 RAG | LangChain + ChromaDB + HuggingFace Embeddings |
| ⚛️ Frontend | React + Vite |
| 🎨 Styling | Tailwind CSS |
| 🔐 Auth | JWT (OAuth2 password flow) |
| ☁️ Backend Hosting | FastAPI Cloud |
| ☁️ Frontend Hosting | Vercel |
| ☁️ Database Hosting | Neon (serverless Postgres) |

---

## 📂 Project Structure

```
AI-Customer-Support-System/
│
├── backend/
│   ├── app/
│   │   ├── api/v1/          # auth, conversation, tickets, admin routes
│   │   ├── core/            # config, dependencies (auth guards)
│   │   ├── db/models/       # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── ai/              # RAG service, Groq integration
│   │   ├── rag/             # retriever, ingest pipeline
│   │   └── main.py
│   ├── alembic/             # DB migrations
│   ├── test_data/           # knowledge base source files
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # Login, Register, Dashboard, Tickets, Admin
│   │   ├── components/
│   │   ├── context/         # AuthContext
│   │   └── lib/api.js       # API client
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/HR-Builds/AI-Customer-Support-System.git
cd AI-Customer-Support-System
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux / macOS

pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:
```
DATABASE_URL=postgresql+psycopg2://user:password@localhost:5432/nova
SECRET_KEY=your-random-secret-key
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=openai/gpt-oss-20b
```

Run migrations and start the server:
```bash
alembic upgrade head
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Secret used to sign JWTs |
| `GROQ_API_KEY` | API key for Groq LLM access |
| `GROQ_MODEL` | Groq model name (e.g. `openai/gpt-oss-20b`) |
| `VITE_API_URL` | (Frontend) Base URL of the deployed backend |

⚠️ **Never commit `.env` files or API keys to GitHub.** Make sure `.gitignore` includes:
```
.env
.env.*
!.env.example
venv/
__pycache__/
chroma_db/
```

---

## 🔐 Admin Access

There is no separate admin login page — admin access is role-based. To promote a user to admin, update their role directly in the database:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

After logging in again, the admin can visit `/admin` to access the console.

---

## ☁️ Deployment

- **Backend** → deployed on [FastAPI Cloud](https://fastapicloud.com)
- **Frontend** → deployed on [Vercel](https://vercel.com)
- **Database** → hosted on [Neon](https://neon.tech) (serverless Postgres)

CORS is configured in `backend/app/main.py` to allow the deployed frontend origin.

---

## 🎯 Project Objectives

This project was built to demonstrate practical implementation of:
- Full-stack application architecture (FastAPI + React)
- Retrieval-Augmented Generation (RAG)
- JWT authentication & role-based access control
- Relational database design with migrations
- Production deployment across multiple cloud providers

---

## 🔄 Future Improvements

- 📎 File attachments on tickets
- 📧 Email notifications for ticket updates
- 📊 Analytics dashboard with charts
- 🌐 Multi-language support
- 🔔 Real-time updates via WebSockets

---

## 👨‍💻 Author

**Hassan**

Currently learning:
- 🐍 Python · ⚡ FastAPI
- 🔎 RAG Systems · 🤖 AI Chatbot Development
- ⚛️ React · 🧠 Full-stack deployment

---

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.

## 📜 License

This project is intended for educational and portfolio purposes.
