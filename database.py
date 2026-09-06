"""
SkillBridge AI - Database & Data Access Layer
SQLite database for Academia-Industry Collaboration, Skill Mapping, Internships & Placement.
"""

import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), "skillbridge.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initializes the database schema and seeds initial data if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON;")

    # 1. Users table (Students, Recruiters, TPOs, Admins)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'recruiter', 'tpo', 'admin')),
        organization TEXT NOT NULL,
        department TEXT,
        avatar TEXT,
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 2. Student Details
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE NOT NULL,
        roll_no TEXT,
        cgpa REAL DEFAULT 8.2,
        branch TEXT NOT NULL,
        graduation_year INTEGER DEFAULT 2026,
        target_role TEXT DEFAULT 'AI/ML Engineer',
        github_url TEXT,
        linkedin_url TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 3. Master Skills List
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        category TEXT NOT NULL,
        demand_level TEXT DEFAULT 'High' CHECK(demand_level IN ('Critical', 'High', 'Moderate'))
    );
    """)

    # 4. Student Skills (with proficiency & verified badge)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS student_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        skill_id INTEGER NOT NULL,
        proficiency INTEGER CHECK(proficiency BETWEEN 0 AND 100),
        verified BOOLEAN DEFAULT 0,
        badge_name TEXT,
        endorsements_count INTEGER DEFAULT 0,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
        UNIQUE(student_id, skill_id)
    );
    """)

    # 5. Role Benchmarks (Industry Standard Skill Expectations)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS role_benchmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        role_name TEXT NOT NULL,
        skill_id INTEGER NOT NULL,
        benchmark_level INTEGER CHECK(benchmark_level BETWEEN 0 AND 100),
        is_core BOOLEAN DEFAULT 1,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
        UNIQUE(role_name, skill_id)
    );
    """)

    # 6. Internships & Placement Job Postings
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recruiter_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        title TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('Internship', 'Full-time Placement', 'Co-op')),
        stipend TEXT NOT NULL,
        location TEXT NOT NULL,
        work_mode TEXT NOT NULL CHECK(work_mode IN ('Remote', 'Hybrid', 'On-site')),
        description TEXT NOT NULL,
        min_cgpa REAL DEFAULT 7.0,
        openings INTEGER DEFAULT 5,
        deadline TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 7. Internship Skill Requirements (with weights)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS internship_skills (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        internship_id INTEGER NOT NULL,
        skill_id INTEGER NOT NULL,
        weight INTEGER DEFAULT 1,
        min_proficiency INTEGER DEFAULT 60,
        FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
        FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
        UNIQUE(internship_id, skill_id)
    );
    """)

    # 8. Applications & Pipeline
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        internship_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        match_score INTEGER DEFAULT 0,
        status TEXT DEFAULT 'Applied' CHECK(status IN ('Applied', 'Resume Shortlisted', 'Technical Assessment', 'Interview Scheduled', 'Offered', 'Rejected')),
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        notes TEXT,
        FOREIGN KEY (internship_id) REFERENCES internships(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        UNIQUE(internship_id, student_id)
    );
    """)

    # 9. Curriculum Topics & Industry Alignment Audit
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS curriculum_topics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        branch TEXT NOT NULL,
        semester INTEGER NOT NULL,
        course_code TEXT NOT NULL,
        course_name TEXT NOT NULL,
        skill_id INTEGER,
        industry_alignment_score INTEGER DEFAULT 70,
        status TEXT DEFAULT 'Current' CHECK(status IN ('Cutting-edge', 'Current', 'Needs Update', 'Obsolete')),
        syllabus_gap_note TEXT,
        FOREIGN KEY (skill_id) REFERENCES skills(id)
    );
    """)

    # 10. Curriculum Feedback (Industry to Academia feedback loop)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS curriculum_feedback (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recruiter_id INTEGER NOT NULL,
        course_name TEXT NOT NULL,
        recommended_topic TEXT NOT NULL,
        industry_use_case TEXT NOT NULL,
        votes INTEGER DEFAULT 1,
        status TEXT DEFAULT 'Under Review' CHECK(status IN ('Under Review', 'Accepted by TPO', 'Implemented in Syllabus')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 11. Live Industry Capstone Problem Statements
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS capstones (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        recruiter_id INTEGER NOT NULL,
        company_name TEXT NOT NULL,
        title TEXT NOT NULL,
        domain TEXT NOT NULL,
        problem_statement TEXT NOT NULL,
        grant_amount TEXT NOT NULL,
        mentorship_offered BOOLEAN DEFAULT 1,
        max_teams INTEGER DEFAULT 3,
        deadline TEXT NOT NULL,
        status TEXT DEFAULT 'Open' CHECK(status IN ('Open', 'Allocated', 'Completed')),
        FOREIGN KEY (recruiter_id) REFERENCES users(id) ON DELETE CASCADE
    );
    """)

    # 12. Capstone Team Submissions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS capstone_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        capstone_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        team_name TEXT NOT NULL,
        faculty_mentor TEXT NOT NULL,
        proposal_summary TEXT NOT NULL,
        status TEXT DEFAULT 'Proposal Submitted' CHECK(status IN ('Proposal Submitted', 'Approved by Industry', 'In Progress', 'Delivered')),
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (capstone_id) REFERENCES capstones(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
    """)

    # 13. Wix Site Opportunities (Post Your Opportunity form)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wix_opportunities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        company_email TEXT NOT NULL,
        job_title TEXT NOT NULL,
        company_name TEXT NOT NULL,
        industry TEXT NOT NULL,
        location TEXT NOT NULL,
        job_type TEXT NOT NULL,
        required_skills TEXT NOT NULL,
        job_description TEXT NOT NULL,
        match_score INTEGER DEFAULT 82,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    # 14. Wix Site Applicant Management (Review and shortlist candidates)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS wix_applicants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        applied_role TEXT NOT NULL,
        match_score INTEGER NOT NULL,
        status TEXT DEFAULT 'Shortlisted',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    """)

    conn.commit()
    conn.close()

def seed_database():
    """Seeds rich, realistic data tailored for SIH Hackathon evaluation."""
    conn = get_connection()
    cursor = conn.cursor()

    # Check if already seeded users
    cursor.execute("SELECT COUNT(*) FROM users;")
    if cursor.fetchone()[0] == 0:
        seed_core_data(cursor, conn)
    
    seed_wix_data(cursor, conn)
    conn.close()
    print("Database initialized and seeded successfully!")

def seed_core_data(cursor, conn):
    # Seed Master Users
    users = [
        # Student Persona
        ("Aarav Sharma", "aarav.sharma@nitk.ac.in", "student", "National Institute of Technology Karnataka", "Computer Science & Engg", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80", "Passionate 3rd year CSE undergrad focused on Full-Stack AI, Cloud systems, and distributed databases."),
        # Secondary Student
        ("Pooja Iyer", "pooja.iyer@iitb.ac.in", "student", "Indian Institute of Technology Bombay", "Electrical & AI", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", "Final year student with deep learning & computer vision specialization looking for research internships."),
        # Industry Recruiter 1
        ("Priya Nair", "priya.nair@innovatecorp.com", "recruiter", "InnovateTech Global Solutions", "Emerging Tech Talent Acquisition", "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80", "Leading university hiring and innovation labs partnerships for cloud, GenAI, and cybersecurity roles."),
        # Industry Recruiter 2
        ("Vikramaditya Roy", "v.roy@zerodegree.ai", "recruiter", "ZeroDegree AI Labs", "Founder & CTO", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", "Hiring high-velocity interns for LLM fine-tuning, MLops, and scalable backend platforms."),
        # College TPO / Dean Persona
        ("Dr. Rajesh Verma", "tpo@nitk.edu.in", "tpo", "National Institute of Technology Karnataka", "Training & Placement Cell", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80", "Dean of Career Services & Industry Relations. Bridging academic curriculum with Industry 4.0 standards."),
        # AICTE / National Admin Persona
        ("Prof. K. Sundaram", "director.curriculum@aicte-india.org", "admin", "AICTE Ministry of Education", "National Skill & Curriculum Wing", "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80", "National coordinator for Academia-Industry Integration and NEP 2020 skill benchmarking.")
    ]

    cursor.executemany("""
    INSERT INTO users (name, email, role, organization, department, avatar, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?);
    """, users)

    # Seed Student details
    cursor.execute("""
    INSERT INTO students (user_id, roll_no, cgpa, branch, graduation_year, target_role, github_url, linkedin_url)
    VALUES 
    (1, '23CS1082', 8.74, 'Computer Science & Engineering', 2026, 'Full Stack AI Developer', 'https://github.com/aaravsharma', 'https://linkedin.com/in/aaravsharma-tech'),
    (2, '22EE0412', 9.12, 'Electrical & AI', 2025, 'AI/ML Research Engineer', 'https://github.com/poojaiyer', 'https://linkedin.com/in/poojaiyer-ai');
    """)

    # Seed Master Skills
    skills_data = [
        # AI & ML
        ("Python", "AI & ML", "Critical"),
        ("PyTorch / TensorFlow", "AI & ML", "Critical"),
        ("Large Language Models (LLMs)", "AI & ML", "Critical"),
        ("MLOps & Model Deployment", "AI & ML", "High"),
        ("Computer Vision / OpenCV", "AI & ML", "High"),
        
        # Web & Backend
        ("FastAPI / Flask", "Web Dev", "High"),
        ("React.js & Next.js", "Web Dev", "Critical"),
        ("TypeScript", "Web Dev", "High"),
        ("SQL & Database Design", "Web Dev", "Critical"),
        ("Node.js / Express", "Web Dev", "High"),
        ("RESTful API Architecture", "Web Dev", "Critical"),

        # Cloud & DevOps
        ("Docker & Containerization", "Cloud & DevOps", "Critical"),
        ("Kubernetes Orchestration", "Cloud & DevOps", "High"),
        ("AWS / Azure Cloud", "Cloud & DevOps", "Critical"),
        ("CI/CD Pipelines (GitHub Actions)", "Cloud & DevOps", "High"),
        ("Microservices Architecture", "Cloud & DevOps", "High"),

        # Core Systems & Data
        ("Data Structures & Algorithms", "Core CS", "Critical"),
        ("Distributed Systems", "Core CS", "High"),
        ("Cybersecurity & OWASP", "Core CS", "High"),
        ("System Design & Scalability", "Core CS", "Critical")
    ]

    cursor.executemany("INSERT INTO skills (name, category, demand_level) VALUES (?, ?, ?);", skills_data)

    # Map student skills for Aarav Sharma (Student ID 1)
    student_skills = [
        (1, 1, 92, 1, "Gold Skill Badge - Python Expert", 14),             # Python
        (1, 6, 88, 1, "Verified - FastAPI Backend Specialist", 9),       # FastAPI
        (1, 7, 75, 1, "Verified - React Frontend Builder", 6),            # React
        (1, 9, 84, 1, "Verified - Relational DB & SQL Mastery", 11),       # SQL
        (1, 12, 65, 0, "Self-Assessed", 2),                               # Docker
        (1, 17, 85, 1, "Verified - LeetCode 400+ Solved", 22),            # DSA
        (1, 11, 78, 1, "Verified - API Architect", 5),                    # RESTful APIs
        (1, 3, 40, 0, "Beginner", 1),                                     # LLMs (Gap!)
        (1, 4, 30, 0, "Beginner", 0),                                     # MLOps (Gap!)
        (1, 13, 25, 0, "Novice", 0),                                      # Kubernetes (Gap!)
        (1, 14, 45, 0, "Intermediate", 1),                                # AWS (Gap!)
    ]

    cursor.executemany("""
    INSERT INTO student_skills (student_id, skill_id, proficiency, verified, badge_name, endorsements_count)
    VALUES (?, ?, ?, ?, ?, ?);
    """, student_skills)

    # Seed Role Benchmarks for common industry roles
    role_benchmarks = [
        # Full Stack AI Developer
        ("Full Stack AI Developer", 1, 90, 1),   # Python (benchmark: 90)
        ("Full Stack AI Developer", 7, 85, 1),   # React (benchmark: 85)
        ("Full Stack AI Developer", 6, 80, 1),   # FastAPI (benchmark: 80)
        ("Full Stack AI Developer", 3, 75, 1),   # LLMs (benchmark: 75)
        ("Full Stack AI Developer", 12, 70, 0),  # Docker (benchmark: 70)
        ("Full Stack AI Developer", 9, 80, 1),   # SQL (benchmark: 80)
        ("Full Stack AI Developer", 4, 65, 0),   # MLOps (benchmark: 65)
        ("Full Stack AI Developer", 14, 65, 0),  # AWS (benchmark: 65)

        # AI/ML Engineer
        ("AI/ML Engineer", 1, 95, 1),            # Python
        ("AI/ML Engineer", 2, 85, 1),            # PyTorch
        ("AI/ML Engineer", 3, 85, 1),            # LLMs
        ("AI/ML Engineer", 4, 75, 1),            # MLOps
        ("AI/ML Engineer", 17, 80, 1),           # DSA
        ("AI/ML Engineer", 5, 70, 0),            # Computer Vision

        # Cloud & DevOps Specialist
        ("Cloud & DevOps Specialist", 12, 90, 1),# Docker
        ("Cloud & DevOps Specialist", 13, 85, 1),# Kubernetes
        ("Cloud & DevOps Specialist", 14, 85, 1),# AWS Cloud
        ("Cloud & DevOps Specialist", 15, 80, 1),# CI/CD
        ("Cloud & DevOps Specialist", 16, 75, 0),# Microservices
        ("Cloud & DevOps Specialist", 1, 70, 0), # Python

        # Core Backend Systems Engineer
        ("Core Backend Systems Engineer", 1, 90, 1),
        ("Core Backend Systems Engineer", 6, 85, 1),
        ("Core Backend Systems Engineer", 9, 90, 1),
        ("Core Backend Systems Engineer", 18, 80, 1),
        ("Core Backend Systems Engineer", 20, 85, 1),
    ]

    cursor.executemany("""
    INSERT INTO role_benchmarks (role_name, skill_id, benchmark_level, is_core)
    VALUES (?, ?, ?, ?);
    """, role_benchmarks)

    # Seed Internships & Placement Job Postings
    internships = [
        (3, "InnovateTech Global Solutions", "GenAI & Full-Stack Systems Intern", "Internship", "₹45,000 / month", "Bengaluru (Hybrid)", "Hybrid", "Join our AI incubation team building next-generation enterprise copilot applications. You will deploy microservices, fine-tune open models, and integrate low-latency React frontends with FastAPI backends. Strong PPO conversion opportunity.", 7.5, 6, "2026-10-31"),
        (4, "ZeroDegree AI Labs", "LLM Engineer & Autonomous Agents Intern", "Internship", "₹60,000 / month", "Remote (Pan-India)", "Remote", "Design agentic frameworks with multi-turn reasoning and tool orchestration. Hands-on PyTorch, vector databases, and high-throughput Python API experience required.", 8.0, 4, "2026-11-15"),
        (3, "InnovateTech Global Solutions", "Associate Cloud & DevOps Engineer", "Full-time Placement", "₹14.5 - ₹18.0 LPA", "Hyderabad", "On-site", "Manage multi-region Kubernetes clusters, build automated CI/CD pipelines on AWS, and architect zero-trust cloud infrastructure for fortune 500 clients.", 7.0, 15, "2026-10-20"),
        (4, "ZeroDegree AI Labs", "Backend Systems Engineer (FastAPI/Rust)", "Full-time Placement", "₹16.0 - ₹22.0 LPA", "Bengaluru", "Hybrid", "Scale high-concurrency microservices processing 50M+ daily events. Deep knowledge of SQL optimization, asynchronous programming, and distributed caching is paramount.", 7.5, 8, "2026-11-01"),
        (3, "InnovateTech Global Solutions", "Data Science & Computer Vision Research Intern", "Internship", "₹40,000 / month", "Pune", "On-site", "Work alongside PhD research leads on industrial defect detection using vision transformers and edge deployment.", 8.0, 3, "2026-10-25")
    ]

    cursor.executemany("""
    INSERT INTO internships (recruiter_id, company_name, title, type, stipend, location, work_mode, description, min_cgpa, openings, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, internships)

    # Map required skills to Internships
    internship_skills = [
        (1, 1, 3, 80),   # Python
        (1, 6, 3, 75),   # FastAPI
        (1, 7, 2, 70),   # React
        (1, 3, 3, 60),   # LLMs
        (1, 12, 1, 60),  # Docker

        (2, 1, 3, 85),   # Python
        (2, 2, 3, 75),   # PyTorch
        (2, 3, 4, 75),   # LLMs
        (2, 4, 2, 60),   # MLOps

        (3, 12, 3, 80),  # Docker
        (3, 13, 3, 75),  # Kubernetes
        (3, 14, 3, 75),  # AWS
        (3, 15, 2, 70),  # CI/CD

        (4, 1, 3, 85),   # Python
        (4, 6, 3, 80),   # FastAPI
        (4, 9, 3, 80),   # SQL
        (4, 20, 2, 70),  # System Design
        (4, 16, 2, 65),  # Microservices

        (5, 1, 3, 80),   # Python
        (5, 5, 4, 80),   # Computer Vision
        (5, 2, 3, 70),   # PyTorch
    ]

    cursor.executemany("""
    INSERT INTO internship_skills (internship_id, skill_id, weight, min_proficiency)
    VALUES (?, ?, ?, ?);
    """, internship_skills)

    # Seed Sample Applications for Aarav Sharma
    cursor.execute("""
    INSERT INTO applications (internship_id, student_id, match_score, status, notes)
    VALUES 
    (1, 1, 88, 'Technical Assessment', 'Passed preliminary algorithmic screen. Online AI systems challenge scheduled.'),
    (4, 1, 91, 'Resume Shortlisted', 'Strong match in FastAPI and SQL optimization. TPO endorsed.'),
    (3, 1, 52, 'Applied', 'Candidate missing Kubernetes and AWS proficiency thresholds. Review in progress.');
    """)

    # Seed Curriculum Topics for Academia vs Industry alignment
    curriculum = [
        ("Computer Science & Engineering", 5, "CS501", "Database Management Systems", 9, 85, "Current", "Relational algebra and SQL covered; NoSQL and vector databases recommended for 2026 upgrade."),
        ("Computer Science & Engineering", 6, "CS602", "Cloud Computing & Distributed Systems", 12, 62, "Needs Update", "Syllabus focused on theoretical Grid Computing. Industry strongly recommends hands-on Docker, Kubernetes & AWS."),
        ("Computer Science & Engineering", 6, "CS604", "Artificial Intelligence & Expert Systems", 3, 50, "Obsolete", "Focuses on Prolog, Lisp & 1990s rule engines. Industry urgently requires Transformer architectures, LLMs & MLOps."),
        ("Computer Science & Engineering", 7, "CS701", "Web Technologies & Architecture", 6, 78, "Current", "HTML/CSS/JS with Node basics. Needs inclusion of modern FastAPI/Next.js frameworks."),
        ("Computer Science & Engineering", 5, "CS503", "Operating Systems & Concurrency", 17, 90, "Cutting-edge", "Strong Linux kernel, IPC, thread scheduling alignment."),
        ("Computer Science & Engineering", 7, "CS703", "Information Security & Cryptography", 19, 68, "Needs Update", "Traditional cryptography covered; Cloud security posture & OWASP Top 10 hands-on labs missing.")
    ]

    cursor.executemany("""
    INSERT INTO curriculum_topics (branch, semester, course_code, course_name, skill_id, industry_alignment_score, status, syllabus_gap_note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    """, curriculum)

    # Seed Industry Curriculum Feedback Loop
    curriculum_feedback = [
        (3, "Artificial Intelligence & Expert Systems (CS604)", "Transformer Models, Prompt Engineering & LLM APIs", "Over 80% of our enterprise projects currently leverage Foundation Models. Replacing legacy Lisp/Prolog with Python PyTorch & LangChain will triple student hiring rates.", 38, "Accepted by TPO"),
        (4, "Cloud Computing & Distributed Systems (CS602)", "Production Containerization with Docker & K8s", "Engineering hires spend their first 3 months learning container orchestration. Integrating mini-labs directly into semester coursework eliminates this retraining overhead.", 54, "Implemented in Syllabus"),
        (3, "Web Technologies & Architecture (CS701)", "Modern Full-Stack API Engineering (FastAPI + React)", "Industry has moved from monolithic PHP/JSP to decoupled headless APIs. High demand for students fluent in REST, OpenAPI, and state management.", 29, "Under Review")
    ]

    cursor.executemany("""
    INSERT INTO curriculum_feedback (recruiter_id, course_name, recommended_topic, industry_use_case, votes, status)
    VALUES (?, ?, ?, ?, ?, ?);
    """, curriculum_feedback)

    # Seed Live Industry Capstone Problem Statements
    capstones = [
        (3, "InnovateTech Global Solutions", "Enterprise AI Agent for Multi-lingual Contract Summarization", "Generative AI & LegalTech", "Build a privacy-preserving retrieval augmented generation (RAG) system supporting 10 Indian regional languages to summarize commercial agreements. Selected student teams will receive direct pre-placement interview offers.", "₹75,000 Grant + Cloud GPU Credits", 1, 2, "2026-11-20"),
        (4, "ZeroDegree AI Labs", "Zero-Latency IoT Edge Anomaly Detection for Manufacturing", "Edge Computing & TinyML", "Develop an ultra-compact C++/Python model running on Raspberry Pi / ESP32 to detect motor bearing micro-vibrations with 99.2% accuracy before catastrophic breakdown.", "₹1,00,000 Cash Prize + PPO", 1, 3, "2026-12-01"),
        (3, "InnovateTech Global Solutions", "Campus Decentralized Credential Verification System", "Web3 & Cyber Security", "Implement an interoperable verifiable credential (W3C standard) issuing verifiable digital diplomas and skill passports directly onto a consortium blockchain.", "₹50,000 Grant", 1, 2, "2026-11-10")
    ]

    cursor.executemany("""
    INSERT INTO capstones (recruiter_id, company_name, title, domain, problem_statement, grant_amount, mentorship_offered, max_teams, deadline)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    """, capstones)

    # Seed a Capstone Application for Aarav's team
    cursor.execute("""
    INSERT INTO capstone_applications (capstone_id, student_id, team_name, faculty_mentor, proposal_summary, status)
    VALUES 
    (1, 1, 'Team NeuralNexus', 'Dr. Rajesh Verma (HOD CSE)', 'Proposed hybrid vector search using FAISS and quantized LLaMA-3 Indian language adapter with bilingual OCR preprocessing for Indic scripts.', 'Approved by Industry');
    """)
    conn.commit()

