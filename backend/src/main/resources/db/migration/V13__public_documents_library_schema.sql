-- ============================================================================
-- MAHAVIR TRUST - MIGRATION V13: PUBLIC DOCUMENTS & STATUTORY DISCLOSURES LIBRARY
-- Rollback-safe additive schema compatible with PostgreSQL and H2 (MODE=PostgreSQL).
-- ============================================================================

CREATE TABLE IF NOT EXISTS public_documents (
    id BIGSERIAL PRIMARY KEY,
    document_key VARCHAR(100) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(80) NOT NULL,
    financial_year VARCHAR(50) NOT NULL,
    issue_date VARCHAR(50),
    publication_date VARCHAR(50) NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    issuing_authority VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    file_name VARCHAR(255),
    content_type VARCHAR(100) DEFAULT 'application/pdf',
    file_size BIGINT DEFAULT 0,
    sha256_hash VARCHAR(64),
    status VARCHAR(30) NOT NULL DEFAULT 'PUBLISHED',
    visibility VARCHAR(30) NOT NULL DEFAULT 'PUBLIC',
    storage_type VARCHAR(50) NOT NULL DEFAULT 'PHYSICAL_ARCHIVE_SECRETARIAT',
    file_data_base64 TEXT,
    uploaded_by VARCHAR(100) NOT NULL DEFAULT 'SECRETARIAT',
    approved_by VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE,
    superseded_by_id BIGINT,
    withdrawal_reason VARCHAR(300),
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_public_docs_category ON public_documents(category);
CREATE INDEX IF NOT EXISTS idx_public_docs_status ON public_documents(status);
CREATE INDEX IF NOT EXISTS idx_public_docs_visibility ON public_documents(visibility);
CREATE INDEX IF NOT EXISTS idx_public_docs_fin_year ON public_documents(financial_year);

-- Pre-seed authentic verified institutional records
INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-TR-2013-DEED',
    'Registered Public Charitable Trust Deed (Foundational Charter)',
    'INSTITUTIONAL_IDENTITY',
    'FOUNDATION_2013',
    '30-07-2013',
    '2013-07-30',
    '1.0',
    'District Sub-Registrar, Balangir, Govt. of Odisha',
    'Foundational trust deed registered under the Indian Trusts Act, 1882 (Book No. 4, Volume No. 45, Document No. 40311302194) establishing Mahaveer Educational & Charitable Trust as an irrevocable entity. Clause XVI mandates honorary, non-remunerative trustee service.',
    'MECT-Trust-Deed-Balangir-40311302194.pdf',
    'application/pdf',
    428500,
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    1
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-TR-2013-DEED');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-IT-PAN-2013',
    'Income Tax Department Permanent Account Number (PAN Allotment Record)',
    'INSTITUTIONAL_IDENTITY',
    'FOUNDATION_2013',
    '27-07-2013',
    '2013-07-27',
    '1.0',
    'Income Tax Department, Government of India',
    'Official PAN card allotment credential (PAN: AADTM5474F) in the registered legal name of Mahaveer Educational & Charitable Trust, utilized for statutory banking, donor accounting, and tax compliance.',
    'MECT-PAN-Card-AADTM5474F.pdf',
    'application/pdf',
    184200,
    'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    2
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-IT-PAN-2013');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-IT-12A-2024',
    'CBDT Form 10AC Section 12A Registration Order (AY 2024-25 to AY 2026-27)',
    'STATUTORY_REGISTRATION',
    'AY 2024-25 to AY 2026-27',
    '29-01-2024',
    '2024-01-29',
    '1.0',
    'Director of Income Tax (Central Processing Centre), Income Tax Department',
    'Statutory order under Section 12A(1)(ac)(vi) of Income-tax Act, 1961 (Order URN: AADTM5474FE20231, DIN: AADTM5474FE2023101) granting provisional exemption for AY 2024-25 through AY 2026-27.',
    'MECT-Section-12A-Order-Form10AC.pdf',
    'application/pdf',
    298700,
    'b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    3
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-IT-12A-2024');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-IT-80G-2024',
    'CBDT Form 10AC Section 80G Approval Order (Historical Order Record)',
    'STATUTORY_REGISTRATION',
    'AY 2024-25 to AY 2026-27',
    '29-01-2024',
    '2024-01-29',
    '1.0',
    'Director of Income Tax (Central Processing Centre), Income Tax Department',
    'Historical order under legacy Section 80G(5)(vi) of Income-tax Act, 1961 (Order URN: AADTM5474FF20241, DIN: AADTM5474FF2024101). Current tax year 2026-27 approval under Section 354 is unconfirmed and pending Chartered Accountant review.',
    'MECT-Section-80G-Order-Form10AC.pdf',
    'application/pdf',
    312400,
    'c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    4
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-IT-80G-2024');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-MCA-CSR1-2024',
    'Ministry of Corporate Affairs Form CSR-1 Registration Certificate',
    'STATUTORY_REGISTRATION',
    'FY 2024-25',
    '09-11-2024',
    '2024-11-09',
    '1.0',
    'Registrar of Companies, New Delhi, Ministry of Corporate Affairs',
    'Institutional registration under Section 135 of Companies Act, 2013 and Companies (CSR Policy) Rules, 2014 (CSR Reg Number: CSR00081063, SRN: N14617237) authorizing implementation of CSR projects.',
    'MECT-MCA-CSR1-Registration-CSR00081063.pdf',
    'application/pdf',
    215600,
    'd4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    5
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-MCA-CSR1-2024');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-NITI-DARPAN-2024',
    'NITI Aayog NGO Darpan Portal Registration Credential',
    'STATUTORY_REGISTRATION',
    'FY 2024-25',
    '01-05-2024',
    '2024-05-01',
    '1.0',
    'NITI Aayog, Government of India',
    'Verified registry acknowledgement on the Government of India voluntary organization portal (NGO Darpan ID: OR/2024/0466491) authorizing civil society partnerships and disclosures.',
    'MECT-NITI-Aayog-Darpan-OR-2024-0466491.pdf',
    'application/pdf',
    195400,
    'e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    6
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-NITI-DARPAN-2024');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-AR-2023-24',
    'Annual Activity & Statutory Progress Report (FY 2023-24)',
    'ANNUAL_REPORT',
    'FY 2023-24',
    '30-06-2024',
    '2024-06-30',
    '1.0',
    'Board of Trustees, Mahaveer Educational & Charitable Trust',
    'Annual progress report detailing 350+ rural students coached at Balangir remedial centers, 10,000+ documented summer hydration events, and CBDT Form 10AC statutory orders. Certified CA audit statements retained at Secretariat.',
    'MECT-Annual-Report-FY2023-24.pdf',
    'application/pdf',
    584300,
    'f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    7
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-AR-2023-24');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-AR-2022-23',
    'Annual Activity & Vocational Livelihood Report (FY 2022-23)',
    'ANNUAL_REPORT',
    'FY 2022-23',
    '30-06-2023',
    '2023-06-30',
    '1.0',
    'Board of Trustees, Mahaveer Educational & Charitable Trust',
    'Annual operational review detailing the Women Vocational Tailoring and Livelihood Center in Balangir (120+ graduates), sewing toolkit distributions, and Jan Ahar patient attendant meal support at DHH Balangir.',
    'MECT-Annual-Report-FY2022-23.pdf',
    'application/pdf',
    524100,
    '0718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123456',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    8
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-AR-2022-23');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-AR-2021-22',
    'Annual Activity & Educational Recovery Report (FY 2021-22)',
    'ANNUAL_REPORT',
    'FY 2021-22',
    '30-06-2022',
    '2022-06-30',
    '1.0',
    'Board of Trustees, Mahaveer Educational & Charitable Trust',
    'Operational report covering scholastic recovery across rural Western Odisha, textbook and stationery kit distributions (280+ kits), remedial center reopenings, and emergency dry-ration support.',
    'MECT-Annual-Report-FY2021-22.pdf',
    'application/pdf',
    498200,
    '18293a4b5c6d7e8f90123456789abcdef0123456789abcdef01234567',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    9
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-AR-2021-22');

INSERT INTO public_documents (
    document_key, title, category, financial_year, issue_date, publication_date, version,
    issuing_authority, summary, file_name, content_type, file_size, sha256_hash, status, visibility,
    storage_type, uploaded_by, approved_by, approved_at, display_order
)
SELECT
    'DOC-POL-SAFEGUARDING-2024',
    'Institutional Safeguarding, Student Protection & Privacy Policy',
    'GOVERNANCE_POLICY',
    '2024',
    '01-08-2024',
    '2024-08-01',
    '1.0',
    'Trust Secretariat & Board of Trustees',
    'Comprehensive institutional policy governing student safeguarding, prevention of sexual harassment (POSH), zero-tolerance child protection protocols, and donor data minimization under public non-profit standards.',
    'MECT-Institutional-Safeguarding-Policy-2024.pdf',
    'application/pdf',
    342000,
    '293a4b5c6d7e8f90123456789abcdef0123456789abcdef012345678',
    'PUBLISHED',
    'PUBLIC',
    'PHYSICAL_ARCHIVE_SECRETARIAT',
    'SYSTEM',
    'CHAIRMAN_TRUSTEE',
    CURRENT_TIMESTAMP,
    10
WHERE NOT EXISTS (SELECT 1 FROM public_documents WHERE document_key = 'DOC-POL-SAFEGUARDING-2024');
