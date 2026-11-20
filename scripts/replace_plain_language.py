import os

replacements = {
    r'src/app/about/page.tsx': [
        ('<span>Fiduciary Governance</span>', '<span>Trustee Governance</span>'),
        ('badge="Fiduciary Governance Structure"', 'badge="Trustee Governance Structure"'),
        ('<span>View Fiduciary Charter</span>', '<span>View Governance Charter</span>'),
    ],
    r'src/app/governance/page.tsx': [
        ('const fiduciaryPrinciples = [', 'const governancePrinciples = ['),
        ('{fiduciaryPrinciples.map', '{governancePrinciples.map'),
        ('id="fiduciary-charter"', 'id="governance-charter"'),
    ],
    r'src/components/DirectDisbursalFlowchart.tsx': [
        ('Zero-Cash Policy • Fiduciary Integrity', 'Zero-Cash Policy • Complete Financial Integrity'),
        ('Fiduciary Commitment', 'Trust Commitment'),
        ('<span>View Fiduciary Charter</span>', '<span>View Governance Charter</span>'),
    ],
    r'src/components/Footer.tsx': [
        ('Statutory &amp; Fiduciary Disclosure (Govt. of India / Govt. of Odisha)', 'Statutory &amp; Institutional Disclosure (Govt. of India / Govt. of Odisha)'),
        ('Fiduciary Charter', 'Governance Charter'),
    ],
    r'src/components/InstitutionalMarquee.tsx': [
        ('Statutory Accreditations &amp; Fiduciary Standards', 'Statutory Accreditations &amp; Public Standards'),
    ],
    r'src/lib/homepage-content.ts': [
        ('text: "Fiduciary Charter & Board",', 'text: "Governance Charter & Board",'),
        ('title: "Honorary Fiduciary Board",', 'title: "Honorary Board of Trustees",'),
        ('title: "Fiduciary Oversight & Audit",', 'title: "Independent Oversight & Audit",'),
    ],
    r'src/lib/about-content.ts': [
        ('title: "100% Direct Disbursals & Fiduciary Integrity",', 'title: "100% Direct Disbursals & Financial Integrity",'),
        ('title: "Fiduciary Integrity",', 'title: "Financial Integrity & Trust",'),
    ],
    r'src/lib/config.ts': [
        ('description: "Registered Trust Deed, managing trustee, and honorary fiduciary code.",', 'description: "Registered Trust Deed, managing trustee, and honorary governance code.",'),
    ],
    r'src/app/csr-partnerships/page.tsx': [
        ('{/* 4. Corporate Governance & Fiduciary Assurance */}', '{/* 4. Corporate Governance & Financial Assurance */}'),
        ('badge="Fiduciary Integrity"', 'badge="Financial Integrity & Trust"'),
    ],
    r'src/app/faq/page.tsx': [
        ('governed by a public Fiduciary Deed', 'governed by a registered public Trust Deed'),
        ('title="Fiduciary Oversight & Impartiality"', 'title="Independent Oversight & Impartiality"'),
    ],
    r'src/app/privacy/page.tsx': [
        ('Our fiduciary commitment to safeguarding', 'Our institutional commitment to safeguarding'),
        ('badge="Fiduciary Safeguards"', 'badge="Privacy & Accountability Safeguards"'),
    ],
    r'src/app/scholarships/page.tsx': [
        ('detail: "Fiduciary zero-cash policy strictly enforced.",', 'detail: "Strict zero-cash policy enforced.",'),
        ('Under our strict fiduciary charter,', 'Under our strict governance charter,'),
    ],
    r'src/app/terms/page.tsx': [
        ('title: "Limitation of Fiduciary Liability & Dispute Jurisdiction",', 'title: "Limitation of Liability & Dispute Jurisdiction",'),
        ('badge="Fiduciary Governance"', 'badge="Trustee Governance"'),
    ],
    r'src/components/sections/CompactHowMectWorks.tsx': [
        ('with fiduciary governance and transparent field execution.', 'with responsible trustee governance and transparent field execution.'),
        ('<span>Read our complete Fiduciary Charter &amp; Governance Code</span>', '<span>Read our complete Governance Charter &amp; Trust Code</span>'),
    ],
    r'src/components/sections/FreeEducationSection.tsx': [
        ('Strict Zero-Cash Fiduciary Standard:', 'Strict Zero-Cash Standard:'),
    ],
    r'src/app/campaigns/hanuman-murti/page.tsx': [
        ('<strong>Fiduciary Truth in Disclosures:</strong>', '<strong>Honesty &amp; Transparency in Disclosures:</strong>'),
    ],
    r'src/app/contact/page.tsx': [
        ('statutory fiduciary compliance.', 'statutory compliance and public accountability.'),
    ],
    r'src/app/memories-gallery/page.tsx': [
        ('Fiduciary Oversight', 'Independent Oversight'),
    ],
    r'src/components/sections/ReportsLibrarySection.tsx': [
        ('Institutional Fiduciary Right', 'Statutory Transparency Right'),
    ],
    r'src/components/sections/InstitutionalStorySection.tsx': [
        ('Institutional Heritage &amp; Fiduciary Roots', 'Institutional Heritage &amp; Founding Values'),
    ],
    r'src/app/admin/demo/page.tsx': [
        ('strict multi-stage fiduciary lifecycle', 'strict multi-stage governance lifecycle'),
        ('Notification Outbox &amp; Fiduciary Audit Logs', 'Notification Outbox &amp; System Audit Logs'),
    ]
}

