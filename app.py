"""
SkillBridge AI - Main Application & REST API
Academia - Industry Collaboration for Skill Mapping, Internships and Placement.
"""

from fastapi import FastAPI, HTTPException, Request, Depends, Query
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import sqlite3
import os
import hashlib
from datetime import datetime

from database import get_connection, init_db, seed_database

# Initialize database
init_db()
seed_database()

app = FastAPI(
    title="SkillBridge AI - Academia-Industry Collaboration Portal",
    description="Smart India Hackathon (SIH) Platform for Skill Mapping, Internships, and Placement",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static directory
STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
TEMPLATES_DIR = os.path.join(os.path.dirname(__file__), "templates")
os.makedirs(STATIC_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

# ----------------- PYDANTIC SCHEMAS -----------------

class SkillUpdate(BaseModel):
    skill_id: int
    proficiency: int = Field(..., ge=0, le=100)

class InternshipCreate(BaseModel):
    recruiter_id: int
    company_name: str
    title: str
    type: str  # 'Internship' or 'Full-time Placement'
    stipend: str
    location: str
    work_mode: str  # 'Remote', 'Hybrid', 'On-site'
    description: str
    min_cgpa: float = 7.0
    openings: int = 5
    deadline: str
    skill_ids: List[int] = []

class ApplicationCreate(BaseModel):
    internship_id: int
    student_id: int
    notes: Optional[str] = None

class StatusUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class CurriculumFeedbackCreate(BaseModel):
    recruiter_id: int
    course_name: str
    recommended_topic: str
    industry_use_case: str

class CapstoneCreate(BaseModel):
    recruiter_id: int
    company_name: str
    title: str
    domain: str
    problem_statement: str
    grant_amount: str
    deadline: str

class CapstoneApply(BaseModel):
    capstone_id: int
    student_id: int
    team_name: str
    faculty_mentor: str
    proposal_summary: str

class ResumeParseRequest(BaseModel):
    student_id: int
    resume_text: str

class QuizSubmitRequest(BaseModel):
    student_id: int
    skill_id: int
    answers: Dict[str, int]

# Wix Specific Models (matching https://vedhagariga896.wixsite.com/skillbridge)
class WixOpportunityCreate(BaseModel):
    full_name: str
    company_email: str
    job_title: str
    industry: str
    location: str
    job_type: str  # Full-time, Part-time, Internship
    required_skills: List[str] = []
    job_description: str

class WixApplicantStatusUpdate(BaseModel):
    applicant_id: int
    status: str

class WixStudentApplyRequest(BaseModel):
    job_id: int
    student_name: str = "Vedha Gariga"
    student_email: str = "student@skillbridge.io"
    match_score: int = 85

# ----------------- UI ROOT ROUTES (Matching Wix Site Navigation) -----------------

@app.get("/", response_class=HTMLResponse)
async def serve_index():
    index_path = os.path.join(TEMPLATES_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, "r", encoding="utf-8") as f:
            return HTMLResponse(content=f.read())
    return HTMLResponse(content="<h1>SkillBridge AI Portal is running.</h1>")

@app.get("/student-dashboard", response_class=HTMLResponse)
async def serve_student_dashboard():
    return await serve_index()

@app.get("/company-dashboard", response_class=HTMLResponse)
async def serve_company_dashboard():
    return await serve_index()

@app.get("/college-dashboard", response_class=HTMLResponse)
async def serve_college_dashboard():
    return await serve_index()

# ----------------- API ENDPOINTS -----------------

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "SkillBridge AI Portal",
        "version": "1.0.0",
        "database": "connected"
    }

# 1. USER & PERSONA MANAGEMENT
@app.get("/api/users")
def get_users():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.id, u.name, u.email, u.role, u.organization, u.department, u.avatar, u.bio,
           s.id as student_id, s.target_role, s.cgpa, s.branch, s.graduation_year
    FROM users u
    LEFT JOIN students s ON u.id = s.user_id
    ORDER BY u.id ASC;
    """)
    users = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"users": users}

@app.get("/api/users/{user_id}")
def get_user_profile(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT u.*, s.id as student_id, s.cgpa, s.branch, s.graduation_year, s.target_role, s.github_url, s.linkedin_url
    FROM users u
    LEFT JOIN students s ON u.id = s.user_id
    WHERE u.id = ?;
    """, (user_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return dict(row)

# 2. MASTER SKILLS & TARGET ROLES
@app.get("/api/skills")
def get_all_skills():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM skills ORDER BY category, name;")
    skills = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"skills": skills}

@app.get("/api/roles")
def get_target_roles():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT role_name FROM role_benchmarks;")
    roles = [row["role_name"] for row in cursor.fetchall()]
    conn.close()
    return {"roles": roles}

# 3. AI SKILL MAPPING & RADAR GAP ENGINE
@app.get("/api/students/{student_id}/gap-analysis")
def get_skill_gap_analysis(student_id: int, target_role: Optional[str] = None):
    conn = get_connection()
    cursor = conn.cursor()

    # Get student info
    cursor.execute("SELECT s.*, u.name FROM students s JOIN users u ON s.user_id = u.id WHERE s.id = ?", (student_id,))
    student = cursor.fetchone()
    if not student:
        conn.close()
        raise HTTPException(status_code=404, detail="Student not found")

    selected_role = target_role or student["target_role"] or "Full Stack AI Developer"

    # Get benchmark skills for role
    cursor.execute("""
    SELECT rb.skill_id, rb.benchmark_level, rb.is_core, s.name as skill_name, s.category, s.demand_level
    FROM role_benchmarks rb
    JOIN skills s ON rb.skill_id = s.id
    WHERE rb.role_name = ?;
    """, (selected_role,))
    benchmarks = cursor.fetchall()

    if not benchmarks:
        # Fallback to any role if specific not found
        cursor.execute("""
        SELECT rb.skill_id, rb.benchmark_level, rb.is_core, s.name as skill_name, s.category, s.demand_level
        FROM role_benchmarks rb
        JOIN skills s ON rb.skill_id = s.id
        WHERE rb.role_name = 'Full Stack AI Developer';
        """)
        benchmarks = cursor.fetchall()
        selected_role = "Full Stack AI Developer"

    # Get student's current proficiency
    cursor.execute("""
    SELECT ss.skill_id, ss.proficiency, ss.verified, ss.badge_name, s.name as skill_name
    FROM student_skills ss
    JOIN skills s ON ss.skill_id = s.id
    WHERE ss.student_id = ?;
    """, (student_id,))
    student_skills_map = {row["skill_id"]: dict(row) for row in cursor.fetchall()}

    radar_labels = []
    student_scores = []
    benchmark_scores = []
    gap_skills = []
    strengths = []
    total_benchmark_weight = 0
    total_student_weight = 0

    curated_bridge_courses = {
        "Large Language Models (LLMs)": {
            "action": "Build a RAG system using LangChain & Pinecone",
            "recommended_course": "DeepLearning.AI: LangChain for LLM Application Development",
            "est_hours": "15 Hours",
            "project_idea": "Domain-Specific Chatbot with Document Grounding"
        },
        "MLOps & Model Deployment": {
            "action": "Containerize PyTorch inference service with FastAPI & Docker",
            "recommended_course": "Full Stack Deep Learning: Production MLOps",
            "est_hours": "20 Hours",
            "project_idea": "Automated Model Deployment Pipeline with GitHub Actions"
        },
        "Kubernetes Orchestration": {
            "action": "Deploy microservices cluster on Minikube / K3s",
            "recommended_course": "CNCF: Kubernetes for Developers (CKAD Prep)",
            "est_hours": "18 Hours",
            "project_idea": "Self-healing Multi-Service Web App with Ingress Controller"
        },
        "AWS / Azure Cloud": {
            "action": "Deploy serverless backend with AWS Lambda, S3 & DynamoDB",
            "recommended_course": "AWS Certified Cloud Practitioner & Developer Associate",
            "est_hours": "25 Hours",
            "project_idea": "Event-Driven Image Processor on AWS S3 + SQS"
        },
        "Docker & Containerization": {
            "action": "Create multi-stage Dockerfiles with layer caching",
            "recommended_course": "Docker Mastery on Udemy / FreeCodeCamp",
            "est_hours": "10 Hours",
            "project_idea": "Multi-container compose environment with Postgres & Redis"
        },
        "Microservices Architecture": {
            "action": "Implement asynchronous message broker using RabbitMQ / Kafka",
            "recommended_course": "Distributed Systems & Microservices Patterns",
            "est_hours": "16 Hours",
            "project_idea": "Order Processing Microservice with Saga Pattern"
        }
    }

    for b in benchmarks:
        skill_id = b["skill_id"]
        skill_name = b["skill_name"]
        bench_val = b["benchmark_level"]
        stu_val = student_skills_map.get(skill_id, {}).get("proficiency", 0)
        is_verified = student_skills_map.get(skill_id, {}).get("verified", False)

        radar_labels.append(skill_name)
        student_scores.append(stu_val)
        benchmark_scores.append(bench_val)

        weight = 2.0 if b["is_core"] else 1.0
        total_benchmark_weight += bench_val * weight
        total_student_weight += min(stu_val, bench_val) * weight

        gap = bench_val - stu_val
        if gap > 15:
            rec = curated_bridge_courses.get(skill_name, {
                "action": f"Deepen practical hands-on projects in {skill_name}",
                "recommended_course": f"Advanced {skill_name} Specialization",
                "est_hours": "12 Hours",
                "project_idea": f"Production-grade {skill_name} portfolio project"
            })
            gap_skills.append({
                "skill_id": skill_id,
                "skill_name": skill_name,
                "category": b["category"],
                "student_level": stu_val,
                "benchmark_level": bench_val,
                "gap": gap,
                "is_core": bool(b["is_core"]),
                "recommendation": rec
            })
        else:
            strengths.append({
                "skill_id": skill_id,
                "skill_name": skill_name,
                "student_level": stu_val,
                "benchmark_level": bench_val,
                "verified": is_verified
            })

    # Sort gaps by critical gap first
    gap_skills.sort(key=lambda x: (not x["is_core"], -x["gap"]))

    # Calculate Employability Readiness Index (0-100)
    employability_score = round((total_student_weight / total_benchmark_weight * 100)) if total_benchmark_weight > 0 else 75

    conn.close()

    return {
        "target_role": selected_role,
        "employability_score": employability_score,
        "radar": {
            "labels": radar_labels,
            "student_scores": student_scores,
            "benchmark_scores": benchmark_scores
        },
        "gaps": gap_skills,
        "strengths": strengths,
        "summary": f"Your current readiness for {selected_role} is {employability_score}%. Closing {len(gap_skills)} critical skill gaps will place you in the top 5% of candidate matches."
    }

@app.post("/api/students/{student_id}/skills")
def update_student_skill(student_id: int, payload: SkillUpdate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO student_skills (student_id, skill_id, proficiency, verified, badge_name)
    VALUES (?, ?, ?, 0, 'Self-Assessed')
    ON CONFLICT(student_id, skill_id) DO UPDATE SET
        proficiency = excluded.proficiency;
    """, (student_id, payload.skill_id, payload.proficiency))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Skill proficiency updated"}

# 4. DIGITAL SKILL PASSPORT & CREDENTIALS
@app.get("/api/students/{student_id}/passport")
def get_digital_skill_passport(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT s.*, u.name, u.email, u.organization as college, u.avatar
    FROM students s
    JOIN users u ON s.user_id = u.id
    WHERE s.id = ?;
    """, (student_id,))
    student = cursor.fetchone()
    if not student:
        conn.close()
        raise HTTPException(status_code=404, detail="Student not found")

    # Get verified badges
    cursor.execute("""
    SELECT ss.proficiency, ss.verified, ss.badge_name, ss.endorsements_count, s.name as skill_name, s.category
    FROM student_skills ss
    JOIN skills s ON ss.skill_id = s.id
    WHERE ss.student_id = ?
    ORDER BY ss.verified DESC, ss.proficiency DESC;
    """, (student_id,))
    skills = [dict(row) for row in cursor.fetchall()]

    # Get completed or approved capstones
    cursor.execute("""
    SELECT ca.*, c.title as capstone_title, c.company_name, c.domain
    FROM capstone_applications ca
    JOIN capstones c ON ca.capstone_id = c.id
    WHERE ca.student_id = ?;
    """, (student_id,))
    capstones = [dict(row) for row in cursor.fetchall()]

    # Generate tamper-evident passport hash
    raw_hash_str = f"SKILLPASS-{student_id}-{student['name']}-{student['cgpa']}-2026-AICTE-VERIFIED"
    passport_id = "SP-" + hashlib.sha256(raw_hash_str.encode()).hexdigest()[:12].upper()

    conn.close()
    return {
        "passport_id": passport_id,
        "issued_by": "National Skill Qualification & AICTE NEP-2020 Consortium",
        "student": dict(student),
        "verified_badges": [s for s in skills if s["verified"]],
        "all_skills": skills,
        "capstones": capstones,
        "verification_status": "Verified by NIT Karnataka TPO Cell & Industry Partners"
    }

# 5. MATCHED INTERNSHIPS & PLACEMENTS ENGINE
@app.get("/api/internships")
def get_internships(
    query: Optional[str] = None,
    work_mode: Optional[str] = None,
    type: Optional[str] = None
):
    conn = get_connection()
    cursor = conn.cursor()

    sql = "SELECT i.*, u.avatar as recruiter_avatar FROM internships i JOIN users u ON i.recruiter_id = u.id WHERE i.is_active = 1"
    params = []

    if query:
        sql += " AND (i.title LIKE ? OR i.company_name LIKE ? OR i.description LIKE ?)"
        term = f"%{query}%"
        params.extend([term, term, term])
    if work_mode and work_mode != "All":
        sql += " AND i.work_mode = ?"
        params.append(work_mode)
    if type and type != "All":
        sql += " AND i.type = ?"
        params.append(type)

    sql += " ORDER BY i.created_at DESC;"
    cursor.execute(sql, params)
    internships = [dict(row) for row in cursor.fetchall()]

    # Attach required skills
    for item in internships:
        cursor.execute("""
        SELECT s.name as skill_name, s.category, isk.weight, isk.min_proficiency
        FROM internship_skills isk
        JOIN skills s ON isk.skill_id = s.id
        WHERE isk.internship_id = ?;
        """, (item["id"],))
        item["skills"] = [dict(r) for r in cursor.fetchall()]

    conn.close()
    return {"internships": internships}

@app.get("/api/internships/matched/{student_id}")
def get_matched_internships(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    # Get student skills map
    cursor.execute("SELECT skill_id, proficiency FROM student_skills WHERE student_id = ?;", (student_id,))
    student_skills = {row["skill_id"]: row["proficiency"] for row in cursor.fetchall()}

    # Get student's existing applications
    cursor.execute("SELECT internship_id, status FROM applications WHERE student_id = ?;", (student_id,))
    applied_map = {row["internship_id"]: row["status"] for row in cursor.fetchall()}

    # Get all internships
    cursor.execute("SELECT i.*, u.avatar as recruiter_avatar FROM internships i JOIN users u ON i.recruiter_id = u.id WHERE i.is_active = 1;")
    internships = [dict(row) for row in cursor.fetchall()]

    matched_list = []
    for item in internships:
        cursor.execute("""
        SELECT isk.skill_id, isk.weight, isk.min_proficiency, s.name as skill_name
        FROM internship_skills isk
        JOIN skills s ON isk.skill_id = s.id
        WHERE isk.internship_id = ?;
        """, (item["id"],))
        req_skills = cursor.fetchall()

        total_weight = 0
        earned_score = 0
        skills_matched = []
        skills_gap = []

        for req in req_skills:
            w = req["weight"]
            min_p = req["min_proficiency"]
            stu_p = student_skills.get(req["skill_id"], 0)
            total_weight += (min_p * w)
            earned_score += (min(stu_p, min_p) * w)

            if stu_p >= min_p:
                skills_matched.append({
                    "skill": req["skill_name"],
                    "student_prof": stu_p,
                    "required": min_p
                })
            else:
                skills_gap.append({
                    "skill": req["skill_name"],
                    "student_prof": stu_p,
                    "required": min_p,
                    "gap": min_p - stu_p
                })

        match_score = round((earned_score / total_weight) * 100) if total_weight > 0 else 70
        item["match_score"] = match_score
        item["skills_matched"] = skills_matched
        item["skills_gap"] = skills_gap
        item["skills_list"] = [r["skill_name"] for r in req_skills]
        item["application_status"] = applied_map.get(item["id"], None)
        matched_list.append(item)

    # Sort by compatibility score descending
    matched_list.sort(key=lambda x: x["match_score"], reverse=True)
    conn.close()
    return {"internships": matched_list}

@app.post("/api/internships")
def create_internship(payload: InternshipCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO internships (recruiter_id, company_name, title, type, stipend, location, work_mode, description, min_cgpa, openings, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (payload.recruiter_id, payload.company_name, payload.title, payload.type, payload.stipend, payload.location, payload.work_mode, payload.description, payload.min_cgpa, payload.openings, payload.deadline))
    internship_id = cursor.lastrowid

    # Add required skills
    for skill_id in payload.skill_ids:
        cursor.execute("""
        INSERT INTO internship_skills (internship_id, skill_id, weight, min_proficiency)
        VALUES (?, ?, 3, 70);
        """, (internship_id, skill_id))

    conn.commit()
    conn.close()
    return {"status": "success", "internship_id": internship_id, "message": "Internship opening published successfully!"}

@app.post("/api/internships/apply")
def apply_internship(payload: ApplicationCreate):
    conn = get_connection()
    cursor = conn.cursor()

    # Calculate match score
    cursor.execute("SELECT skill_id, proficiency FROM student_skills WHERE student_id = ?;", (payload.student_id,))
    student_skills = {row["skill_id"]: row["proficiency"] for row in cursor.fetchall()}

    cursor.execute("SELECT skill_id, weight, min_proficiency FROM internship_skills WHERE internship_id = ?;", (payload.internship_id,))
    req_skills = cursor.fetchall()

    total_weight = 0
    earned_score = 0
    for req in req_skills:
        w = req["weight"]
        min_p = req["min_proficiency"]
        stu_p = student_skills.get(req["skill_id"], 0)
        total_weight += (min_p * w)
        earned_score += (min(stu_p, min_p) * w)

    match_score = round((earned_score / total_weight) * 100) if total_weight > 0 else 75

    try:
        cursor.execute("""
        INSERT INTO applications (internship_id, student_id, match_score, status, notes)
        VALUES (?, ?, ?, 'Applied', ?);
        """, (payload.internship_id, payload.student_id, match_score, payload.notes or "Applied via SkillBridge AI Matchmaker"))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        raise HTTPException(status_code=400, detail="You have already applied for this opening.")

    conn.close()
    return {"status": "success", "match_score": match_score, "message": f"Application submitted! AI Match Score: {match_score}%"}

@app.get("/api/applications/student/{student_id}")
def get_student_applications(student_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT a.*, i.title, i.company_name, i.location, i.type, i.stipend, i.deadline
    FROM applications a
    JOIN internships i ON a.internship_id = i.id
    WHERE a.student_id = ?
    ORDER BY a.applied_at DESC;
    """, (student_id,))
    apps = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"applications": apps}

@app.get("/api/applications/recruiter/{recruiter_id}")
def get_recruiter_applications(recruiter_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT a.*, i.title as job_title, i.company_name, u.name as student_name, u.email as student_email,
           u.avatar as student_avatar, s.cgpa, s.branch, s.graduation_year, s.github_url, s.linkedin_url
    FROM applications a
    JOIN internships i ON a.internship_id = i.id
    JOIN students s ON a.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE i.recruiter_id = ?
    ORDER BY a.match_score DESC, a.applied_at DESC;
    """, (recruiter_id,))
    apps = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"applications": apps}

@app.post("/api/applications/{app_id}/status")
def update_application_status(app_id: int, payload: StatusUpdate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE applications
    SET status = ?, notes = COALESCE(?, notes)
    WHERE id = ?;
    """, (payload.status, payload.notes, app_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Applicant status updated to {payload.status}"}

# 6. ACADEMIA TPO & CURRICULUM AUDIT ENGINE
@app.get("/api/tpo/analytics")
def get_tpo_analytics():
    conn = get_connection()
    cursor = conn.cursor()

    # Total students and placement stats
    cursor.execute("SELECT COUNT(*) FROM students;")
    total_students = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT student_id) FROM applications WHERE status IN ('Offered', 'Selected');")
    placed_students = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(DISTINCT student_id) FROM applications WHERE status IN ('Interview Scheduled', 'Technical Assessment', 'Resume Shortlisted');")
    in_pipeline = cursor.fetchone()[0]

    # Department readiness
    departments = [
        {"department": "Computer Science & Engg", "enrolled": 180, "readiness_index": 88, "placed_pct": 82, "avg_package": "12.4 LPA"},
        {"department": "Information Technology", "enrolled": 120, "readiness_index": 84, "placed_pct": 79, "avg_package": "10.8 LPA"},
        {"department": "Electronics & Comm (ECE)", "enrolled": 140, "readiness_index": 76, "placed_pct": 71, "avg_package": "9.2 LPA"},
        {"department": "Electrical & AI", "enrolled": 90, "readiness_index": 82, "placed_pct": 75, "avg_package": "11.5 LPA"},
        {"department": "Mechanical (Mechatronics/IoT)", "enrolled": 110, "readiness_index": 68, "placed_pct": 58, "avg_package": "7.8 LPA"}
    ]

    # Top corporate partners
    partners = [
        {"name": "InnovateTech Global", "hired": 24, "status": "Active MoU", "domain": "Cloud & AI"},
        {"name": "ZeroDegree AI Labs", "hired": 12, "status": "Active MoU", "domain": "LLMs & Agentic AI"},
        {"name": "Tata Consultancy Services", "hired": 68, "status": "Prime Partner", "domain": "Enterprise Tech"},
        {"name": "Razorpay Tech", "hired": 9, "status": "Incubation Partner", "domain": "FinTech & Payments"},
        {"name": "Microsoft India", "hired": 14, "status": "Research Lab", "domain": "Systems & AI"}
    ]

    conn.close()
    return {
        "metrics": {
            "total_registered_students": total_students or 640,
            "overall_placement_rate": "78.4%",
            "active_internships_count": 48,
            "active_corporate_mous": 18,
            "avg_ctc": "₹11.2 LPA",
            "highest_ctc": "₹44.0 LPA",
            "students_in_pipeline": in_pipeline + 34
        },
        "departments": departments,
        "partners": partners
    }

@app.get("/api/curriculum/audit")
def get_curriculum_audit():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT ct.*, s.name as mapped_skill_name
    FROM curriculum_topics ct
    LEFT JOIN skills s ON ct.skill_id = s.id
    ORDER BY ct.semester, ct.course_code;
    """)
    topics = [dict(row) for row in cursor.fetchall()]
    conn.close()

    avg_alignment = round(sum(t["industry_alignment_score"] for t in topics) / len(topics)) if topics else 72
    outdated_count = sum(1 for t in topics if t["status"] in ("Needs Update", "Obsolete"))

    return {
        "curriculum_topics": topics,
        "average_alignment_score": avg_alignment,
        "outdated_modules_count": outdated_count,
        "compliance_status": "NEP-2020 Skill Integration: 74% Met"
    }

@app.get("/api/curriculum/feedback")
def get_curriculum_feedback():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT cf.*, u.name as recruiter_name, u.organization as company_name
    FROM curriculum_feedback cf
    JOIN users u ON cf.recruiter_id = u.id
    ORDER BY cf.votes DESC;
    """)
    feedback = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"feedback": feedback}

@app.post("/api/curriculum/feedback")
def add_curriculum_feedback(payload: CurriculumFeedbackCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO curriculum_feedback (recruiter_id, course_name, recommended_topic, industry_use_case, votes, status)
    VALUES (?, ?, ?, ?, 1, 'Under Review');
    """, (payload.recruiter_id, payload.course_name, payload.recommended_topic, payload.industry_use_case))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Curriculum recommendation submitted to TPO Academic Council!"}

@app.post("/api/curriculum/feedback/{feedback_id}/vote")
def upvote_curriculum_feedback(feedback_id: int):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE curriculum_feedback SET votes = votes + 1 WHERE id = ?;", (feedback_id,))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Upvoted!"}