def seed_wix_data(cursor, conn):
    # Seed Wix Site Exact Opportunities (matching https://vedhagariga896.wixsite.com/skillbridge/student-dashboard)
    cursor.execute("SELECT COUNT(*) FROM wix_opportunities;")
    if cursor.fetchone()[0] == 0:
        wix_opps = [
            ("Talent Acquisition", "careers@abctech.com", "Software Developer Intern", "ABC Technologies", "Software Engineering", "Bengaluru (Hybrid)", "Internship", "Python, REST API, Git", "Build and optimize full-stack microservices and API integrations.", 82),
            ("Hiring Team", "jobs@xyzsolutions.com", "Frontend Developer", "XYZ Solutions", "Web Applications", "Remote", "Full-time", "React, UI Design, Communication", "Develop interactive responsive dashboards using modern React components.", 78),
            ("Dr. Arvind Rao", "research@airesearchlabs.org", "Machine Learning Engineer", "AI Research Labs", "Artificial Intelligence", "Hyderabad", "Full-time", "Python, Machine Learning, Data Analysis", "Train, benchmark, and deploy deep learning architectures for multimodal vision and NLP tasks.", 91),
            ("DevOps Lead", "cloud@infrastructure.io", "DevOps Specialist Intern", "Cloud Infrastructure", "Cloud & SRE", "Pune (On-site)", "Internship", "Docker, Kubernetes, Linux", "Automate CI/CD pipelines, containerize microservices, and manage distributed cloud deployments.", 65)
        ]
        cursor.executemany("""
        INSERT INTO wix_opportunities (full_name, company_email, job_title, company_name, industry, location, job_type, required_skills, job_description, match_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        """, wix_opps)
        conn.commit()

    # Seed Wix Site Exact Applicants (matching https://vedhagariga896.wixsite.com/skillbridge/company-dashboard)
    cursor.execute("SELECT COUNT(*) FROM wix_applicants;")
    if cursor.fetchone()[0] == 0:
        wix_applicants = [
            ("Rahul Sharma", "Software Developer Intern", 82, "Shortlisted"),
            ("Arjun Kumar", "Frontend Developer", 76, "Shortlisted"),
            ("Sai Reddy", "DevOps Specialist Intern", 68, "Shortlisted"),
            ("Vikram Singh", "Machine Learning Engineer", 88, "Shortlisted")
        ]
        cursor.executemany("""
        INSERT INTO wix_applicants (name, applied_role, match_score, status)
        VALUES (?, ?, ?, ?);
        """, wix_applicants)
        conn.commit()

if __name__ == "__main__":
    init_db()
    seed_database()
