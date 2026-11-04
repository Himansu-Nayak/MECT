-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V6: SCHOLARSHIP APPLICATIONS & DOCUMENT VAULT
-- ============================================================================

CREATE TABLE IF NOT EXISTS scholarship_applications (
    id BIGSERIAL PRIMARY KEY,
    application_number VARCHAR(32) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    aadhaar_last_four VARCHAR(4) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    category VARCHAR(30) NOT NULL,
    district VARCHAR(50) NOT NULL,
    pin_code VARCHAR(6) NOT NULL,
    permanent_address TEXT NOT NULL,
    scheme_code VARCHAR(50) NOT NULL,
    institution_name VARCHAR(200) NOT NULL,
    institution_district VARCHAR(50) NOT NULL,
    course_name VARCHAR(100) NOT NULL,
    current_year_semester VARCHAR(50) NOT NULL,
    roll_or_registration_number VARCHAR(100) NOT NULL,
    annual_family_income NUMERIC(12,2) NOT NULL,
    tahasildar_cert_number VARCHAR(100) NOT NULL,
    tahasildar_cert_issue_date DATE NOT NULL,
    college_bank_name VARCHAR(100) NOT NULL,
    college_bank_account_number VARCHAR(50) NOT NULL,
    college_bank_ifsc VARCHAR(20) NOT NULL,
    college_account_holder_name VARCHAR(150) NOT NULL,
    tuition_fee_demanded NUMERIC(12,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    rejection_reason TEXT,
    action_required_note TEXT,
    disbursal_transaction_ref VARCHAR(100),
    disbursal_date TIMESTAMP WITH TIME ZONE,
    sworn_declaration BOOLEAN NOT NULL DEFAULT FALSE,
    version BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_scholarship_status CHECK (
        status IN ('SUBMITTED', 'UNDER_SCRUTINY', 'INSTITUTION_VERIFIED', 'COMMITTEE_APPROVED', 'DISBURSED', 'REJECTED', 'ACTION_REQUIRED')
    ),
    CONSTRAINT chk_scholarship_sworn_declaration CHECK (sworn_declaration = TRUE)
);

CREATE TABLE IF NOT EXISTS scholarship_documents (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES scholarship_applications(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scholarship_app_number ON scholarship_applications(application_number);
CREATE INDEX IF NOT EXISTS idx_scholarship_app_status ON scholarship_applications(status);
CREATE INDEX IF NOT EXISTS idx_scholarship_app_district ON scholarship_applications(district);
CREATE INDEX IF NOT EXISTS idx_scholarship_app_phone ON scholarship_applications(phone);
CREATE INDEX IF NOT EXISTS idx_scholarship_app_email ON scholarship_applications(email);
CREATE INDEX IF NOT EXISTS idx_scholarship_docs_app_id ON scholarship_documents(application_id);