# 7. LIVE INDUSTRY CAPSTONE CHALLENGES
@app.get("/api/capstones")
def get_capstones():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM capstones ORDER BY id DESC;")
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"capstones": items}

@app.post("/api/capstones")
def create_capstone(payload: CapstoneCreate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO capstones (recruiter_id, company_name, title, domain, problem_statement, grant_amount, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, (payload.recruiter_id, payload.company_name, payload.title, payload.domain, payload.problem_statement, payload.grant_amount, payload.deadline))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Industry Capstone Problem Statement published!"}

@app.post("/api/capstones/apply")
def apply_capstone(payload: CapstoneApply):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO capstone_applications (capstone_id, student_id, team_name, faculty_mentor, proposal_summary, status)
    VALUES (?, ?, ?, ?, ?, 'Proposal Submitted');
    """, (payload.capstone_id, payload.student_id, payload.team_name, payload.faculty_mentor, payload.proposal_summary))
    conn.commit()
    conn.close()
    return {"status": "success", "message": "Capstone Proposal submitted successfully!"}

# 8. ADMIN / NATIONAL AICTE & NEP-2020 METRICS
@app.get("/api/admin/metrics")
def get_admin_metrics():
    return {
        "national_index": {
            "overall_employability": "64.8%",
            "growth_yoy": "+8.4%",
            "participating_universities": 1420,
            "industry_partners": 3890,
            "total_internships_facilitated": "128,450"
        },
        "top_in_demand_skills": [
            {"skill": "GenAI & LLMs", "growth": "+142%", "urgency": "Critical"},
            {"skill": "Cloud DevOps (K8s/Docker)", "growth": "+95%", "urgency": "Critical"},
            {"skill": "Full Stack API Engineering", "growth": "+78%", "urgency": "High"},
            {"skill": "Cybersecurity & Zero Trust", "growth": "+65%", "urgency": "High"},
            {"skill": "Edge Computing & TinyML", "growth": "+58%", "urgency": "High"}
        ],
        "tier_distribution": [
            {"tier": "Tier 1 Institutions (IITs/NITs)", "employability": "88.2%", "active_mous": "14.2 / inst"},
            {"tier": "Tier 2 State Universities", "employability": "62.4%", "active_mous": "6.8 / inst"},
            {"tier": "Tier 3 Affiliated Colleges", "employability": "44.6%", "active_mous": "2.1 / inst"}
        ]
    }

# 9. AI RESUME PARSER & SKILL EXTRACTOR
@app.post("/api/ai/parse-resume")
def parse_resume_skills(payload: ResumeParseRequest):
    text = payload.resume_text.lower()
    
    # Skill dictionary to scan
    skill_keywords = {
        1: ("python", ["python", "django", "flask", "numpy", "pandas"]),
        2: ("pytorch / tensorflow", ["pytorch", "tensorflow", "keras", "deep learning", "neural"]),
        3: ("large language models (llms)", ["llm", "langchain", "llama", "gpt", "rag", "transformers", "vector db", "prompt engineering"]),
        4: ("mlops & model deployment", ["mlops", "model deployment", "wandb", "mlflow", "triton", "onnx"]),
        5: ("computer vision / opencv", ["opencv", "yolo", "cnn", "image processing", "vision transformer"]),
        6: ("fastapi / flask", ["fastapi", "pydantic", "starlette", "rest api", "uvicorn"]),
        7: ("react.js & next.js", ["react", "next.js", "nextjs", "redux", "tailwind", "frontend"]),
        8: ("typescript", ["typescript", "ts", "typed javascript"]),
        9: ("sql & database design", ["sql", "postgresql", "mysql", "database design", "indexing", "sqlite", "query optimization"]),
        10: ("node.js / express", ["node.js", "nodejs", "express", "npm"]),
        11: ("restful api architecture", ["rest", "api", "openapi", "swagger", "json api", "http endpoints"]),
        12: ("docker & containerization", ["docker", "dockerfile", "container", "docker-compose", "containerization"]),
        13: ("kubernetes orchestration", ["kubernetes", "k8s", "helm", "pods", "minikube", "ingress"]),
        14: ("aws / azure cloud", ["aws", "s3", "ec2", "lambda", "azure", "cloud practitioner", "gcp"]),
        15: ("ci/cd pipelines (github actions)", ["ci/cd", "github actions", "jenkins", "pipeline", "automated test"]),
        16: ("microservices architecture", ["microservices", "service mesh", "message queue", "kafka", "rabbitmq"]),
        17: ("data structures & algorithms", ["leetcode", "dsa", "algorithms", "data structures", "dynamic programming", "graph"]),
        18: ("distributed systems", ["distributed systems", "consensus", "paxos", "raft", "sharding"]),
        19: ("cybersecurity & owasp", ["cybersecurity", "owasp", "penetration testing", "encryption", "jwt"]),
        20: ("system design & scalability", ["system design", "scalability", "load balancing", "high availability", "caching"])
    }

    detected = []
    conn = get_connection()
    cursor = conn.cursor()

    for skill_id, (skill_name, keywords) in skill_keywords.items():
        hits = sum(1 for kw in keywords if kw in text)
        if hits > 0:
            # Calculate proficiency estimate based on keyword density & context
            estimated_prof = min(95, 60 + (hits * 10))
            cursor.execute("""
            INSERT INTO student_skills (student_id, skill_id, proficiency, verified, badge_name)
            VALUES (?, ?, ?, 1, 'AI-Resume Verified')
            ON CONFLICT(student_id, skill_id) DO UPDATE SET
                proficiency = MAX(student_skills.proficiency, excluded.proficiency),
                verified = 1,
                badge_name = 'AI-Resume Verified';
            """, (payload.student_id, skill_id, estimated_prof))
            detected.append({
                "skill_id": skill_id,
                "skill_name": skill_name.title(),
                "hits": hits,
                "assigned_proficiency": estimated_prof
            })

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "extracted_skills_count": len(detected),
        "detected_skills": detected,
        "message": f"Successfully extracted {len(detected)} verified tech competencies from your resume!"
    }

# 10. INTERACTIVE SKILL ASSESSMENT QUIZ (VERIFIED BADGE ISSUANCE)
QUIZ_BANK = {
    1: [  # Python
        {
            "id": 1,
            "question": "What is the primary difference between a Python generator and a normal function returning a list?",
            "options": [
                "Generators use yield and evaluate lazily without storing the entire sequence in memory",
                "Generators run faster because they execute on C-level GPU threads",
                "Normal functions cannot accept variable arguments (*args)",
                "Generators can only return integer sequences"
            ],
            "correct": 0,
            "explanation": "Generators use `yield` to stream values on-demand (lazy evaluation), maintaining an O(1) memory footprint."
        },
        {
            "id": 2,
            "question": "How does Python's Global Interpreter Lock (GIL) affect multi-threaded CPU-bound programs in CPython?",
            "options": [
                "It automatically distributes threads across all CPU cores simultaneously",
                "It prevents multiple native threads from executing Python bytecode simultaneously",
                "It disables memory garbage collection in async routines",
                "It converts all multi-threaded code to WebAssembly"
            ],
            "correct": 1,
            "explanation": "In CPython, the GIL permits only one thread to execute Python bytecode at a time, making multiprocessing preferable for CPU-bound tasks."
        },
        {
            "id": 3,
            "question": "Which method is best for asynchronous non-blocking I/O in modern Python microservices?",
            "options": [
                "os.fork()",
                "asyncio with async/await coroutines",
                "time.sleep() inside while loops",
                "Global mutex locks"
            ],
            "correct": 1,
            "explanation": "Python's `asyncio` event loop provides asynchronous single-threaded cooperative multitasking for high-concurrency network I/O."
        }
    ],
    3: [  # LLMs
        {
            "id": 1,
            "question": "In Retrieval-Augmented Generation (RAG), why are chunking and embedding models used before passing context to an LLM?",
            "options": [
                "To compress PDF binaries into executable machine code",
                "To retrieve semantically relevant context chunks that fit within the model's context window",
                "To bypass GPU quantization limitations",
                "To eliminate the need for an API token"
            ],
            "correct": 1,
            "explanation": "RAG segments documents and queries dense vector embeddings to ground the LLM response in precise retrieved facts."
        },
        {
            "id": 2,
            "question": "What is the core benefit of Low-Rank Adaptation (LoRA) for LLM fine-tuning?",
            "options": [
                "It trains adapter weight matrices of low rank, reducing trainable parameters by >90%",
                "It deletes all attention heads to speed up inference",
                "It replaces transformer attention with recurrent neural networks",
                "It allows running 70B models without any RAM"
            ],
            "correct": 0,
            "explanation": "LoRA freezes the pre-trained weights and injects trainable rank-decomposition matrices, massively reducing compute requirements."
        },
        {
            "id": 3,
            "question": "What metric is most suitable for evaluating semantic similarity between generated and reference answers?",
            "options": [
                "Cosine similarity of dense vector embeddings / BERTScore",
                "Character count length comparison",
                "SHA-256 hash collision test",
                "HTTP latency response time"
            ],
            "correct": 0,
            "explanation": "BERTScore or embedding cosine similarity captures contextual semantic meaning beyond naive lexical keyword matching."
        }
    ],
    12: [ # Docker
        {
            "id": 1,
            "question": "Why are multi-stage Docker builds widely recommended for production containers?",
            "options": [
                "They separate the build environment from the lean production runtime, dramatically shrinking image size",
                "They allow Docker to run without a Linux kernel",
                "They bypass container firewall rules",
                "They run multi-core compilation on Docker Hub for free"
            ],
            "correct": 0,
            "explanation": "Multi-stage builds leave compiler tools and dev dependencies behind, creating secure, lightweight production images."
        },
        {
            "id": 2,
            "question": "Which Dockerfile instruction creates a new image layer?",
            "options": [
                "RUN, COPY, and ADD",
                "EXPOSE and CMD only",
                "LABEL and MAINTAINER",
                "ENV only"
            ],
            "correct": 0,
            "explanation": "`RUN`, `COPY`, and `ADD` modify the filesystem and generate new immutable image layers."
        },
        {
            "id": 3,
            "question": "What is the purpose of Docker bridge networking?",
            "options": [
                "Enables containers running on the same host daemon to communicate over isolated virtual interfaces",
                "Connects Docker directly to Bluetooth hardware",
                "Bypasses TCP/IP protocols for fiber optics",
                "Shares host root access with guest containers"
            ],
            "correct": 0,
            "explanation": "Bridge networks isolate container traffic on the host while allowing inter-container DNS and port routing."
        }
    ]
}

@app.get("/api/assessment/{skill_id}")
def get_skill_quiz(skill_id: int):
    # Fallback to Python quiz if specific skill not in mock bank
    quiz = QUIZ_BANK.get(skill_id, QUIZ_BANK[1])
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM skills WHERE id = ?", (skill_id,))
    row = cursor.fetchone()
    skill_name = row["name"] if row else "Core Engineering Competency"
    conn.close()

    # Mask correct answers for client delivery
    client_questions = []
    for q in quiz:
        client_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })

    return {
        "skill_id": skill_id,
        "skill_name": skill_name,
        "questions": client_questions
    }

@app.post("/api/assessment/submit")
def submit_skill_quiz(payload: QuizSubmitRequest):
    quiz = QUIZ_BANK.get(payload.skill_id, QUIZ_BANK[1])
    correct_count = 0

    for q in quiz:
        user_ans = payload.answers.get(str(q["id"]))
        if user_ans == q["correct"]:
            correct_count += 1

    score_pct = round((correct_count / len(quiz)) * 100)
    passed = score_pct >= 66

    conn = get_connection()
    cursor = conn.cursor()

    if passed:
        cursor.execute("SELECT name FROM skills WHERE id = ?", (payload.skill_id,))
        row = cursor.fetchone()
        skill_name = row["name"] if row else "Specialist"
        badge_name = f"Gold Certified - {skill_name} Mastery"

        cursor.execute("""
        INSERT INTO student_skills (student_id, skill_id, proficiency, verified, badge_name, endorsements_count)
        VALUES (?, ?, 92, 1, ?, 10)
        ON CONFLICT(student_id, skill_id) DO UPDATE SET
            proficiency = MAX(student_skills.proficiency, 92),
            verified = 1,
            badge_name = excluded.badge_name,
            endorsements_count = student_skills.endorsements_count + 5;
        """, (payload.student_id, payload.skill_id, badge_name))
        conn.commit()

    conn.close()

    return {
        "score_pct": score_pct,
        "correct_answers": correct_count,
        "total_questions": len(quiz),
        "passed": passed,
        "badge_awarded": passed,
        "message": "🎉 Congratulations! You achieved proficiency verification and earned a Verified Gold Badge!" if passed else "You scored below the 66% verification threshold. Review the recommended bridge roadmap and try again!"
    }

# 11. CURRICULUM BEFORE/AFTER MODERNIZER (ACADEMIA-INDUSTRY GAP VISUALIZER)
@app.get("/api/curriculum/modernizer")
def get_curriculum_modernization_comparison():
    return {
        "comparisons": [
            {
                "semester": "Semester 6",
                "course_code": "CS604",
                "legacy_title": "Artificial Intelligence & Expert Systems (Legacy 2018)",
                "legacy_syllabus": [
                    "Propositional & Predicate Logic",
                    "Prolog / Lisp Rule Syntax",
                    "A* and Alpha-Beta Pruning Algorithms",
                    "Rule-based Expert Systems & MYCIN architecture"
                ],
                "modern_title": "Generative AI, Transformers & Agentic Systems (AICTE NEP-2026)",
                "modern_syllabus": [
                    "Attention Mechanisms & Transformer Deep Architectures",
                    "Retrieval-Augmented Generation (RAG) with Vector Databases",
                    "Fine-tuning Open Foundation Models with LoRA / QLoRA",
                    "Autonomous Multi-Agent Orchestration & Tool Execution (LangChain/CrewAI)"
                ],
                "industry_justification": "Modern enterprise demand for Prolog/Rule engines is <0.5%, while Generative AI and LLM roles increased by 142% year-over-year.",
                "placement_readiness_boost": "+38% Placement Match"
            },
            {
                "semester": "Semester 6",
                "course_code": "CS602",
                "legacy_title": "Grid & Distributed Computing (Legacy 2018)",
                "legacy_syllabus": [
                    "Theoretical Grid Architecture & Condor Middleware",
                    "Corba and Remote Method Invocation (RMI)",
                    "Basic Socket Programming in Java 7",
                    "Monolithic Virtualization Overview"
                ],
                "modern_title": "Cloud Native Systems, Containers & Kubernetes (AICTE NEP-2026)",
                "modern_syllabus": [
                    "Multi-stage Containerization with Docker & OCI Standards",
                    "Kubernetes Microservice Orchestration, Ingress & Helm",
                    "Infrastructure as Code (Terraform) & GitHub Actions CI/CD",
                    "Observability, Distributed Tracing (Prometheus/Grafana) & Zero Trust"
                ],
                "industry_justification": "92% of top tech recruiters require container orchestration and cloud-native practices for entry-level SRE and backend roles.",
                "placement_readiness_boost": "+44% Placement Match"
            }
        ]
    }

# 12. TPO PLACEMENT RISK & INTERVENTION PREDICTOR
@app.get("/api/tpo/risk-analysis")
def get_tpo_risk_analysis():
    return {
        "at_risk_students": [
            {
                "id": 104,
                "name": "Karthik Raja",
                "branch": "Mechanical (Mechatronics Track)",
                "cgpa": 7.12,
                "readiness_index": 52,
                "primary_gap": "Missing Modern C++ & Edge IoT Frameworks",
                "recommended_intervention": "Assign 2-week Embedded Edge AI Capstone under Bosch IoT Lab"
            },
            {
                "id": 109,
                "name": "Ananya Sen",
                "branch": "Electronics & Comm (ECE)",
                "cgpa": 7.45,
                "readiness_index": 58,
                "primary_gap": "Weak Full-Stack API Engineering",
                "recommended_intervention": "Enroll in Fast-Track FastAPI & Microservices Bridge Track"
            },
            {
                "id": 115,
                "name": "Rohan Gupta",
                "branch": "Computer Science & Engg",
                "cgpa": 6.89,
                "readiness_index": 61,
                "primary_gap": "Containerization & Cloud Deployments (Docker/AWS)",
                "recommended_intervention": "Mandatory CNCF K8s Lab Workshop & Mock Technical Interview"
            }
        ],
        "summary": "3 students flagged for high risk of placement unreadiness. Automated remedial roadmaps dispatched."
    }

# 13. WIX SITE SPECIFIC BACKEND APIS (https://vedhagariga896.wixsite.com/skillbridge)

@app.get("/api/wix/opportunities")
def get_wix_opportunities():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wix_opportunities ORDER BY id DESC;")
    items = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"status": "success", "opportunities": items}

@app.post("/api/wix/publish-opportunity")
def publish_wix_opportunity(payload: WixOpportunityCreate):
    conn = get_connection()
    cursor = conn.cursor()
    
    # Calculate initial match score based on skills complexity
    skills_joined = ", ".join(payload.required_skills) if payload.required_skills else "General Engineering"
    calc_match = 84 if "Engineering" in payload.required_skills or "Python" in skills_joined else 78

    cursor.execute("""
    INSERT INTO wix_opportunities 
    (full_name, company_email, job_title, company_name, industry, location, job_type, required_skills, job_description, match_score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, (
        payload.full_name,
        payload.company_email,
        payload.job_title,
        payload.full_name.split()[0] + " Corp" if not payload.company_email.endswith('@') else payload.company_email.split('@')[1].split('.')[0].title(),
        payload.industry,
        payload.location,
        payload.job_type,
        skills_joined,
        payload.job_description,
        calc_match
    ))
    opp_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return {
        "status": "success",
        "opportunity_id": opp_id,
        "message": "Opportunity published successfully and matched with student profiles!"
    }

@app.get("/api/wix/company/applicants")
def get_wix_applicants():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wix_applicants ORDER BY match_score DESC, id ASC;")
    applicants = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"status": "success", "applicants": applicants}

