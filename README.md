# 🎓 SkillBridge AI
### Portal for Academia - Industry Collaboration for Skill Mapping, Internships and Placement
**Smart India Hackathon (SIH) Solution**

SkillBridge AI is a unified, intelligent web platform engineered to bridge the critical gap between academic university curricula and dynamic industry tech demands. It connects **Students**, **Industry Recruiters**, **College TPO / Faculty**, and **National AICTE Administrators** into a single cohesive ecosystem.

---

## 🌟 Key Pillars & Features

### 1. 👨‍🎓 For Students
- **AI Skill Gap Radar & Mapping**: Select any target industry role (e.g. *Full Stack AI Developer*, *AI/ML Engineer*, *Cloud & DevOps Specialist*), visualize competency radar charts against real-time industry benchmarks, and view your calculated **Employability Readiness Index (0-100%)**.
- **Actionable Personalized Skill Roadmaps**: Highlights critical missing skills and provides step-by-step curated bridge courses, estimated study hours, and practical capstone project ideas.
- **AI-Ranked Internship & Job Marketplace**: Internships scored with dynamic compatibility match percentages (`88% AI Match`). 1-click application submission.
- **Application Pipeline Tracker**: Live status tracking across recruitment stages (`Applied` $\rightarrow$ `Resume Shortlisted` $\rightarrow$ `Technical Assessment` $\rightarrow$ `Interview Scheduled` $\rightarrow$ `Offered`).
- **Verifiable Digital Skill Passport**: Cryptographically verifiable credential with tamper-evident SHA-256 ID, endorsed skill badges, and PDF export.

### 2. 🏢 For Industry Recruiters & Corporate Partners
- **Targeted Talent Pipeline Filter**: Search candidate talent pools filtered by verified skill proficiencies and AI match scores.
- **Internship & Placement Posting**: Publish openings with weighted skill requirements, stipend, location, and minimum CGPA criteria.
- **Applicant Evaluation Pipeline**: Review applicant profiles, GitHub links, and CGPA, and advance candidate stages with instant status updates.
- **Curriculum Skill Demand Telemetry**: Propose syllabus updates directly to academic boards with industry business justifications and vote on corporate recommendations.
- **Sponsor Real-World Capstone Problem Statements**: Post live engineering challenges with grants and PPO incentives.

### 3. 🏛️ For College Faculty & TPOs (Training & Placement Officers)
- **Institutional Placement Analytics**: Live metrics on student enrollment, placement percentage, average/highest CTC, and active corporate MoUs.
- **Branch-Wise Readiness Heatmap**: Benchmarks skill readiness vs placement success across CSE, IT, ECE, AI, and Mechanical branches.
- **Academic Curriculum Industry 4.0 Audit**: Scans syllabus course codes, flags outdated topics (e.g., legacy rule engines vs modern LLM transformers), and assigns industry alignment scores.
- **Corporate MoU Tracker**: Manage institutional ties with prime hiring partners and incubation labs.

### 4. 🇮🇳 For AICTE / National Education Administrators
- **Macro Employability Index**: Nationwide monitoring of engineering graduate readiness.
- **Emerging Skill Demand Forecast**: Telemetry on fastest-growing hiring demands across Indian tech sectors.
- **Tier 1 vs Tier 2/3 College Readiness Benchmarking**: Actionable data to guide NEP-2020 skill integration policies.

---

## 🚀 Quick Start & How to Run

### Requirements
- **Python 3.10+** (Python 3.13 tested)
- No Node.js or npm required! Everything runs with Python and client CDN libraries.

### Launching the Application
Open a terminal in this directory and execute:

```bash
py run.py
```
Or on Windows, simply double-click:
```bat
run.bat
```

The server starts at `http://127.0.0.1:8000` and automatically opens your default web browser.

---

## 🧭 Live Persona Switcher (For Hackathon Evaluators)
At the top-right of the navigation bar, use the **Active Role** dropdown to switch between:
1. **👨‍🎓 Aarav Sharma (Student - B.Tech CSE)**: Explore the AI radar chart, bridge roadmaps, matched jobs, and digital passport.
2. **🏢 Priya Nair (Industry Recruiter - InnovateTech)**: Manage applicants, post openings, and submit curriculum feedback.
3. **🏛️ Dr. Rajesh Verma (TPO / Dean - NIT Karnataka)**: Review institutional placement analytics, department readiness, and syllabus audit.
4. **🇮🇳 Prof. K. Sundaram (AICTE Admin)**: View national employability index and emerging skill forecasts.

---

## 🛠️ Architecture & Tech Stack

- **Backend**: FastAPI (Python 3.13) with asynchronous RESTful API architecture.
- **Database**: SQLite 3 with pre-seeded data tailored for Indian engineering colleges and tech recruiters.
- **Frontend**: Responsive Single-Page Application (SPA) styled with Tailwind CSS, Lucide Icons, and custom glassmorphism.
- **Data Visualization**: Chart.js Radar Charts, Doughnut Gauges, and Bar Analytics.
- **Digital Credentials**: Tamper-evident SHA-256 verification hash IDs aligned with W3C verifiable credentials concept.