def main():
    updated = 0
    for rel_path, pairs in replacements.items():
        p = os.path.normpath(rel_path)
        if not os.path.exists(p):
            print(f'MISSING FILE: {p}')
            continue
        with open(p, 'r', encoding='utf-8') as f:
            content = f.read()
        orig = content
        for old, new in pairs:
            if old not in content:
                print(f'TARGET NOT FOUND in {p}: {repr(old)}')
            else:
                content = content.replace(old, new)
        if content != orig:
            with open(p, 'w', encoding='utf-8') as f:
                f.write(content)
            updated += 1
            print(f'UPDATED: {p}')
    print(f'Finished: {updated} files updated.')

if __name__ == '__main__':
    main()

extra_comments = {
    r'src/components/sections/InstitutionalStorySection.tsx': [
        ('3 core fiduciary covenants', '3 core trustee covenants'),
        ('Core Fiduciary Ledger', 'Core Governance Ledger')
    ],
    r'src/app/login/page.tsx': [
        ('Fiduciary Assurance Footer', 'Trust Assurance Footer')
    ],
    r'src/components/sections/CinematicHero.tsx': [
        ('Floating Fiduciary Guarantee Plaque', 'Floating Trust Guarantee Plaque')
    ],
    r'src/components/sections/FreeEducationSection.tsx': [
        ('Fiduciary Disbursal Standard Callout', 'Direct Disbursal Standard Callout')
    ],
    r'src/components/sections/InterconnectedSafetyNetSection.tsx': [
        ('Fiduciary Guarantee', 'Trust Guarantee')
    ],
    r'src/components/sections/ClosingFiduciaryPledgeSection.tsx': [
        ('Closing Institutional Fiduciary Manifesto', 'Closing Institutional Trust Commitment'),
        ("the Board's fiduciary pledge", "the Board's institutional pledge")
    ]
}

for rel_path, pairs in extra_comments.items():
    p = os.path.normpath(rel_path)
    if os.path.exists(p):
        with open(p, 'r', encoding='utf-8') as f:
            c = f.read()
        for o, n in pairs:
            c = c.replace(o, n)
        with open(p, 'w', encoding='utf-8') as f:
            f.write(c)
        print(f'CLEANED COMMENT: {p}')
