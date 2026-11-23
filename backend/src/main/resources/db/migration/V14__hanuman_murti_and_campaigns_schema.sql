-- Flyway Migration V14: The Grand Hanuman Murti Project & Dedicated Campaign Ledgers
-- Mahaveer Educational & Charitable Trust (MECT)

-- 1. Insert or ensure the dedicated HANUMAN_MURTI donation programme
INSERT INTO donation_programmes (
    code,
    name,
    tagline,
    description,
    is_general_fund,
    is_active,
    display_order
)
SELECT 
    'HANUMAN_MURTI',
    'The Grand Hanuman Murti Project',
    'Proposed 80–100-Foot Monument of Faith, Devotion & Community Participation',
    'Dedicated project fund for the proposed 80–100-foot Hanuman Murti initiative. All contributions are strictly accounted under dedicated campaign ledgers separate from general education and charity funds.',
    false,
    true,
    1
WHERE NOT EXISTS (
    SELECT 1 FROM donation_programmes WHERE code = 'HANUMAN_MURTI'
);

-- 2. Campaign Updates & Milestone Registry for Public Transparency
CREATE TABLE IF NOT EXISTS campaign_updates (
    id BIGSERIAL PRIMARY KEY,
    campaign_code VARCHAR(60) NOT NULL,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(80) NOT NULL DEFAULT 'ANNOUNCEMENT',
    summary TEXT NOT NULL,
    update_date DATE NOT NULL,
    status VARCHAR(40) NOT NULL DEFAULT 'PUBLISHED',
    display_order INT NOT NULL DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_campaign_updates_code_status 
ON campaign_updates(campaign_code, status, display_order);

-- 3. Seed Verified Initial Milestones for Hanuman Murti Project
INSERT INTO campaign_updates (campaign_code, title, category, summary, update_date, status, display_order)
VALUES
(
    'HANUMAN_MURTI',
    'Institutional Vision Charter & Advisory Planning Initiated',
    'PLANNING',
    'Trust board formally recorded the vision charter for a proposed 80–100-foot monumental Hanuman Murti to foster community harmony, cultural heritage, and shared devotion in Odisha.',
    '2026-09-15',
    'PUBLISHED',
    1
),
(
    'HANUMAN_MURTI',
    'Architectural Conceptualization & Soil Suitability Studies Commissioned',
    'FEASIBILITY',
    'Preliminary architectural guidelines, structural engineering prerequisites, and site topography evaluation initiated under expert technical consultation.',
    '2026-10-20',
    'PUBLISHED',
    2
),
(
    'HANUMAN_MURTI',
    'Public Fundraising Portal & Segregated Accounting Opened',
    'CAMPAIGN',
    'Transparent public participation enabled via MECT verified donation portal with strict ledger segregation to ensure zero commingling with educational funds.',
    '2026-11-17',
    'PUBLISHED',
    3
);
