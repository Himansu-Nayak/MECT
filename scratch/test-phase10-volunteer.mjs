import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const volunteerPagePath = path.join(rootDir, "src", "app", "volunteer", "page.tsx");

console.log("--- PHASE 10: VOLUNTEER PLATFORM TEST SUITE ---");

// Test 1: Verify file existence
assert.ok(fs.existsSync(volunteerPagePath), "src/app/volunteer/page.tsx must exist");
console.log("✓ Test 1: Volunteer page exists");

const content = fs.readFileSync(volunteerPagePath, "utf8");

// Test 2: Verify Ground Tracks (Balangir Remedial & Women Vocational)
assert.ok(content.includes("Balangir Remedial Education Tutor"), "Must include Balangir Remedial Education Tutor role");
assert.ok(content.includes("Women Vocational & Tailoring Mentor"), "Must include Women Vocational & Tailoring Mentor role");
console.log("✓ Test 2: Verified authentic ground action tracks (Balangir Remedial & Women Vocational)");

// Test 3: Verify Mentorship & Stewardship Tracks
assert.ok(content.includes("Academic & Entrance Exam Mentor"), "Must include Academic & Entrance Exam Mentor");
assert.ok(content.includes("Career & Industry Guide"), "Must include Career & Industry Guide");
assert.ok(content.includes("Project Samarth Community Hub Steward") || content.includes("Project Samarth Hub Steward"), "Must include Project Samarth Hub Steward");
assert.ok(content.includes("College & Faculty"), "Must include College & Faculty Liaison");
console.log("✓ Test 3: Verified higher education mentorship and stewardship tracks");

// Test 4: Verify Form Submission Integration
assert.ok(content.includes("submitVolunteerRegistration"), "Must call submitVolunteerRegistration API");
assert.ok(content.includes("consentDeclared"), "Must enforce consentDeclared");
assert.ok(content.includes("referenceId"), "Must present referenceId upon submission");
console.log("✓ Test 4: Verified API integration and reference ID generation");

// Test 5: Verify Institutional Design Tokens
assert.ok(content.includes("#0A192F"), "Must use Presidential Navy (#0A192F)");
assert.ok(content.includes("#C5A059"), "Must use Temple Gold (#C5A059)");
assert.ok(!content.includes("#072617"), "Must not use deprecated green #072617");
console.log("✓ Test 5: Verified institutional color palette compliance");

// Test 6: Verify Safeguarding Guidelines
assert.ok(content.includes("Safeguarding Guidelines") || content.includes("safeguarding guidelines"), "Must include safeguarding callout");
assert.ok(content.includes("Zero Commercial Solicitation"), "Must enforce zero commercial solicitation");
console.log("✓ Test 6: Verified safeguarding and child protection declarations");

console.log("--- ALL PHASE 10 VOLUNTEER TESTS PASSED (6/6) ---");
