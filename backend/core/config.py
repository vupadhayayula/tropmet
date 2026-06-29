from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = "Navya@2005"
    DB_NAME: str = "tropmet2026"
    RAZORPAY_KEY_ID: str = "rzp_test_SxoYfVay7SLJNm"
    RAZORPAY_KEY_SECRET: str = "f5RFw8R1tpxLXQTVR9eHZpcS"
    SECRET_KEY: str = "changeme"
    FRONTEND_URL: str = "http://localhost:5173"
    UPLOAD_DIR: str = "uploads"
    SMTP_HOST: str = ""
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASS: str = ""

    class Config:
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        env_file_encoding = "utf-8"

settings = Settings()