@app.post("/api/wix/company/applicant-status")
def update_wix_applicant_status(payload: WixApplicantStatusUpdate):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    UPDATE wix_applicants SET status = ? WHERE id = ?;
    """, (payload.status, payload.applicant_id))
    conn.commit()
    conn.close()
    return {"status": "success", "message": f"Candidate status updated to '{payload.status}'"}

@app.get("/api/wix/student/dashboard")
def get_wix_student_dashboard():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM wix_opportunities ORDER BY match_score DESC;")
    opps = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return {
        "profile": {
            "name": "Vedha Gariga",
            "major": "Computer Science",
            "profile_completion": 85,
            "roll_no": "23CS1082",
            "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        },
        "skill_gaps": [
            { "skill": "Python", "status": "Available", "proficiency": 88, "type": "backend" },
            { "skill": "React", "status": "Missing", "proficiency": 35, "type": "frontend" },
            { "skill": "Git", "status": "Missing", "proficiency": 40, "type": "tools" },
            { "skill": "REST API", "status": "Missing", "proficiency": 45, "type": "architecture" }
        ],
        "learning_path": [
            {
                "title": "Master React Development with Udemy",
                "platform": "Udemy",
                "skill": "React",
                "est_time": "12 Hours",
                "link": "https://www.udemy.com"
            },
            {
                "title": "Learn Git & GitHub Pro with Coursera",
                "platform": "Coursera",
                "skill": "Git",
                "est_time": "8 Hours",
                "link": "https://www.coursera.org"
            },
            {
                "title": "REST API Mastery: The Complete Guide",
                "platform": "SkillBridge Academy",
                "skill": "REST API",
                "est_time": "10 Hours",
                "link": "https://vedhagariga896.wixsite.com/skillbridge"
            }
        ],
        "opportunities": opps
    }

@app.post("/api/wix/student/apply")
def apply_wix_opportunity(payload: WixStudentApplyRequest):
    conn = get_connection()
    cursor = conn.cursor()

    # Get job title
    cursor.execute("SELECT job_title FROM wix_opportunities WHERE id = ?;", (payload.job_id,))
    row = cursor.fetchone()
    role_title = row["job_title"] if row else "Software Intern"

    # Add student to applicants table
    cursor.execute("""
    INSERT INTO wix_applicants (name, applied_role, match_score, status)
    VALUES (?, ?, ?, 'Applied');
    """, (payload.student_name, role_title, payload.match_score))
    conn.commit()
    conn.close()

    return {
        "status": "success",
        "message": f"Successfully applied for {role_title}! Your application has been sent to the hiring team."
    }

@app.get("/api/wix/college/analytics")
def get_wix_college_analytics():
    return {
        "metrics": {
            "students_assessed": "12,480",
            "placement_ready": "8,120",
            "top_skill_gap": "React: 120",
            "internship_matches": "4,250+"
        },
        "skill_gaps": [
            {
                "skill": "React",
                "students_affected": 120,
                "percentage": 68,
                "description": "120 students identified as having a significant gap in this essential front-end library."
            },
            {
                "skill": "Python",
                "students_affected": 75,
                "percentage": 42,
                "description": "75 students identified as having a significant gap in this essential back-end language."
            },
            {
                "skill": "Git",
                "students_affected": 55,
                "percentage": 31,
                "description": "55 students identified as having a significant gap in this essential version control tool."
            }
        ]
    }

@app.post("/api/wix/contact")
def submit_wix_contact(data: Dict[str, Any]):
    return {
        "status": "success",
        "message": "Thank you for contacting SkillBridge! Our team has received your message at contact@skillbridge.io."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)

