"""
Verification Test Script for SkillBridge AI
Tests all major REST endpoints to ensure 100% operational readiness.
"""

import sys

def run_tests():
    print(">>> Starting SkillBridge AI API Verification Tests...\n")
    from app import (
        health_check, get_users, get_skill_gap_analysis,
        get_matched_internships, get_tpo_analytics, get_curriculum_audit,
        get_admin_metrics, get_digital_skill_passport
    )

    # 1. Health check
    h = health_check()
    assert h["status"] == "online", "Health check failed"
    print(" [PASS] Health check endpoint operational")

    # 2. Users endpoint
    users = get_users()
    assert len(users["users"]) >= 4, f"Expected at least 4 users, got {len(users['users'])}"
    print(f" [PASS] User management operational: {len(users['users'])} personas loaded")

    # 3. Student skill gap analysis
    gap = get_skill_gap_analysis(1, "Full Stack AI Developer")
    assert "radar" in gap, "Radar data missing"
    assert "employability_score" in gap, "Employability score missing"
    assert len(gap["gaps"]) > 0, "Gaps not calculated"
    print(f" [PASS] AI Skill Gap Radar operational: Employability Score = {gap['employability_score']}%, Gaps = {len(gap['gaps'])}")

    # 4. Matched Internships
    matches = get_matched_internships(1)
    assert len(matches["internships"]) > 0, "No matched internships returned"
    top_match = matches["internships"][0]
    print(f" [PASS] Matchmaking Engine operational: Top match '{top_match['title']}' with score {top_match['match_score']}%")

    # 5. TPO Institutional Analytics
    tpo = get_tpo_analytics()
    assert "metrics" in tpo, "TPO metrics missing"
    assert len(tpo["departments"]) > 0, "Department breakdown missing"
    print(f" [PASS] TPO Institutional Analytics operational: Placement rate = {tpo['metrics']['overall_placement_rate']}")

    # 6. Curriculum Audit
    audit = get_curriculum_audit()
    assert "curriculum_topics" in audit, "Curriculum topics missing"
    print(f" [PASS] Curriculum Audit operational: Average Alignment = {audit['average_alignment_score']}%")

    # 7. Digital Skill Passport
    passport = get_digital_skill_passport(1)
    assert "passport_id" in passport, "Passport ID missing"
    assert len(passport["verified_badges"]) > 0, "Verified badges missing"
    print(f" [PASS] Digital Skill Passport operational: Passport ID = {passport['passport_id']}")

    # 8. Admin AICTE Metrics
    admin = get_admin_metrics()
    assert "national_index" in admin, "National index missing"
    print(f" [PASS] AICTE National Metrics operational: National Index = {admin['national_index']['overall_employability']}")

    print("\n>>> ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY! (100% PASS RATE) <<<\n")

if __name__ == "__main__":
    run_tests()
