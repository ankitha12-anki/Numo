# Numo.com Backend (Scientific Calculator)

This is the production-ready Django REST Framework backend for the Numo scientific calculator.

## Tech Stack
- Python / Django / DRF
- Supabase (PostgreSQL)
- SimpleJWT (Auth)
- Gmail SMTP (OTP)

## Project Structure
```
backend/
├── manage.py
├── config/              # main project settings
├── apps/
│   ├── authentication/  # Registration, JWT, OTP-based password reset
│   ├── calculator/      # Safe expression evaluation
│   ├── history/         # User calculation history
│   └── core/            # Utilities (Email, OTP generation)
├── requirements.txt
└── .env.example
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Environment Variables
Copy `.env.example` to `.env` and fill in your credentials:
- `SECRET_KEY`: Generate a secure random string.
- `DATABASE_URL`: Your Supabase PostgreSQL connection string.
- `EMAIL_HOST_USER`: Your Gmail address.
- `EMAIL_HOST_PASSWORD`: Your Gmail App Password.

### 3. Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Run Server
```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Create new account
- `POST /api/auth/login/` - Get JWT tokens
- `POST /api/auth/forgot-password/` - Send OTP via email
- `POST /api/auth/verify-otp/` - Validate 6-digit code
- `POST /api/auth/reset-password/` - Reset using verified OTP

### Calculator
- `POST /api/calculate/` - { "expression": "sin(30)+log(10)" }

### History (Requires JWT)
- `GET /api/history/` - Get user history
- `POST /api/history/` - Save record { "expression": "...", "result": "..." }
- `DELETE /api/history/` - Clear history (or specific ID via ?id=...)
