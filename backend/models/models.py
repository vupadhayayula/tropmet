from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Date, Enum, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..core.database import Base
import enum

class PaymentStatus(str, enum.Enum):
    pending = "pending"
    paid = "paid"
    failed = "failed"

class AbstractStatus(str, enum.Enum):
    submitted = "submitted"
    under_review = "under_review"
    accepted = "accepted"
    rejected = "rejected"
    revision_requested = "revision_requested"

class UserRole(str, enum.Enum):
    author = "author"
    reviewer = "reviewer"
    admin = "admin"

# ── USERS TABLE (authors, reviewers, admins) ──────────────────────────────────
class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    full_name     = Column(String(255), nullable=False)
    email         = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    phone         = Column(String(20))
    institution   = Column(String(500))
    designation   = Column(String(255))
    role          = Column(String(20), default="author", index=True)
    is_active     = Column(Boolean, default=True)
    created_at    = Column(DateTime, server_default=func.now())
    updated_at    = Column(DateTime, server_default=func.now(), onupdate=func.now())
    abstracts     = relationship("Abstract", back_populates="author", foreign_keys="Abstract.author_id")

class Registration(Base):
    __tablename__ = "registrations"
    id                  = Column(Integer, primary_key=True, index=True)
    full_name           = Column(String(255), nullable=False)
    email               = Column(String(255), nullable=False)
    phone               = Column(String(20), nullable=False)
    institution         = Column(String(500))
    category            = Column(String(100), nullable=False)
    payment_status      = Column(String(20), default="pending")
    razorpay_order_id   = Column(String(255))
    razorpay_payment_id = Column(String(255))
    amount              = Column(Numeric(10, 2))
    early_bird          = Column(Boolean, default=False)
    created_at          = Column(DateTime, server_default=func.now())
    updated_at          = Column(DateTime, server_default=func.now(), onupdate=func.now())
    abstracts           = relationship("Abstract", back_populates="registration")

class Abstract(Base):
    __tablename__ = "abstracts"
    id                  = Column(Integer, primary_key=True, index=True)
    author_id           = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=True)
    registration_id     = Column(Integer, ForeignKey("registrations.id", ondelete="SET NULL"), nullable=True)
    co_authors          = Column(Text)         # JSON string: [{name, email, institution}]
    title               = Column(String(500), nullable=False)
    abstract_text       = Column(Text, nullable=False)
    theme               = Column(String(255))
    keywords            = Column(String(500))
    presentation_type   = Column(String(20), default="either")  # oral/poster/either
    file_path           = Column(String(500))
    status              = Column(String(50), default="submitted")
    reviewer_comments   = Column(Text)
    admin_remarks       = Column(Text)
    razorpay_payment_id = Column(String(255))
    utr                 = Column(String(255))
    submitted_at        = Column(DateTime, server_default=func.now())
    updated_at          = Column(DateTime, server_default=func.now(), onupdate=func.now())
    author              = relationship("User", back_populates="abstracts", foreign_keys=[author_id])
    registration        = relationship("Registration", back_populates="abstracts")

class ReviewerAssignment(Base):
    __tablename__ = "reviewer_assignments"
    id          = Column(Integer, primary_key=True, index=True)
    abstract_id = Column(Integer, ForeignKey("abstracts.id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, server_default=func.now())
    deadline    = Column(Date)

class Review(Base):
    __tablename__ = "reviews"
    id            = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(Integer, ForeignKey("reviewer_assignments.id", ondelete="CASCADE"))
    abstract_id   = Column(Integer, ForeignKey("abstracts.id", ondelete="CASCADE"))
    reviewer_id   = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    decision      = Column(String(20))   # accept/reject/revision
    originality   = Column(Integer)
    relevance     = Column(Integer)
    clarity       = Column(Integer)
    overall_score = Column(Integer)
    comments      = Column(Text)
    internal_notes= Column(Text)
    reviewed_at   = Column(DateTime, server_default=func.now())

class Announcement(Base):
    __tablename__ = "announcements"
    id         = Column(Integer, primary_key=True, index=True)
    title      = Column(String(500), nullable=False)
    content    = Column(Text, nullable=False)
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

class ImportantDate(Base):
    __tablename__ = "important_dates"
    id            = Column(Integer, primary_key=True, index=True)
    event_name    = Column(String(255), nullable=False)
    event_date    = Column(Date, nullable=False)
    is_deadline   = Column(Boolean, default=False)
    display_order = Column(Integer, default=0)

class Gallery(Base):
    __tablename__ = "gallery"
    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(255))
    image_url   = Column(String(500), nullable=False)
    category    = Column(String(100))
    uploaded_at = Column(DateTime, server_default=func.now())

class Speaker(Base):
    __tablename__ = "speakers"
    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(255), nullable=False)
    designation = Column(String(255))
    institution = Column(String(255))
    bio         = Column(Text)
    photo_url   = Column(String(500))
    talk_title  = Column(String(500))
    talk_date   = Column(Date)
    is_keynote  = Column(Boolean, default=False)

class Sponsor(Base):
    __tablename__ = "sponsors"
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String(255), nullable=False)
    logo_url      = Column(String(500))
    website       = Column(String(500))
    tier          = Column(String(50), default="silver")
    display_order = Column(Integer, default=0)


class SpotRegistration(Base):
    __tablename__ = "spot_registrations"
    id                  = Column(Integer, primary_key=True, index=True)
    full_name           = Column(String(255), nullable=False)
    email               = Column(String(255), nullable=False)
    phone               = Column(String(20), nullable=False)
    institution         = Column(String(500))
    category            = Column(String(100), nullable=False)
    payment_status      = Column(String(20), default="pending")
    razorpay_order_id   = Column(String(255))
    razorpay_payment_id = Column(String(255))
    amount              = Column(Numeric(10, 2))
    early_bird          = Column(Boolean, default=False)
    created_at          = Column(DateTime, server_default=func.now())
    updated_at          = Column(DateTime, server_default=func.now(), onupdate=func.now())