"""
Verification Script for Wix Backend Endpoints
Tests all Wix API integrations matching https://vedhagariga896.wixsite.com/skillbridge
"""

import urllib.request
import json

base_url = "http://127.0.0.1:8000"

def test_endpoints():
    print(">>> Testing SkillBridge Wix Backend Endpoints...\n")

    # 1. Opportunities
    req = urllib.request.urlopen(f"{base_url}/api/wix/opportunities")
    data = json.loads(req.read().decode())
    assert data["status"] == "success", "Failed opportunities status"
    assert len(data["opportunities"]) >= 4, "Expected at least 4 opportunities"
    print(f" [PASS] GET /api/wix/opportunities -> {len(data['opportunities'])} opportunities loaded")

    # 2. Company Applicants
    req = urllib.request.urlopen(f"{base_url}/api/wix/company/applicants")
    data = json.loads(req.read().decode())
    assert len(data["applicants"]) >= 4, "Expected at least 4 applicants"
    print(f" [PASS] GET /api/wix/company/applicants -> {len(data['applicants'])} applicants loaded")

    # 3. Student Dashboard
    req = urllib.request.urlopen(f"{base_url}/api/wix/student/dashboard")
    data = json.loads(req.read().decode())
    assert data["profile"]["name"] == "Vedha Gariga", "Student profile mismatch"
    assert len(data["skill_gaps"]) == 4, "Expected 4 skill gaps"
    assert len(data["learning_path"]) == 3, "Expected 3 learning path courses"
    print(f" [PASS] GET /api/wix/student/dashboard -> Profile: {data['profile']['name']} ({data['profile']['profile_completion']}%), {len(data['skill_gaps'])} skill gaps")

    # 4. College Analytics
    req = urllib.request.urlopen(f"{base_url}/api/wix/college/analytics")
    data = json.loads(req.read().decode())
    assert data["metrics"]["students_assessed"] == "12,480", "College metric mismatch"
    assert len(data["skill_gaps"]) == 3, "Expected 3 college skill gaps"
    print(f" [PASS] GET /api/wix/college/analytics -> Students Assessed: {data['metrics']['students_assessed']}, Placement Ready: {data['metrics']['placement_ready']}")

    # 5. Publish Opportunity POST
    new_opp = {
        "full_name": "Deepak Verma",
        "company_email": "hr@hypercloud.in",
        "job_title": "Cloud SRE Intern",
        "industry": "Cloud Infrastructure",
        "location": "Bengaluru",
        "job_type": "Internship",
        "required_skills": ["Python", "Docker", "Linux"],
        "job_description": "Maintain high uptime for Kubernetes microservices."
    }
    req_post = urllib.request.Request(
        f"{base_url}/api/wix/publish-opportunity",
        data=json.dumps(new_opp).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res_post = urllib.request.urlopen(req_post)
    post_data = json.loads(res_post.read().decode())
    assert post_data["status"] == "success", "Publish opportunity failed"
    print(f" [PASS] POST /api/wix/publish-opportunity -> New ID #{post_data['opportunity_id']} created!")

    # 6. Student Apply POST
    apply_payload = {
        "job_id": post_data["opportunity_id"],
        "student_name": "Vedha Gariga",
        "student_email": "vedha@skillbridge.io",
        "match_score": 88
    }
    req_apply = urllib.request.Request(
        f"{base_url}/api/wix/student/apply",
        data=json.dumps(apply_payload).encode('utf-8'),
        headers={'Content-Type': 'application/json'}
    )
    res_apply = urllib.request.urlopen(req_apply)
    apply_data = json.loads(res_apply.read().decode())
    assert apply_data["status"] == "success", "Student apply failed"
    print(f" [PASS] POST /api/wix/student/apply -> Application submitted successfully!")

    print("\n>>> ALL WIX BACKEND TESTS PASSED (100% OPERATIONAL) <<<")

if __name__ == "__main__":
    test_endpoints()
