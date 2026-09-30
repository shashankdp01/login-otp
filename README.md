# OTP Based User Login

A full-stack OTP-based user authentication application built using **React (Vite)**, **Django REST Framework**, and **PostgreSQL**.

## 🚀 Live Demo

**Live Application:**  
https://login-otp-ten.vercel.app/

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- CSS

### Backend
- Python
- Django
- Django REST Framework
- Gunicorn

### Database
- PostgreSQL
- Supabase

### Deployment
- Vercel
- Render
- Supabase

---

## ✨ Features

- OTP-based user registration
- User login and OTP verification
- Email registration recognition
- Secure authentication tokens
- Protected checkout API
- Phone number validation
- Shipping address management
- PostgreSQL database integration
- REST API architecture
- Responsive frontend
- Production deployment

---

## 📁 Project Structure

```text
login-otp/
│
├── backend/
│   ├── accounts/
│   ├── config/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── db/
│
├── .gitignore
├── README.md
└── prompts.md
```

---

# 💻 Running the Project Locally

## Prerequisites

Before installing the project, make sure the following software is installed on your computer:

- Python 3.10+
- Node.js 18+
- npm
- Git

You can verify the installations using:

```bash
python --version
```

```bash
node --version
```

```bash
npm --version
```

```bash
git --version
```

---

# 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/shashankdp01/login-otp.git
```

Move into the project directory:

```bash
cd login-otp
```

---

# 2. Backend Setup

Open the backend directory:

```bash
cd backend
```

## Create a Virtual Environment

### Windows

```bash
python -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

### Linux / macOS

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

---

## Install Backend Dependencies

Install all required Python packages:

```bash
pip install -r requirements.txt
```

The backend dependencies include:

- Django
- Django REST Framework
- django-cors-headers
- dj-database-url
- psycopg
- phonenumbers
- Gunicorn

---

# 3. Database Setup

## Local Development

The project can use SQLite for local development when `DATABASE_URL` is not configured.

Run Django migrations:

```bash
python manage.py migrate
```

This will create the required database tables.

---

# 4. Configure Backend Environment Variables

For local development, create a `.env` file inside the `backend` directory if your project configuration requires environment variables.

Example:

```env
SECRET_KEY=your-local-secret-key
DEBUG=1
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

> Do not commit your `.env` file to GitHub.

For production, the environment variables are configured directly on Render.

---

# 5. Start the Django Backend

From the `backend` directory, run:

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

Keep this terminal running.

---

# 6. Frontend Setup

Open a **new terminal**.

From the project root:

```bash
cd login-otp
```

Then move into the frontend:

```bash
cd frontend
```

Install the Node.js dependencies:

```bash
npm install
```

---

# 7. Configure Frontend Environment Variables

Create a file named:

```text
.env
```

inside the `frontend` directory.

Add:

```env
VITE_API_URL=http://127.0.0.1:8000
```

The frontend uses this variable to communicate with the Django backend.

Your local structure should now look like:

```text
frontend/
│
├── src/
├── package.json
├── vite.config.js
├── .env
└── .env.example
```

---

# 8. Start the React Frontend

From the `frontend` directory, run:

```bash
npm run dev
```

Vite will provide a URL similar to:

```text
http://localhost:5173
```

Open that URL in your browser.

---

# 🔄 Local Application Flow

When running locally, the application works like this:

```text
React Frontend
http://localhost:5173
        │
        │ REST API
        ▼
Django Backend
http://127.0.0.1:8000
        │
        │
        ▼
SQLite Database
```

---

# 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register a new user and generate an OTP |
| GET | `/api/recognize/?email=` | Check whether an email is registered |
| POST | `/api/verify/` | Verify the OTP and authenticate the user |
| POST | `/api/checkout/` | Submit checkout details for an authenticated user |

---

# 🔐 Authentication

After successful OTP verification, the backend generates a signed authentication token.

Protected API requests require the token in the request header:

```text
Authorization: Bearer <token>
```

Authentication tokens expire after 24 hours.

---

# 📱 Phone Number Validation

Phone numbers are validated using the `phonenumbers` Python library.

Numbers are stored in E.164 format.

Example:

```text
+919876543210
```

---

# 🌐 Production Deployment

The project is deployed using the following services:

| Component | Platform |
|-----------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Supabase PostgreSQL |

## Frontend

The React/Vite frontend is deployed on Vercel.

**Live URL:**

https://login-otp-ten.vercel.app/

Production environment variable:

```env
VITE_API_URL=https://otp-login-backend-jjps.onrender.com
```

---

## Backend

The Django REST API is deployed on Render.

**Backend URL:**

https://otp-login-backend-jjps.onrender.com

### Render Configuration

**Root Directory:**

```text
backend
```

**Build Command:**

```bash
pip install -r requirements.txt && python manage.py migrate
```

**Start Command:**

```bash
gunicorn config.wsgi
```

### Render Environment Variables

```env
SECRET_KEY=your-production-secret-key
DEBUG=0
DATABASE_URL=your-postgresql-connection-string
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=https://login-otp-ten.vercel.app
```

> Never publish the actual `SECRET_KEY` or `DATABASE_URL` in this README.

---

# 🗄️ Production Database

The production application uses PostgreSQL hosted on Supabase.

Django connects to PostgreSQL through the `DATABASE_URL` environment variable.

Example:

```env
DATABASE_URL=your-postgresql-connection-string
```

The actual database credentials should never be committed to GitHub.

---

# ⚙️ Environment Variables

## Backend

```env
SECRET_KEY=your-secret-key
DEBUG=1
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

For production:

```env
SECRET_KEY=your-production-secret-key
DEBUG=0
DATABASE_URL=your-postgresql-connection-string
ALLOWED_HOSTS=*
CORS_ALLOWED_ORIGINS=https://login-otp-ten.vercel.app
```

## Frontend

### Local

```env
VITE_API_URL=http://127.0.0.1:8000
```

### Production

```env
VITE_API_URL=https://otp-login-backend-jjps.onrender.com
```

---

# 🏗️ Deployment Architecture

```text
                   ┌─────────────────────┐
                   │       Vercel        │
                   │   React + Vite      │
                   └──────────┬──────────┘
                              │
                              │ REST API
                              ▼
                   ┌─────────────────────┐
                   │       Render        │
                   │ Django REST API     │
                   │      Gunicorn       │
                   └──────────┬──────────┘
                              │
                              │ PostgreSQL
                              ▼
                   ┌─────────────────────┐
                   │      Supabase       │
                   │     PostgreSQL      │
                   └─────────────────────┘
```

---

# 🧪 Development Workflow

For local development, run the backend and frontend in separate terminals.

### Terminal 1 — Backend

```bash
cd backend
.venv\Scripts\activate
python manage.py migrate
python manage.py runserver
```

### Terminal 2 — Frontend

```bash
cd frontend
npm install
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🔒 Security Notes

- Never commit `.env` files.
- Never commit database passwords.
- Never expose the Django `SECRET_KEY`.
- Use environment variables for production credentials.
- Do not commit `db.sqlite3` to the repository.
- Do not commit Python virtual environments such as `.venv` or `myenv`.
- Do not commit `node_modules`.

---

# 📌 Important Notes

The Render free web service may spin down after a period of inactivity. The first request after inactivity may therefore take longer.

The production frontend is available at:

https://login-otp-ten.vercel.app/

The production backend is available at:

https://otp-login-backend-jjps.onrender.com

---

## 👨‍💻 Author

**Shashank D P**

GitHub:  
https://github.com/shashankdp01