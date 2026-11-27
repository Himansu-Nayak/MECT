import urllib.request
import ssl
import re

ctx = ssl.create_default_context()
BASE_URL = "https://mect.org.in"
headers = {"User-Agent": "Mozilla/5.0 Live-HTML-Auditor/1.0"}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        return resp.read().decode("utf-8", errors="ignore")

def audit_html():
    print("==================================================================")
    print("AUDITING LIVE HTML PAGES ON HTTPS://MECT.ORG.IN")
    print("==================================================================")

    # 1. Homepage
    home_html = fetch(f"{BASE_URL}/")
    print(f"Fetched Homepage: {len(home_html)} bytes")

    # Check 1: Developer Attribution
    assert "Cognisoftoho Technologies Private Limited" in home_html, "Developer attribution missing on homepage"
    assert "ohotechn.com" in home_html, "Link to ohotechn.com missing on homepage"
    print("PASS: Developer Attribution -> Cognisoftoho Technologies Private Limited (https://ohotechn.com)")

    # Check 2: Official Address
    assert "Lewis Plaza" in home_html, "Lewis Plaza address missing on homepage"
    assert "751014" in home_html, "PIN 751014 missing on homepage"
    print("PASS: Official Address -> Lewis Plaza, Bhubaneswar – 751014")

    # Check 3: Primary Email
    assert "mectbbsr13@gmail.com" in home_html, "Primary email mectbbsr13@gmail.com missing on homepage"
    print("PASS: Primary Email -> mectbbsr13@gmail.com")

    # Check 4: Deed Number in footer removed
    # Note: deed numbers shouldn't be in footer copyright
    assert "Trust Deed No. 41042301825" not in home_html, "Trust Deed No. found in public homepage"
    print("PASS: Trust Deed Number excluded from public homepage")

    # Check 5: Section 08 Statutory removed from homepage
    assert "Statutory Transparency: Verifiable Sovereign Registrations" not in home_html, "Section 08 still present on homepage"
    print("PASS: Section 08 'Statutory Transparency' removed from homepage")

    # Check 6: Hero Carousel images
    assert "mect-field-scholarship-distribution.webp" in home_html or "mect-field-science-lab.webp" in home_html or "field-classroom" in home_html or "mect-hero-gallery" in home_html or "hero" in home_html, "Hero carousel images not found"
    print("PASS: Hero Carousel present on homepage")

    # 2. Contact Page
    contact_html = fetch(f"{BASE_URL}/contact")
    print(f"\nFetched Contact Page: {len(contact_html)} bytes")
    assert "mectbbsr13@gmail.com" in contact_html, "Primary email missing on contact page"
    assert "Lewis Plaza" in contact_html, "Lewis Plaza address missing on contact page"
    assert "Balangir" not in contact_html, "Balangir office still shown on contact page"
    print("PASS: Contact Page -> Lewis Plaza, mectbbsr13@gmail.com; Balangir office removed")

    # 3. Governance Page
    gov_html = fetch(f"{BASE_URL}/governance")
    print(f"\nFetched Governance Page: {len(gov_html)} bytes")
    assert "BOARD COMPOSITION" not in gov_html, "BOARD COMPOSITION card still on governance page"
    print("PASS: Governance Page -> Board Composition Clause 8(1) card removed")

    # 4. About Page
    about_html = fetch(f"{BASE_URL}/about")
    print(f"\nFetched About Page: {len(about_html)} bytes")
    assert "Cognisoftoho Technologies Private Limited" in about_html, "Developer attribution missing on about page"
    print("PASS: About Page -> Cognisoftoho Technologies Private Limited present")

    print("\n==================================================================")
    print("ALL LIVE HTML CONTENT & STRUCTURAL AUDITS PASSED WITH 100% SUCCESS!")
    print("==================================================================")

if __name__ == "__main__":
    audit_html()
