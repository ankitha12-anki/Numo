# Numo.com — Scientific Calculator 🚀

A premium, modern, and production-ready scientific calculator with authentication, cloud history tracking, and a secure Django backend.

## 🌟 Features
- **Scientific Calculations**: Support for `sin`, `cos`, `tan`, `log`, `ln`, `sqrt`, `pi`, `e`, and more.
- **User Authentication**: Secure JWT-based registration and login.
- **OTP Password Reset**: 6-digit email verification via Gmail SMTP.
- **Cloud History**: Every calculation is saved to a **Supabase (PostgreSQL)** database.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a fluid, "alive" experience.

---

## 🛠️ Tech Stack
- **Frontend**: React (TypeScript), Vite, Tailwind CSS, Framer Motion.
- **Backend**: Python, Django, Django REST Framework (DRF).
- **Database**: Supabase (PostgreSQL).
- **Auth**: SimpleJWT & OTP-based verification.

---

## 🚀 Setup Instructions

### 1. Backend Setup (Django)
```bash
# Navigate to backend directory
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file from .env.example and fill in:
# - DATABASE_URL (from Supabase)
# - EMAIL_HOST_USER & EMAIL_HOST_PASSWORD (from Gmail App Password)

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver 127.0.0.1:8000
```

### 2. Frontend Setup (React)
```bash
# In a new terminal, navigate to project root
npm install

# Run the development server
npm run dev
```
Open your browser to `http://localhost:3000`.

---

## 🛡️ Security
- **Safe Evaluation**: Backend uses `simpleeval` instead of `eval()` to prevent code injection.
- **Input Validation**: All API endpoints use DRF Serializers for strict data validation.
- **Password Hashing**: Django's industry-standard PBKDF2 hashing.

---

## 📅 Project Details
- **Project Name**: Numo.com
- **Author**: Ankit
- **Stack**: Full-Stack (React + Django + Supabase)
