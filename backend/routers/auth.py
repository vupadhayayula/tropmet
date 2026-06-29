from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional
import bcrypt, secrets, smtplib, ssl, threading
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta

from ..core.database import get_db
from ..core.config import settings

router = APIRouter(prefix="/api/auth", tags=["Auth"])

# ── In-memory verification token store ──
_pending_verifications: dict = {}
_verified_emails: set = set()

# ──────────────────────────────────────────────────────────────────────
# Pydantic models
# ──────────────────────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    institution: Optional[str] = None
    designation: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class VerifyEmailRequest(BaseModel):
    token: str

# ──────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def _send_email_thread(to_email: str, token: str, full_name: str):
    """Runs in a background thread — never blocks the API response."""
    verify_url = f"{settings.FRONTEND_URL}/verify-email?token={token}"

    subject = "TROPMET 2026 — Verify Your Email Address"

    # Plain text fallback
    text_body = f"""Dear {full_name},

Thank you for registering as an author for TROPMET 2026 (PRaGaTI).

Please verify your email address by clicking the button in this email,
or copy the link below into your browser:
{verify_url}

This link will expire in 24 hours.

If you did not register on the TROPMET 2026 portal, please ignore this email.

Regards,
TROPMET 2026 Secretariat
NCMRWF, Ministry of Earth Sciences, Noida
"""

    # HTML body with a button (token is hidden inside the link)
    html_body = f"""
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f7fc; padding: 30px;">
  <div style="max-width: 520px; margin: auto; background: white; border-radius: 12px;
              padding: 40px; box-shadow: 0 2px 12px rgba(0,0,0,0.08);">

    <div style="text-align:center; margin-bottom: 24px;">
      <h1 style="color: #0b2d5e; font-size: 22px; margin: 0;">TROPMET 2026</h1>
      <p style="color: #666; font-size: 13px; margin: 4px 0 0;">PRaGaTI · NCMRWF, Noida</p>
    </div>

    <p style="color: #333; font-size: 15px;">Dear <strong>{full_name}</strong>,</p>

    <p style="color: #333; font-size: 15px; line-height: 1.6;">
      Thank you for registering as an author for <strong>TROPMET 2026</strong>.
      Please click the button below to verify your email address and activate your account.
    </p>

    <div style="text-align: center; margin: 32px 0;">
      <a href="{verify_url}"
         style="background: #0b2d5e; color: white; padding: 14px 36px;
                border-radius: 8px; text-decoration: none; font-size: 15px;
                font-weight: bold; display: inline-block;">
        ✓ &nbsp; Verify My Email
      </a>
    </div>

    <p style="color: #888; font-size: 12px; text-align: center; line-height: 1.6;">
      This link expires in <strong>24 hours</strong>.<br>
      If you did not register, please ignore this email.
    </p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
    <p style="color: #aaa; font-size: 11px; text-align: center; margin: 0;">
      TROPMET 2026 Secretariat · NCMRWF, Ministry of Earth Sciences, Noida<br>
      <a href="mailto:imsnoidachapter@gmail.com" style="color: #c8960a;">imsnoidachapter@gmail.com</a>
    </p>
  </div>
</body>
</html>
"""

    smtp_host = settings.SMTP_HOST
    smtp_user = settings.SMTP_USER
    smtp_pass = settings.SMTP_PASS

    print(f"[EMAIL] Sending to {to_email} via {smtp_host} as {smtp_user}")

    if smtp_host and smtp_user and smtp_pass:
        try:
            msg = MIMEMultipart("alternative")
            msg["From"]    = f"TROPMET 2026 <{smtp_user}>"
            msg["To"]      = to_email
            msg["Subject"] = subject
            msg.attach(MIMEText(text_body, "plain"))
            msg.attach(MIMEText(html_body, "html"))   # HTML takes priority

            context = ssl.create_default_context()
            with smtplib.SMTP_SSL(smtp_host, 465, context=context, timeout=15) as s:
                s.login(smtp_user, smtp_pass)
                s.sendmail(smtp_user, to_email, msg.as_string())

            print(f"[EMAIL] SUCCESS — sent to {to_email}")
        except Exception as e:
            print(f"[EMAIL ERROR] {type(e).__name__}: {e}")
            print(f"[EMAIL FALLBACK] Verify URL: {verify_url}")
    else:
        print(f"\n[EMAIL — DEV MODE]\nTo: {to_email}\nVerify URL: {verify_url}\n")

def send_verification_email(to_email: str, token: str, full_name: str):
    """Fire-and-forget: spawns a daemon thread so API returns immediately."""
    t = threading.Thread(
        target=_send_email_thread,
        args=(to_email, token, full_name),
        daemon=True
    )
    t.start()

# ──────────────────────────────────────────────────────────────────────
# Routes
# ──────────────────────────────────────────────────────────────────────
@router.post("/register")
async def register(data: RegisterRequest, db: Session = Depends(get_db)):
    from ..models.models import User

    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered. Please login.")

    token = secrets.token_urlsafe(32)
    _pending_verifications[token] = {
        "user_data": {
            "full_name":     data.full_name,
            "email":         data.email,
            "password_hash": hash_password(data.password),
            "phone":         data.phone,
            "institution":   data.institution,
            "designation":   data.designation,
            "role":          "author",
        },
        "expires": datetime.utcnow() + timedelta(hours=24),
    }

    # Non-blocking — returns before email finishes sending
    send_verification_email(data.email, token, data.full_name)

    return {
        "message": "Registration initiated. Please check your email and click the verification link to activate your account.",
        "email": data.email,
    }


@router.post("/verify-email")
def verify_email(data: VerifyEmailRequest, db: Session = Depends(get_db)):
    from ..models.models import User

    entry = _pending_verifications.get(data.token)
    if not entry:
        raise HTTPException(status_code=400, detail="Invalid or expired verification link.")
    if datetime.utcnow() > entry["expires"]:
        del _pending_verifications[data.token]
        raise HTTPException(status_code=400, detail="Verification link has expired. Please register again.")

    ud = entry["user_data"]

    existing = db.query(User).filter(User.email == ud["email"]).first()
    if existing:
        del _pending_verifications[data.token]
        raise HTTPException(status_code=400, detail="Email already verified and registered.")

    user = User(
        full_name=ud["full_name"],
        email=ud["email"],
        password_hash=ud["password_hash"],
        phone=ud.get("phone"),
        institution=ud.get("institution"),
        designation=ud.get("designation"),
        role=ud["role"],
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    del _pending_verifications[data.token]
    _verified_emails.add(ud["email"])

    return {
        "message": "Email verified successfully! Your account is now active. You can login.",
        "email": user.email,
        "name": user.full_name,
    }


@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):
    from ..models.models import User

    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account not activated. Please verify your email first.")
    if not check_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")

    token = secrets.token_urlsafe(32)

    return {
        "message": "Login successful",
        "user": {
            "id":    user.id,
            "name":  user.full_name,
            "email": user.email,
            "role":  user.role,
        },
        "token": token,
    }


@router.get("/me")
def get_me(email: str, db: Session = Depends(get_db)):
    from ..models.models import User
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id":          user.id,
        "name":        user.full_name,
        "email":       user.email,
        "role":        user.role,
        "institution": user.institution,
        "designation": user.designation,
    }