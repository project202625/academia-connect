/**
 * SkillBridge AI - Core Client Application Controller (SIH Winner Edition)
 * Handles user switching, interactive modals, AI resume parsing, skill quizzes, and simulation.
 */

window.SkillBridgeApp = {
  currentUser: null,
  usersList: [],
  currentPage: 'home',

  init: async function() {
    console.log("SkillBridge AI Initializing...");
    const savedTheme = localStorage.getItem('sb_theme') || 'default';
    this.setTheme(savedTheme, false);
    await this.loadUsers();
    this.setupEventListeners();

    // Check initial route
    const path = window.location.pathname.replace('/', '') || 'home';
    this.navigateTo(path, false);
  },

  navigateTo: function(pageName, pushState = true) {
    const validPages = ['home', 'student-dashboard', 'company-dashboard', 'college-dashboard'];
    if (!validPages.includes(pageName)) pageName = 'home';
    this.currentPage = pageName;

    // Update nav button active classes
    ['home', 'student', 'company', 'college'].forEach(p => {
      const btn = document.getElementById(`nav-${p}`);
      if (btn) {
        if (p === 'home' && pageName === 'home') {
          btn.className = "px-3.5 py-2 rounded-xl transition text-indigo-600 bg-indigo-50 font-black";
        } else if (`${p}-dashboard` === pageName) {
          btn.className = "px-3.5 py-2 rounded-xl transition text-indigo-600 bg-indigo-50 font-black";
        } else {
          btn.className = "px-3.5 py-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition font-bold";
        }
      }
    });

    const container = document.getElementById('view-container');
    if (!container) return;

    if (pageName === 'home') {
      WixViews.renderHome(container);
    } else if (pageName === 'student-dashboard') {
      WixViews.renderStudentDashboard(container);
    } else if (pageName === 'company-dashboard') {
      WixViews.renderCompanyDashboard(container);
    } else if (pageName === 'college-dashboard') {
      WixViews.renderCollegeDashboard(container);
    }

    if (pushState && window.history) {
      const newUrl = pageName === 'home' ? '/' : `/${pageName}`;
      window.history.pushState({ page: pageName }, '', newUrl);
    }
  },

  setTheme: function(themeName, showToast = true) {
    document.body.classList.remove('theme-pearl', 'theme-warm', 'theme-dark');
    if (themeName !== 'default') {
      document.body.classList.add(`theme-${themeName}`);
    }
    localStorage.setItem('sb_theme', themeName);
    if (showToast) {
      const names = { default: 'Realistic Canvas', pearl: 'Clean Pearl White', warm: 'Warm Editorial', dark: 'Executive Dark Slate' };
      this.showToast(`Background set to ${names[themeName] || themeName}`, 'info');
    }
  },

  loadUsers: async function() {
    const fallbackUsers = [
      { id: "stu_001", name: "Aarav Sharma", role: "student", major: "Computer Science", college: "IIT Bombay" },
      { id: "stu_002", name: "Priya Patel", role: "student", major: "Data Science", college: "NIT Trichy" },
      { id: "rec_001", name: "Vikram Malhotra", role: "recruiter", company: "Infosys NextGen" },
      { id: "tpo_001", name: "Dr. Sunita Rao", role: "tpo", college: "IIT Bombay" },
      { id: "gov_001", name: "SIH Evaluator Panel", role: "admin", department: "Ministry of Education" }
    ];

    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        this.usersList = data.users || fallbackUsers;
      } else {
        this.usersList = fallbackUsers;
      }
    } catch (err) {
      this.usersList = fallbackUsers;
    }

    // Default to first user (Aarav Sharma - Student)
    this.currentUser = this.usersList[0];

    const select = document.getElementById('persona-select');
    if (select) {
      select.value = this.currentUser.id;
    }
  },

  switchUser: function(userId) {
    const selected = this.usersList.find(u => u.id == userId);
    if (!selected) return;
    this.currentUser = selected;
    this.showToast(`Switched active persona to ${selected.name} (${selected.role.toUpperCase()})`, "info");
    this.renderCurrentView();
  },

  renderCurrentView: function() {
    const container = document.getElementById('view-container');
    if (!container || !this.currentUser) return;

    // Update role badge in header
    const roleBadge = document.getElementById('active-role-badge');
    if (roleBadge) {
      roleBadge.textContent = this.currentUser.role.toUpperCase();
      roleBadge.className = `px-3 py-1 rounded-full text-xs font-black ${
        this.currentUser.role === 'student' ? 'bg-indigo-100 text-indigo-700' :
        this.currentUser.role === 'recruiter' ? 'bg-amber-100 text-amber-800' :
        this.currentUser.role === 'tpo' ? 'bg-emerald-100 text-emerald-800' :
        'bg-violet-100 text-violet-800'
      }`;
    }

    if (this.currentUser.role === 'student') {
      PortalViews.renderStudent(container, this.currentUser);
    } else if (this.currentUser.role === 'recruiter') {
      PortalViews.renderRecruiter(container, this.currentUser);
    } else if (this.currentUser.role === 'tpo') {
      PortalViews.renderTpo(container, this.currentUser);
    } else if (this.currentUser.role === 'admin') {
      PortalViews.renderAdmin(container, this.currentUser);
    }
  },

  // Interactive Live Skill Simulator (Slider Dragging)
  simulateSkill: async function(studentId, skillId, value, labelId) {
    const label = document.getElementById(labelId);
    if (label) label.textContent = `${value}%`;

    try {
      await fetch(`/api/students/${studentId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: skillId, proficiency: parseInt(value) })
      });

      // Fetch updated gap analysis
      const res = await fetch(`/api/students/${studentId}/gap-analysis`);
      const gapData = await res.json();

      // Live update radar chart
      SkillCharts.renderSkillRadar(
        'skill-radar-canvas',
        gapData.radar.labels,
        gapData.radar.student_scores,
        gapData.radar.benchmark_scores,
        gapData.target_role
      );

      // Live update gauge
      SkillCharts.renderEmployabilityGauge('employability-gauge', gapData.employability_score);

      // Update score text
      const scoreLabel = document.getElementById('employability-score-label');
      if (scoreLabel) scoreLabel.textContent = `${gapData.employability_score}%`;
    } catch (err) {
      console.error(err);
    }
  },

  resetSimulation: async function(studentId) {
    try {
      await fetch(`/api/students/${studentId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: 3, proficiency: 40 })
      });
      await fetch(`/api/students/${studentId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: 12, proficiency: 65 })
      });
      await fetch(`/api/students/${studentId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: 13, proficiency: 25 })
      });

      this.showToast("Simulation reset to base student profile", "info");
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
    }
  },

  // AI Resume Scanner Modal
  openResumeParserModal: function() {
    const studentId = this.currentUser ? this.currentUser.student_id || 1 : 1;
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    const sampleResume = `Aarav Sharma - B.Tech CSE (NIT Karnataka)
Passionate developer experienced in building scalable microservices and AI pipelines.
TECHNICAL SKILLS:
Languages: Python, JavaScript, TypeScript, SQL, C++
Frameworks & Libraries: FastAPI, Flask, React.js, Next.js, PyTorch, LangChain, Transformers, Node.js
Cloud & DevOps: Docker containerization, Kubernetes pods, AWS Lambda, S3, GitHub Actions CI/CD
Databases: PostgreSQL, MySQL, Redis, Vector Databases (Pinecone, ChromaDB)
Projects:
1. Multi-tenant Enterprise RAG Copilot with LLaMA-3, FastAPI, Docker, and React.js
2. Distributed In-Memory Cache with asynchronous replication and Raft consensus in Python`;

    content.innerHTML = `
      <div class="relative bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border border-slate-200">
        <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <i data-lucide="sparkles" class="w-5 h-5"></i>
          </div>
          <div>
            <h3 class="text-xl font-black text-slate-900">AI Resume Scanner & Skill Extractor</h3>
            <p class="text-xs text-slate-500">Extracts tech competencies and automatically populates your verified skill matrix.</p>
          </div>
        </div>

        <div class="mt-4 mb-4">
          <label class="block text-xs font-bold text-slate-700 mb-1.5">Paste Resume Text or Coursework Summary:</label>
          <textarea id="resume-text-input" rows="8" class="w-full text-xs font-mono p-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 bg-slate-50 leading-relaxed">${sampleResume}</textarea>
        </div>

        <div id="resume-results-box" class="hidden mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs"></div>

        <div class="flex items-center justify-end gap-3">
          <button onclick="SkillBridgeApp.closeModal()" class="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700">Cancel</button>
          <button id="resume-scan-btn" onclick="SkillBridgeApp.submitResumeScan(${studentId})" class="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-2">
            <i data-lucide="scan" class="w-4 h-4"></i> Run AI Extraction →
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
  },

  submitResumeScan: async function(studentId) {
    const text = document.getElementById('resume-text-input').value;
    const btn = document.getElementById('resume-scan-btn');
    const resultBox = document.getElementById('resume-results-box');

    btn.disabled = true;
    btn.innerHTML = `<i class="animate-spin w-4 h-4 mr-1" data-lucide="loader-2"></i> Analyzing text...`;
    lucide.createIcons();

    try {
      const res = await fetch('/api/ai/parse-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, resume_text: text })
      });

      const data = await res.json();
      resultBox.classList.remove('hidden');
      resultBox.innerHTML = `
        <div class="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
          <i data-lucide="check-circle" class="w-4 h-4 text-emerald-600"></i> ${data.message}
        </div>
        <div class="flex flex-wrap gap-1.5 mt-2">
          ${data.detected_skills.map(s => `
            <span class="px-2 py-0.5 rounded-md bg-white border border-emerald-300 font-bold text-emerald-800 text-[11px]">
              ${s.skill_name} (${s.assigned_proficiency}%)
            </span>
          `).join('')}
        </div>
      `;
      lucide.createIcons();

      this.showToast(`Extracted ${data.extracted_skills_count} verified skills from resume!`, 'success');
      setTimeout(() => {
        this.closeModal();
        this.renderCurrentView();
      }, 2500);

    } catch (err) {
      console.error(err);
      this.showToast("Failed to parse resume", "error");
    } finally {
      btn.disabled = false;
    }
  },

  // Interactive 3-Question Skill Quiz Modal
  openQuizModal: async function(skillId) {
    const studentId = this.currentUser ? this.currentUser.student_id || 1 : 1;
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    try {
      const res = await fetch(`/api/assessment/${skillId}`);
      const data = await res.json();

      content.innerHTML = `
        <div class="relative bg-white rounded-3xl p-8 max-w-xl w-full mx-4 shadow-2xl border border-slate-200">
          <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>

          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <i data-lucide="award" class="w-5 h-5"></i>
            </div>
            <div>
              <span class="text-[10px] font-black uppercase text-amber-600 tracking-wider">AICTE Verified Credential Challenge</span>
              <h3 class="text-xl font-black text-slate-900">${data.skill_name} Assessment</h3>
            </div>
          </div>

          <p class="text-xs text-slate-500 mb-6">Answer the 3 technical questions below correctly (≥66%) to instantly earn a <strong>Verified Gold Skill Badge</strong> on your Skill Passport.</p>

          <form id="skill-quiz-form" onsubmit="SkillBridgeApp.submitQuiz(event, ${studentId}, ${skillId})" class="space-y-6">
            ${data.questions.map((q, idx) => `
              <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <p class="font-bold text-xs text-slate-900 mb-3">Q${idx + 1}. ${q.question}</p>
                <div class="space-y-2">
                  ${q.options.map((opt, optIdx) => `
                    <label class="flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 cursor-pointer text-xs transition">
                      <input type="radio" name="q_${q.id}" value="${optIdx}" required class="mt-0.5 accent-indigo-600">
                      <span class="text-slate-700 font-medium">${opt}</span>
                    </label>
                  `).join('')}
                </div>
              </div>
            `).join('')}

            <button type="submit" class="w-full py-3 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition">
              Submit Answers & Verify Badge →
            </button>
          </form>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load skill assessment", "error");
    }
  },

  submitQuiz: async function(event, studentId, skillId) {
    event.preventDefault();
    const form = document.getElementById('skill-quiz-form');
    const formData = new FormData(form);
    const answers = {};

    for (let [key, val] of formData.entries()) {
      if (key.startsWith('q_')) {
        answers[key.replace('q_', '')] = parseInt(val);
      }
    }

    try {
      const res = await fetch('/api/assessment/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId, skill_id: skillId, answers: answers })
      });

      const data = await res.json();
      if (data.passed) {
        this.showToast(`🏆 Score: ${data.score_pct}%! Gold Skill Badge Awarded!`, 'success');
        this.closeModal();
        this.openPassportModal(studentId);
      } else {
        this.showToast(`Score: ${data.score_pct}%. Review study materials and try again!`, 'warning');
        this.closeModal();
      }
    } catch (err) {
      console.error(err);
      this.showToast("Failed to submit assessment", "error");
    }
  },

  // Curriculum Before vs After Diff Modal
  openCurriculumDiffModal: async function() {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    try {
      const res = await fetch('/api/curriculum/modernizer');
      const data = await res.json();

      content.innerHTML = `
        <div class="relative bg-white rounded-3xl p-8 max-w-4xl w-full mx-4 shadow-2xl border border-slate-200">
          <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>

          <div class="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <i data-lucide="git-compare" class="w-5 h-5"></i>
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900">Academic Curriculum Modernization Engine</h3>
                <p class="text-xs text-slate-500">Direct comparison of Legacy University Syllabus vs Industry 4.0 AICTE NEP-2026 Model</p>
              </div>
            </div>
            <button onclick="window.print()" class="px-3.5 py-1.5 rounded-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 text-slate-700">
              Export Proposal PDF 📄
            </button>
          </div>

          <div class="space-y-6">
            ${data.comparisons.map(item => `
              <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                <div class="flex items-center justify-between mb-4">
                  <span class="font-mono font-bold text-xs bg-slate-200 text-slate-800 px-2.5 py-1 rounded-lg">${item.course_code} • ${item.semester}</span>
                  <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                    ${item.placement_readiness_boost}
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <!-- Legacy -->
                  <div class="p-4 rounded-xl bg-red-50/60 border border-red-200">
                    <span class="text-[10px] font-black uppercase tracking-wider text-red-700 block mb-1">OUTDATED / LEGACY (2018)</span>
                    <h4 class="font-bold text-xs text-slate-900 mb-2">${item.legacy_title}</h4>
                    <ul class="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                      ${item.legacy_syllabus.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>

                  <!-- Modern -->
                  <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
                    <span class="text-[10px] font-black uppercase tracking-wider text-emerald-700 block mb-1">INDUSTRY 4.0 RECOMMENDED (NEP-2026)</span>
                    <h4 class="font-bold text-xs text-slate-900 mb-2">${item.modern_title}</h4>
                    <ul class="text-[11px] text-slate-700 space-y-1 list-disc list-inside font-medium">
                      ${item.modern_syllabus.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                  </div>
                </div>

                <div class="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                  <strong class="text-slate-800">Industry Justification:</strong> ${item.industry_justification}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load curriculum modernizer", "error");
    }
  },

  // TPO: Dispatch Intervention
  dispatchIntervention: function(studentName) {
    this.showToast(`✉️ Fast-track remediation roadmap dispatched to ${studentName} & Faculty Advisor!`, "success");
  },

  // Interactive Student Role Switcher for Radar
  changeStudentRole: async function(studentId, targetRole) {
    this.showToast(`Recalculating skill gaps against ${targetRole}...`, 'info');

    try {
      const res = await fetch(`/api/students/${studentId}/gap-analysis?target_role=${encodeURIComponent(targetRole)}`);
      const gapData = await res.json();

      // Redraw radar chart
      SkillCharts.renderSkillRadar(
        'skill-radar-canvas',
        gapData.radar.labels,
        gapData.radar.student_scores,
        gapData.radar.benchmark_scores,
        gapData.target_role
      );

      // Redraw gauge
      SkillCharts.renderEmployabilityGauge('employability-gauge', gapData.employability_score);

      // Update score label
      const scoreLabel = document.getElementById('employability-score-label');
      if (scoreLabel) scoreLabel.textContent = `${gapData.employability_score}%`;

      this.showToast(`Radar updated for ${targetRole}`, 'success');
    } catch (err) {
      console.error(err);
      this.showToast("Failed to recalculate benchmark", "error");
    }
  },

  // 1-Click Internship Apply
  applyForInternship: async function(jobId, studentId, title, matchScore) {
    try {
      const res = await fetch('/api/internships/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          internship_id: jobId,
          student_id: studentId,
          notes: `Applied with ${matchScore}% AI verified skill compatibility.`
        })
      });

      const data = await res.json();
      if (!res.ok) {
        this.showToast(data.detail || "Application failed", "warning");
        return;
      }

      this.showToast(`🎉 Applied to ${title}! AI Match Score: ${matchScore}%`, "success");
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
      this.showToast("Network error submitting application", "error");
    }
  },

  // Bridge Roadmap Completion Simulation
  completeSkillModule: async function(studentId, skillId, skillName) {
    try {
      await fetch(`/api/students/${studentId}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skill_id: skillId, proficiency: 85 })
      });

      this.showToast(`🎯 Completed hands-on project in ${skillName}! Proficiency updated to 85%.`, "success");
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
      this.showToast("Error updating skill status", "error");
    }
  },

  // Recruiter: Update applicant status
  updateApplicantStatus: async function(appId, newStatus) {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      this.showToast(data.message || `Status updated to ${newStatus}`, "success");
    } catch (err) {
      console.error(err);
      this.showToast("Error updating status", "error");
    }
  },

  // Recruiter: Submit curriculum feedback
  submitCurriculumFeedback: async function(event, recruiterId) {
    event.preventDefault();
    const course = document.getElementById('feedback-course').value;
    const topic = document.getElementById('feedback-topic').value;
    const usecase = document.getElementById('feedback-usecase').value;

    try {
      const res = await fetch('/api/curriculum/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiter_id: recruiterId,
          course_name: course,
          recommended_topic: topic,
          industry_use_case: usecase
        })
      });

      const data = await res.json();
      this.showToast("Recommendation transmitted to TPO Board!", "success");
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
      this.showToast("Failed to submit feedback", "error");
    }
  },

  // Upvote curriculum suggestion
  voteCurriculum: async function(feedbackId) {
    try {
      await fetch(`/api/curriculum/feedback/${feedbackId}/vote`, { method: 'POST' });
      this.showToast("Upvoted! Industry weight increased.", "success");
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
    }
  },

  // Digital Skill Passport Modal
  openPassportModal: async function(studentId) {
    try {
      const res = await fetch(`/api/students/${studentId}/passport`);
      const data = await res.json();

      const modal = document.getElementById('modal-container');
      const content = document.getElementById('modal-content');

      content.innerHTML = `
        <div class="relative bg-white rounded-3xl p-8 max-w-2xl w-full mx-4 shadow-2xl border-4 border-indigo-600/20">
          <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
            <i data-lucide="x" class="w-6 h-6"></i>
          </button>

          <!-- Passport Header -->
          <div class="text-center border-b border-slate-100 pb-6 mb-6">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-full text-xs font-black mb-3">
              <i data-lucide="shield-check" class="w-4 h-4 text-indigo-600"></i> AICTE & NEP-2020 DIGITAL CREDENTIAL
            </div>
            <h2 class="text-2xl font-black text-slate-900 tracking-tight">Verified Digital Skill Passport</h2>
            <p class="text-xs text-slate-500 font-medium">Interoperable Competency Record & Placement Transcript</p>
          </div>

          <!-- Student Profile & Hash ID -->
          <div class="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6">
            <div class="flex items-center gap-4">
              <img src="${data.student.avatar}" class="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-600">
              <div>
                <h3 class="font-black text-base text-slate-900">${data.student.name}</h3>
                <p class="text-xs text-slate-500">${data.student.college} • ${data.student.branch}</p>
                <div class="text-[11px] font-mono text-indigo-700 font-bold mt-0.5">Roll No: ${data.student.roll_no} • CGPA: ${data.student.cgpa}</div>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] text-slate-400 font-bold block">VERIFICATION ID</span>
              <span class="text-xs font-mono font-black text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-300">${data.passport_id}</span>
            </div>
          </div>

          <!-- Verified Badges -->
          <div class="mb-6">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <i data-lucide="award" class="w-4 h-4 text-amber-500"></i> Industry & TPO Endorsed Skill Badges
            </h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${data.verified_badges.map(b => `
                <div class="p-3 bg-white rounded-xl border border-emerald-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span class="font-bold text-xs text-slate-900">${b.skill_name}</span>
                    <div class="text-[10px] text-slate-500">${b.badge_name}</div>
                  </div>
                  <span class="px-2 py-1 rounded bg-emerald-50 text-emerald-700 font-extrabold text-xs">
                    ${b.proficiency}%
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Verification Seal & QR -->
          <div class="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <i data-lucide="badge-check" class="w-10 h-10 text-emerald-600"></i>
              <div>
                <div class="text-xs font-bold text-emerald-950">${data.verification_status}</div>
                <div class="text-[10px] text-emerald-700">Cryptographically signed with SHA-256 verifiable hash.</div>
              </div>
            </div>
            <button onclick="window.print()" class="px-3.5 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-bold hover:bg-emerald-50 transition">
              Download PDF 📄
            </button>
          </div>
        </div>
      `;

      modal.classList.remove('hidden');
      modal.classList.add('flex');
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      this.showToast("Failed to load skill passport", "error");
    }
  },

  // Recruiter: Post Job Modal
  openPostJobModal: function(recruiterId) {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
      <div class="relative bg-white rounded-3xl p-8 max-w-xl w-full mx-4 shadow-2xl border border-slate-200">
        <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <h3 class="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <i data-lucide="briefcase" class="w-5 h-5 text-indigo-600"></i> Post New Internship / Job Opening
        </h3>
        <p class="text-xs text-slate-500 mb-6">Positions will be automatically matched to qualified students based on skill vectors.</p>

        <form onsubmit="SkillBridgeApp.submitNewJob(event, ${recruiterId})" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
            <input id="newjob-company" type="text" value="${this.currentUser.organization}" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Job / Internship Title</label>
              <input id="newjob-title" type="text" placeholder="e.g. AI Systems Engineer Intern" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Engagement Type</label>
              <select id="newjob-type" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
                <option value="Internship">Internship</option>
                <option value="Full-time Placement">Full-time Placement</option>
                <option value="Co-op">Co-op / Semester Project</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Stipend / CTC</label>
              <input id="newjob-stipend" type="text" placeholder="e.g. ₹50,000 / month" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Work Mode</label>
              <select id="newjob-mode" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Location / City</label>
            <input id="newjob-location" type="text" placeholder="e.g. Bengaluru / Pan-India" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Description & Role Requirements</label>
            <textarea id="newjob-desc" rows="3" placeholder="Key responsibilities, stack requirements, and learning opportunities..." required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>

          <button type="submit" class="w-full py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition">
            Publish Opening to Campus Network →
          </button>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
  },

  submitNewJob: async function(event, recruiterId) {
    event.preventDefault();
    const payload = {
      recruiter_id: recruiterId,
      company_name: document.getElementById('newjob-company').value,
      title: document.getElementById('newjob-title').value,
      type: document.getElementById('newjob-type').value,
      stipend: document.getElementById('newjob-stipend').value,
      location: document.getElementById('newjob-location').value,
      work_mode: document.getElementById('newjob-mode').value,
      description: document.getElementById('newjob-desc').value,
      min_cgpa: 7.5,
      openings: 5,
      deadline: "2026-11-30",
      skill_ids: [1, 6, 7]
    };

    try {
      const res = await fetch('/api/internships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      this.showToast(data.message || "Opening published successfully!", "success");
      this.closeModal();
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
      this.showToast("Failed to post opening", "error");
    }
  },

  // Recruiter: Post Capstone Modal
  openPostCapstoneModal: function(recruiterId) {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
      <div class="relative bg-white rounded-3xl p-8 max-w-xl w-full mx-4 shadow-2xl border border-slate-200">
        <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-slate-600">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <h3 class="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
          <i data-lucide="code-2" class="w-5 h-5 text-indigo-600"></i> Sponsor Industry Capstone Problem
        </h3>
        <p class="text-xs text-slate-500 mb-6">Submit real-world engineering challenges for student teams to solve for credit & PPOs.</p>

        <form onsubmit="SkillBridgeApp.submitNewCapstone(event, ${recruiterId})" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Challenge Title</label>
            <input id="cap-title" type="text" placeholder="e.g. Distributed Consensus Engine for Edge IoT" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Domain</label>
              <input id="cap-domain" type="text" placeholder="e.g. Systems & Edge Computing" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Grant / Prize Amount</label>
              <input id="cap-grant" type="text" placeholder="e.g. ₹75,000 + Cloud Credits" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1">Problem Statement Details</label>
            <textarea id="cap-desc" rows="3" placeholder="Describe the technical problem, expected deliverables, and test criteria..." required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>

          <button type="submit" class="w-full py-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition">
            Publish Problem Statement to Colleges →
          </button>
        </form>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
  },

  submitNewCapstone: async function(event, recruiterId) {
    event.preventDefault();
    const payload = {
      recruiter_id: recruiterId,
      company_name: this.currentUser.organization,
      title: document.getElementById('cap-title').value,
      domain: document.getElementById('cap-domain').value,
      problem_statement: document.getElementById('cap-desc').value,
      grant_amount: document.getElementById('cap-grant').value,
      deadline: "2026-12-15"
    };

    try {
      const res = await fetch('/api/capstones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      this.showToast(data.message || "Capstone challenge published!", "success");
      this.closeModal();
      this.renderCurrentView();
    } catch (err) {
      console.error(err);
      this.showToast("Failed to sponsor capstone", "error");
    }
  },

  closeModal: function() {
    const modal = document.getElementById('modal-container');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  },

  showToast: function(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    let colorClass = 'bg-slate-900 text-white';
    if (type === 'success') colorClass = 'bg-emerald-600 text-white';
    else if (type === 'warning') colorClass = 'bg-amber-600 text-white';
    else if (type === 'error') colorClass = 'bg-red-600 text-white';

    toast.className = `p-3.5 px-4 rounded-2xl text-xs font-bold shadow-2xl transition-all duration-300 flex items-center gap-2 transform translate-y-2 opacity-0 ${colorClass}`;
    toast.innerHTML = `<span>${message}</span>`;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  setupEventListeners: function() {
    window.addEventListener('popstate', () => {
      const path = window.location.pathname.replace('/', '') || 'home';
      this.navigateTo(path, false);
    });

    const userSwitcher = document.getElementById('global-user-switcher');
    if (userSwitcher) {
      userSwitcher.addEventListener('change', (e) => {
        this.switchUser(e.target.value);
      });
    }

    const modal = document.getElementById('modal-container');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) this.closeModal();
      });
    }
  }
};

// Bootstrap on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  SkillBridgeApp.init();
});
