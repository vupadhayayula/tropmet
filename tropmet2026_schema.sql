-- ============================================================
--  TROPMET 2026  –  Complete Database Schema
--  Generated from actual backend models + routers
--  Run this while already connected to tropmet2026 database:
--    USE tropmet2026;
-- ============================================================

SET FOREIGN_KEY_CHECKS = 0;
SET NAMES utf8mb4;

-- ─────────────────────────────────────────────────────────────
-- 1. USERS  (authors, reviewers, admins)
--    Used by: auth.py, abstracts.py, reviewer assignments
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    full_name     VARCHAR(255)  NOT NULL,
    email         VARCHAR(255)  NOT NULL UNIQUE,
    password_hash VARCHAR(255)  NOT NULL,
    phone         VARCHAR(20),
    institution   VARCHAR(500),
    designation   VARCHAR(255),
    role          VARCHAR(20)   NOT NULL DEFAULT 'author',  -- 'author' | 'reviewer' | 'admin'
    is_active     TINYINT(1)    NOT NULL DEFAULT 1,
    created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 2. REGISTRATIONS  (conference fee payments)
--    Used by: registration.py, payment.py
--    NOTE: paper_title + abstract columns needed by registration.py router
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(255)   NOT NULL,
    email               VARCHAR(255)   NOT NULL,
    phone               VARCHAR(20)    NOT NULL,
    institution         VARCHAR(500),
    category            VARCHAR(100)   NOT NULL,
    paper_title         VARCHAR(500),                        -- optional, from registration.py
    abstract            TEXT,                                -- optional, from registration.py
    payment_status      VARCHAR(20)    NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid' | 'failed'
    razorpay_order_id   VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    amount              DECIMAL(10,2),
    early_bird          TINYINT(1)     NOT NULL DEFAULT 0,
    created_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email          (email),
    INDEX idx_payment_status (payment_status),
    INDEX idx_order_id       (razorpay_order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 3. ABSTRACTS
--    Used by: abstracts.py, payment.py
--    NOTE: author_name column needed by both routers (used instead of FK in some flows)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS abstracts (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    author_id           INT,                                  -- FK to users (nullable for guest flow)
    registration_id     INT,                                  -- FK to registrations (nullable)
    author_name         VARCHAR(255),                         -- denormalized, used by abstracts.py & payment.py
    co_authors          TEXT,                                 -- JSON: [{name, email, institution}]
    title               VARCHAR(500)   NOT NULL,
    abstract_text       TEXT           NOT NULL,
    theme               VARCHAR(255),
    keywords            VARCHAR(500),
    presentation_type   VARCHAR(20)    NOT NULL DEFAULT 'either',  -- 'oral' | 'poster' | 'either'
    file_path           VARCHAR(500),
    status              VARCHAR(50)    NOT NULL DEFAULT 'submitted',
    reviewer_comments   TEXT,
    admin_remarks       TEXT,
    razorpay_payment_id VARCHAR(255),
    utr                 VARCHAR(255),
    submitted_at        DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id)       REFERENCES users(id)         ON DELETE CASCADE,
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE SET NULL,
    INDEX idx_author_id (author_id),
    INDEX idx_reg_id    (registration_id),
    INDEX idx_status    (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 4. REVIEWER ASSIGNMENTS
--    Used by: admin dashboard (AdminDashboardPage.tsx)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviewer_assignments (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    abstract_id INT NOT NULL,
    reviewer_id INT NOT NULL,
    assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deadline    DATE,
    FOREIGN KEY (abstract_id) REFERENCES abstracts(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id) REFERENCES users(id)     ON DELETE CASCADE,
    UNIQUE KEY uniq_assign (abstract_id, reviewer_id),
    INDEX idx_reviewer (reviewer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 5. REVIEWS
--    Used by: ReviewerPage.tsx, admin dashboard
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    assignment_id  INT,
    abstract_id    INT,
    reviewer_id    INT,
    decision       VARCHAR(20),       -- 'accept' | 'reject' | 'revision'
    originality    TINYINT UNSIGNED,  -- score 1-5
    relevance      TINYINT UNSIGNED,
    clarity        TINYINT UNSIGNED,
    overall_score  TINYINT UNSIGNED,
    comments       TEXT,
    internal_notes TEXT,              -- not visible to author
    reviewed_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES reviewer_assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (abstract_id)   REFERENCES abstracts(id)            ON DELETE CASCADE,
    FOREIGN KEY (reviewer_id)   REFERENCES users(id)                ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 6. ANNOUNCEMENTS
--    Used by: content.py → GET /api/announcements
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS announcements (
    id         INT AUTO_INCREMENT PRIMARY KEY,
    title      VARCHAR(500) NOT NULL,
    content    TEXT         NOT NULL,
    is_active  TINYINT(1)   NOT NULL DEFAULT 1,
    created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 7. IMPORTANT DATES
--    Used by: content.py → GET /api/dates
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS important_dates (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    event_name    VARCHAR(255) NOT NULL,
    event_date    DATE         NOT NULL,
    is_deadline   TINYINT(1)   NOT NULL DEFAULT 0,
    display_order INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 8. GALLERY
--    Used by: content.py → GET /api/gallery
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    title       VARCHAR(255),
    image_url   VARCHAR(500) NOT NULL,
    category    VARCHAR(100),
    uploaded_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 9. SPEAKERS
--    Used by: content.py → GET /api/speakers
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS speakers (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    institution VARCHAR(255),
    bio         TEXT,
    photo_url   VARCHAR(500),
    talk_title  VARCHAR(500),
    talk_date   DATE,
    is_keynote  TINYINT(1)   NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 10. SPONSORS
--    Used by: content.py → GET /api/sponsors
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sponsors (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    logo_url      VARCHAR(500),
    website       VARCHAR(500),
    tier          VARCHAR(50)  NOT NULL DEFAULT 'silver',  -- 'gold' | 'silver' | 'bronze'
    display_order INT          NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ─────────────────────────────────────────────────────────────
-- 11. SPOT REGISTRATIONS  (walk-in / on-venue)
--    Used by: SpotRegistrationPage.tsx
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS spot_registrations (
    id                  INT AUTO_INCREMENT PRIMARY KEY,
    full_name           VARCHAR(255)  NOT NULL,
    email               VARCHAR(255)  NOT NULL,
    phone               VARCHAR(20)   NOT NULL,
    institution         VARCHAR(500),
    category            VARCHAR(100)  NOT NULL,
    payment_status      VARCHAR(20)   NOT NULL DEFAULT 'pending',
    razorpay_order_id   VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    amount              DECIMAL(10,2),
    early_bird          TINYINT(1)    NOT NULL DEFAULT 0,
    created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


SET FOREIGN_KEY_CHECKS = 1;


-- ─────────────────────────────────────────────────────────────
-- SEED: Important Dates (required for homepage to load)
-- ─────────────────────────────────────────────────────────────
INSERT INTO important_dates (event_name, event_date, is_deadline, display_order) VALUES
('Abstract Submission Opens',        '2026-07-01', 0, 1),
('Abstract Submission Deadline',     '2026-07-31', 1, 2),
('Notification of Acceptance',       '2026-08-15', 0, 3),
('Early Bird Registration Deadline', '2026-08-31', 1, 4),
('Final Paper Submission',           '2026-09-10', 1, 5),
('Conference Dates',                 '2026-09-15', 0, 6);


-- ─────────────────────────────────────────────────────────────
-- SEED: Announcements (required for homepage ticker)
-- ─────────────────────────────────────────────────────────────
INSERT INTO announcements (title, content, is_active) VALUES
('TROPMET 2026 – Abstract Submission Open',
 'Abstract submissions for TROPMET 2026 (PRaGaTI) are now open. Submit your abstract before 31st July 2026.',
 1),
('Early Bird Registration',
 'Register before 31st August 2026 to avail early bird registration fees.',
 1);


-- ─────────────────────────────────────────────────────────────
-- Verify all tables created
-- ─────────────────────────────────────────────────────────────
SHOW TABLES;
