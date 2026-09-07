/**
 * SkillBridge AI - Wix Views Renderer (Dark Mode Edition)
 * Portal for Academia - Industry Collaboration for Skill Mapping, Internships & Placement
 * All views are fully dark-mode styled, work offline with fallback data.
 */

window.WixViews = {
  // Mock fallback data for static/serverless deployments
  fallbackStudentData: {
    profile: {
      name: "Aarav Sharma",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      major: "B.Tech Computer Science (3rd Year)",
      roll_no: "21CS042",
      college: "IIT Bombay",
      cgpa: "8.74",
      passport_id: "SP-4BB387CBA1BB",
      profile_completion: 88,
      employability_score: 84
    },
    skills: [
      { id: 1, name: "Python & Data Structures", proficiency: 85, category: "Core", verified: true, level: "Advanced" },
      { id: 2, name: "React & Modern Web UI", proficiency: 75, category: "Frontend", verified: true, level: "Proficient" },
      { id: 3, name: "REST API & FastAPI", proficiency: 60, category: "Backend", verified: false, level: "Intermediate" },
      { id: 4, name: "Docker & Cloud Deploy", proficiency: 35, category: "DevOps", verified: false, level: "Novice" },
      { id: 5, name: "SQL & PostgreSQL", proficiency: 80, category: "Database", verified: true, level: "Advanced" },
      { id: 6, name: "Machine Learning & PyTorch", proficiency: 45, category: "AI/ML", verified: false, level: "Intermediate" }
    ],
    skill_gaps: [
      { skill: "Python & Data Structures", student_score: 85, required_score: 80, status: "Available", gap: 0 },
      { skill: "React & Modern Web UI", student_score: 75, required_score: 70, status: "Available", gap: 0 },
      { skill: "REST API & FastAPI", student_score: 60, required_score: 85, status: "Missing", gap: -25 },
      { skill: "Docker & Cloud Deploy", student_score: 35, required_score: 75, status: "Missing", gap: -40 }
    ],
    learning_path: [
      { platform: "Coursera", title: "FastAPI & Microservices Architecture", skill: "REST API & FastAPI", est_time: "4 Weeks", difficulty: "Intermediate", link: "https://coursera.org" },
      { platform: "edX", title: "Docker & Cloud Native Essentials", skill: "Docker & Cloud Deploy", est_time: "3 Weeks", difficulty: "Beginner", link: "https://edx.org" },
      { platform: "NPTEL", title: "Advanced Distributed Systems & Scalability", skill: "System Architecture", est_time: "6 Weeks", difficulty: "Advanced", link: "https://nptel.ac.in" }
    ],
    opportunities: [
      { id: 1, job_title: "Full Stack Developer Intern", company_name: "Infosys NextGen", location: "Bengaluru (Hybrid)", stipend: "₹35,000 / month", required_skills: "Python, FastAPI, React", match_score: 92, applied: false },
      { id: 2, job_title: "AI / ML Research Intern", company_name: "Tata Consultancy Services", location: "Hyderabad", stipend: "₹30,000 / month", required_skills: "Python, PyTorch, SQL", match_score: 84, applied: false },
      { id: 3, job_title: "Cloud DevOps Associate", company_name: "Wipro Technologies", location: "Pune (Remote)", stipend: "₹28,000 / month", required_skills: "Docker, Kubernetes, CI/CD", match_score: 72, applied: false }
    ]
  },

  fallbackCompanyData: {
    applicants: [
      { id: 1, name: "Aarav Sharma", applied_role: "Full Stack Developer Intern", match_score: 92, status: "Shortlisted", college: "IIT Bombay", gpa: "8.74" },
      { id: 2, name: "Priya Patel", applied_role: "AI / ML Research Intern", match_score: 88, status: "In Review", college: "NIT Trichy", gpa: "8.90" },
      { id: 3, name: "Rohan Verma", applied_role: "Backend Engineer", match_score: 81, status: "Under Review", college: "BITS Pilani", gpa: "8.45" },
      { id: 4, name: "Ananya Iyer", applied_role: "Data Analyst Intern", match_score: 76, status: "Under Review", college: "DTU Delhi", gpa: "8.12" }
    ]
  },

  fallbackCollegeData: {
    metrics: {
      students_assessed: "1,248",
      placement_ready: "78%",
      top_skill_gap: "Cloud / DevOps",
      internship_matches: "342"
    },
    skill_gaps: [
      { skill: "Cloud Native & DevOps (Docker, Kubernetes)", students_affected: 412, percentage: 68, description: "Industry demand is high for containerization, but curriculum is focused on monolithic architecture." },
      { skill: "FastAPI & Microservices Architecture", students_affected: 340, percentage: 54, description: "Students require hands-on experience building asynchronous REST APIs." },
      { skill: "System Design & Distributed Systems", students_affected: 290, percentage: 46, description: "Crucial for tier-1 tech company recruitment rounds." }
    ]
  },

  // 1. HOME / LANDING PAGE
  renderHome: function(container) {
    container.innerHTML = `
      <!-- Hero Section -->
      <div class="rounded-3xl p-8 md:p-14 mb-10 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-indigo-900/50 text-center relative overflow-hidden shadow-2xl">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.15),_transparent_70%)]"></div>
        <div class="max-w-3xl mx-auto relative">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 mb-6">
            🎓 ACADEMIA - INDUSTRY PLATFORM
          </span>
          <h1 class="text-3xl md:text-5xl font-display font-black text-white tracking-tight leading-tight mb-4">
            Connecting Students, Colleges &amp; Industry Through Skills
          </h1>
          <p class="text-base md:text-lg text-slate-300 font-medium leading-relaxed mb-8">
            Empowering the next generation of talent by bridging the gap between academic potential and industry demand.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <button onclick="SkillBridgeApp.navigateTo('student-dashboard')" class="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/50 transition">
              Explore Student Portal →
            </button>
            <button onclick="SkillBridgeApp.navigateTo('company-dashboard')" class="px-6 py-3 rounded-2xl border border-slate-600 hover:border-slate-400 hover:bg-slate-800 text-slate-300 font-bold text-sm transition">
              Post an Opportunity
            </button>
          </div>
        </div>
      </div>

      <!-- Our Mission -->
      <div class="rounded-3xl p-8 mb-10 bg-[#0f172a] border border-slate-800">
        <div class="max-w-3xl mx-auto text-center">
          <span class="text-xs font-black uppercase tracking-wider text-indigo-400 block mb-2">Connecting Academia to Industry</span>
          <h2 class="text-2xl md:text-3xl font-bold font-display text-white mb-4">Our Mission</h2>
          <p class="text-slate-300 text-sm md:text-base leading-relaxed">
            SkillBridge serves as the critical bridge between academic theory and industry practice. We empower students to identify skill gaps, access targeted learning resources, and secure internships that align perfectly with their career aspirations.
          </p>
        </div>
      </div>

      <!-- 3 Stakeholder Cards -->
      <div class="mb-12">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-black font-display text-white">Connect with SkillBridge</h2>
          <p class="text-xs text-slate-400 font-medium mt-1">Dedicated portals for every stakeholder in the education-employment ecosystem</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Students Card -->
          <div class="rounded-3xl p-6 bg-[#0f172a] border border-slate-800 hover:border-indigo-700/60 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-950/40 transition">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                <i data-lucide="graduation-cap" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-lg text-white mb-2">Students</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-6">
                Take skill tests, identify your skill gaps, learn the missing skills with AI recommendations, and apply for matching internships.
              </p>
            </div>
            <button onclick="SkillBridgeApp.navigateTo('student-dashboard')" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition">
              Open Student Portal →
            </button>
          </div>

          <!-- Companies Card -->
          <div class="rounded-3xl p-6 bg-[#0f172a] border border-slate-800 hover:border-amber-700/60 flex flex-col justify-between hover:shadow-xl hover:shadow-amber-950/30 transition">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <i data-lucide="building-2" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-lg text-white mb-2">Companies</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-6">
                Post jobs, find top talent, and streamline your recruitment process with our advanced candidate matching and skill analysis tools.
              </p>
            </div>
            <button onclick="SkillBridgeApp.navigateTo('company-dashboard')" class="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition">
              Post a Job →
            </button>
          </div>

          <!-- Colleges Card -->
          <div class="rounded-3xl p-6 bg-[#0f172a] border border-slate-800 hover:border-emerald-700/60 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/30 transition">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                <i data-lucide="school" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-lg text-white mb-2">Colleges</h3>
              <p class="text-xs text-slate-400 leading-relaxed mb-6">
                Track student progress, identify skill gaps, and boost placement rates with comprehensive reports and industry-aligned training programs.
              </p>
            </div>
            <button onclick="SkillBridgeApp.navigateTo('college-dashboard')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition">
              View Reports →
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        ${[
          { value: "12,000+", label: "Students Mapped", color: "text-indigo-400" },
          { value: "340+", label: "Industry Partners", color: "text-amber-400" },
          { value: "78%", label: "Placement Rate", color: "text-emerald-400" },
          { value: "3.2x", label: "Faster Hiring", color: "text-rose-400" }
        ].map(s => `
          <div class="rounded-2xl p-5 bg-[#0f172a] border border-slate-800 text-center">
            <div class="text-3xl font-black ${s.color}">${s.value}</div>
            <div class="text-xs text-slate-400 mt-1 font-medium">${s.label}</div>
          </div>
        `).join('')}
      </div>
    `;
    lucide.createIcons();
  },

  // 2. STUDENT DASHBOARD (Complete Interactive Suite: Profile, Skills, Quiz Test, Gap Analysis, Learning, Internships)
  renderStudentDashboard: async function(container) {
    let data = this.fallbackStudentData;

    try {
      const res = await fetch('/api/wix/student/dashboard');
      if (res.ok) {
        const liveData = await res.json();
        data = { ...data, ...liveData };
      }
    } catch (err) {
      console.warn("Using offline fallback data for Student Dashboard");
    }

    container.innerHTML = `
      <!-- Student Skill Profile Hero Header -->
      <div class="rounded-3xl p-6 md:p-8 mb-8 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] border border-indigo-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-xl">
        <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(99,102,241,0.12),_transparent_60%)]"></div>
        <div class="flex items-center gap-5 relative">
          <div class="relative">
            <img src="${data.profile.avatar}" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-md" alt="Avatar">
            <span class="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-[#080c14]" title="NEP-2020 Verified">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </span>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <h2 class="text-2xl md:text-3xl font-black text-white">${data.profile.name}</h2>
              <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                AICTE NEP-2020 Verified
              </span>
            </div>
            <p class="text-xs md:text-sm text-slate-400 font-medium">
              🏛️ ${data.profile.college || 'IIT Bombay'} • ${data.profile.major} • CGPA: <strong class="text-indigo-400">${data.profile.cgpa || '8.74'}</strong>
            </p>
            <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
              <span>Skill Passport: <strong class="text-indigo-400 font-mono">${data.profile.passport_id || 'SP-4BB387CBA1BB'}</strong></span>
            </div>
          </div>
        </div>

        <!-- Action Quick-Tools -->
        <div class="flex flex-wrap items-center gap-3 relative">
          <button onclick="SkillBridgeApp.openQuizModal(1)" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-900/50 transition flex items-center gap-2">
            <i data-lucide="brain-circuit" class="w-4 h-4"></i> Take Skill Test
          </button>
          <button onclick="SkillBridgeApp.openPassportModal(1)" class="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-bold text-xs transition flex items-center gap-2">
            <i data-lucide="award" class="w-4 h-4 text-amber-400"></i> Skill Passport
          </button>
          <button onclick="SkillBridgeApp.openResumeParserModal()" class="px-4 py-2.5 rounded-xl border border-slate-600 text-slate-300 hover:text-white hover:border-slate-400 font-bold text-xs transition flex items-center gap-2">
            <i data-lucide="sparkles" class="w-4 h-4 text-indigo-400"></i> AI Resume Auto-Sync
          </button>
        </div>
      </div>

      <!-- SECTION 1: VERIFIED SKILL PROFILE & TEST ACCESS (CLICK ANY SKILL TO TEST) -->
      <div class="rounded-3xl p-6 md:p-8 mb-8 bg-[#0f172a] border border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 class="text-lg font-black text-white flex items-center gap-2">
              <i data-lucide="award" class="w-5 h-5 text-indigo-400"></i> Verified Skill Profile
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Click on any skill card below to <strong class="text-slate-200">take a technical assessment test</strong> and level up your verified badge.
            </p>
          </div>
          <button onclick="SkillBridgeApp.openQuizModal(1)" class="px-3.5 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-xs font-bold transition flex items-center gap-1.5">
            <i data-lucide="plus-circle" class="w-3.5 h-3.5"></i> Test New Skill
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          ${data.skills.map(s => `
            <div onclick="SkillBridgeApp.openQuizModal(${s.id})" class="p-4 rounded-2xl border border-slate-700 bg-slate-800/50 hover:border-indigo-500/60 hover:bg-slate-800 hover:scale-[1.02] cursor-pointer transition flex flex-col justify-between group">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="font-bold text-sm text-slate-100 group-hover:text-indigo-300 transition">${s.name}</span>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${s.verified ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                    ${s.verified ? '✓ Verified' : 'Take Test'}
                  </span>
                </div>
                <div class="w-full bg-slate-700 rounded-full h-2 mb-2">
                  <div class="${s.proficiency >= 75 ? 'bg-indigo-500' : s.proficiency >= 50 ? 'bg-amber-500' : 'bg-rose-500'} h-2 rounded-full transition-all duration-500" style="width: ${s.proficiency}%"></div>
                </div>
              </div>
              <div class="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-700">
                <span>Proficiency: <strong class="text-slate-200">${s.proficiency}%</strong> (${s.level})</span>
                <span class="text-indigo-400 font-bold group-hover:underline flex items-center gap-1">
                  Start Quiz <i data-lucide="chevron-right" class="w-3 h-3"></i>
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 2: AI SKILL GAP ANALYSIS & TARGET BENCHMARK -->
      <div class="rounded-3xl p-6 md:p-8 mb-8 bg-[#0f172a] border border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 class="text-lg font-black text-white flex items-center gap-2">
              <i data-lucide="target" class="w-5 h-5 text-emerald-400"></i> AI Skill Gap Analysis
            </h3>
            <p class="text-xs text-slate-400 mt-1">
              Benchmark comparison against tier-1 recruiters for <strong class="text-slate-200">Full Stack &amp; Cloud Developer</strong>
            </p>
          </div>
          <button onclick="SkillBridgeApp.openInteractiveSimulator()" class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition flex items-center gap-2">
            <i data-lucide="sliders" class="w-3.5 h-3.5 text-indigo-400"></i> Open Live Skill Simulator
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          ${data.skill_gaps.map(sg => {
            const isAvail = sg.status === 'Available';
            return `
              <div class="p-4 rounded-2xl border ${isAvail ? 'bg-emerald-950/30 border-emerald-600/30' : 'bg-rose-950/30 border-rose-600/30'} flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-sm text-slate-100">${sg.skill}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isAvail ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}">
                      ${sg.status}
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span>Current: ${sg.student_score}%</span>
                    <span>Target: ${sg.required_score}%</span>
                  </div>
                  <div class="w-full bg-slate-800 rounded-full h-1.5 mb-2">
                    <div class="${isAvail ? 'bg-emerald-500' : 'bg-rose-500'} h-1.5 rounded-full" style="width: ${sg.student_score}%"></div>
                  </div>
                </div>
                <div class="text-[10px] ${isAvail ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}">
                  ${isAvail ? '✓ Industry Benchmark Met' : `⚠️ Gap Deficit: ${Math.abs(sg.gap)}%`}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <div class="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-700/30 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <i data-lucide="zap" class="w-5 h-5 text-amber-400"></i>
            <div>
              <p class="text-xs font-bold text-slate-200">Employability Index: <span class="text-emerald-400">${data.profile.employability_score}% Ready</span></p>
              <p class="text-[11px] text-slate-400">Mastering REST API and Docker will raise your match score to 96% across tier-1 recruiters.</p>
            </div>
          </div>
          <button onclick="SkillBridgeApp.openInteractiveSimulator()" class="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-sm transition whitespace-nowrap">
            Simulate Improvement →
          </button>
        </div>
      </div>

      <!-- SECTION 3: RECOMMENDED LEARNING PATHS -->
      <div class="rounded-3xl p-6 md:p-8 mb-8 bg-[#0f172a] border border-slate-800">
        <div class="mb-6">
          <h3 class="text-lg font-black text-white flex items-center gap-2">
            <i data-lucide="compass" class="w-5 h-5 text-amber-400"></i> Recommended Learning Paths
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Curated resources automatically matched by AI to bridge your detected skill deficits.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${data.learning_path.map(lp => `
            <div class="p-5 rounded-2xl border border-slate-700 bg-slate-800/50 flex flex-col justify-between hover:border-indigo-500/50 hover:bg-slate-800 transition">
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">${lp.platform}</span>
                  <span class="text-[10px] text-slate-400 font-semibold">${lp.difficulty}</span>
                </div>
                <h4 class="font-bold text-sm text-slate-100 mb-1 leading-snug">${lp.title}</h4>
                <p class="text-[11px] text-slate-400 mb-4">Target: <strong class="text-slate-200">${lp.skill}</strong> • Est: ${lp.est_time}</p>
              </div>
              <a href="${lp.link}" target="_blank" class="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center transition flex items-center justify-center gap-1.5">
                Start Learning <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
              </a>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- SECTION 4: MATCHING INTERNSHIPS & 1-CLICK APPLY -->
      <div class="rounded-3xl p-6 md:p-8 bg-[#0f172a] border border-slate-800">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 class="text-lg font-black text-white flex items-center gap-2">
              <i data-lucide="briefcase" class="w-5 h-5 text-indigo-400"></i> Matching Internships &amp; Placements
            </h3>
            <p class="text-xs text-slate-400 mt-1">Curated opportunities matched against your verified skills</p>
          </div>
          <span class="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-xl border border-indigo-500/30">
            3 High Match Roles
          </span>
        </div>

        <div class="space-y-4">
          ${data.opportunities.map(opp => `
            <div id="opp-card-${opp.id}" class="p-5 rounded-2xl border border-slate-700 bg-slate-800/40 hover:border-indigo-500/50 hover:bg-slate-800 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-1.5">
                  <h4 class="font-bold text-sm text-white">${opp.job_title}</h4>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${opp.match_score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                    ${opp.match_score}% Skill Match
                  </span>
                </div>
                <p class="text-xs text-slate-400 mb-2">
                  🏢 <strong class="text-slate-200">${opp.company_name}</strong> • 📍 ${opp.location} • 💰 ${opp.stipend}
                </p>
                <div class="flex flex-wrap gap-1.5">
                  ${opp.required_skills.split(',').map(sk => `
                    <span class="text-[10px] px-2 py-0.5 rounded-md bg-slate-700 text-slate-300 border border-slate-600">${sk.trim()}</span>
                  `).join('')}
                </div>
              </div>
              <div class="flex items-center gap-3">
                <button id="apply-btn-${opp.id}" onclick="WixViews.openApplyModal(${opp.id}, '${opp.job_title}', '${opp.company_name}', ${opp.match_score})" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition whitespace-nowrap flex items-center gap-1.5">
                  <i data-lucide="send" class="w-3.5 h-3.5"></i> Apply Now
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  // 1-Click Interactive Application Modal
  openApplyModal: function(jobId, jobTitle, companyName, matchScore) {
    const modal = document.getElementById('modal-container');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
      <div class="relative bg-[#0f172a] rounded-3xl p-8 max-w-lg w-full mx-4 shadow-2xl border border-slate-700 text-slate-100">
        <button onclick="SkillBridgeApp.closeModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white">
          <i data-lucide="x" class="w-6 h-6"></i>
        </button>

        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <i data-lucide="send" class="w-5 h-5"></i>
          </div>
          <div>
            <span class="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Direct AICTE Placement Gateway</span>
            <h3 class="text-lg font-black text-white">Apply for ${jobTitle}</h3>
          </div>
        </div>

        <div class="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 mb-4 space-y-2 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-400">Company:</span>
            <span class="font-bold text-white">${companyName}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400">Candidate:</span>
            <span class="font-bold text-white">Aarav Sharma (IIT Bombay)</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Skill Compatibility:</span>
            <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">${matchScore}% Match</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-400">Digital Skill Passport:</span>
            <span class="font-mono text-indigo-300">SP-4BB387CBA1BB (Attached ✓)</span>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-xs font-bold text-slate-300 mb-1.5">Cover Note / Pitch (Optional):</label>
          <textarea id="apply-notes-input" rows="3" class="w-full text-xs p-3 rounded-xl border border-slate-700 bg-slate-900 text-white focus:ring-2 focus:ring-indigo-500 outline-none">I have verified skills in Python, REST APIs, and React with an AICTE Skill Passport. Excited to contribute to ${companyName}!</textarea>
        </div>

        <div class="flex items-center justify-end gap-3">
          <button onclick="SkillBridgeApp.closeModal()" class="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-700 text-slate-300 hover:bg-slate-800">
            Cancel
          </button>
          <button onclick="WixViews.submitApplication(${jobId}, '${jobTitle}', ${matchScore})" class="px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white shadow-md flex items-center gap-2">
            <i data-lucide="check-circle" class="w-4 h-4"></i> Submit Application →
          </button>
        </div>
      </div>
    `;

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    lucide.createIcons();
  },

  submitApplication: async function(jobId, jobTitle, matchScore) {
    try {
      await fetch('/api/wix/student/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          student_name: "Aarav Sharma",
          student_email: "aarav@skillbridge.io",
          match_score: matchScore
        })
      });
    } catch (err) {}

    SkillBridgeApp.closeModal();
    SkillBridgeApp.showToast(`🎉 Application submitted for ${jobTitle} (${matchScore}% match)! Status: Under Review`, "success");

    const btn = document.getElementById(`apply-btn-${jobId}`);
    if (btn) {
      btn.className = "px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs cursor-default flex items-center gap-1.5";
      btn.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> Applied (In Review)`;
      btn.disabled = true;
      lucide.createIcons();
    }
  },

  // 3. COMPANY DASHBOARD
  renderCompanyDashboard: async function(container) {
    let data = this.fallbackCompanyData;

    try {
      const res = await fetch('/api/wix/company/applicants');
      if (res.ok) {
        data = await res.json();
      }
    } catch (err) {
      console.warn("Using offline fallback data for Company Dashboard");
    }

    container.innerHTML = `
      <!-- Post Your Opportunity Section -->
      <div class="rounded-3xl p-6 md:p-8 mb-8 bg-[#0f172a] border border-slate-800">
        <div class="mb-6">
          <h2 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="plus-circle" class="w-5 h-5 text-indigo-400"></i> Post Your Opportunity
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Connect with students and colleges by sharing your job or internship requirements. We'll match your candidates based on their verified skills.
          </p>
        </div>

        <form onsubmit="WixViews.handlePublishOpportunity(event)" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Full name</label>
              <input id="wix-form-name" type="text" placeholder="e.g. Talent Lead" value="Vikram Malhotra" required class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Company email</label>
              <input id="wix-form-email" type="email" placeholder="e.g. hr@abctech.com" value="hr@infosys.com" required class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Job title</label>
              <input id="wix-form-title" type="text" placeholder="e.g. Software Developer Intern" value="Junior Cloud Developer" required class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Industry</label>
              <input id="wix-form-industry" type="text" placeholder="e.g. Software Engineering" value="Information Technology" required class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-300 mb-1">Location</label>
              <input id="wix-form-location" type="text" placeholder="e.g. Bengaluru (Hybrid)" value="Bengaluru (Hybrid)" required class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Job type</label>
            <select id="wix-form-type" class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="Internship" selected>Internship</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1.5">Required skills</label>
            <div class="flex flex-wrap gap-2 text-xs" id="wix-skills-chips">
              ${['Project Management', 'Communication', 'Leadership', 'Data Analysis', 'Design', 'Marketing', 'Sales', 'Engineering', 'Python', 'React', 'REST API'].map(skill => `
                <label class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 cursor-pointer hover:bg-indigo-950 hover:border-indigo-500 hover:text-indigo-300 transition">
                  <input type="checkbox" value="${skill}" ${['Python', 'REST API', 'Engineering'].includes(skill) ? 'checked' : ''} class="accent-indigo-600">
                  <span>${skill}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-300 mb-1">Job description</label>
            <textarea id="wix-form-desc" rows="3" placeholder="Outline the role responsibilities and qualifications..." required class="w-full text-xs p-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none">We are seeking proactive engineering students proficient in Python, modern Web APIs, and system fundamentals to work on scalable cloud services.</textarea>
          </div>

          <button type="submit" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition">
            Publish Opportunity →
          </button>
        </form>
      </div>

      <!-- Applicant Management Section -->
      <div class="rounded-3xl p-6 md:p-8 bg-[#0f172a] border border-slate-800">
        <div class="mb-4">
          <h3 class="text-lg font-black text-white flex items-center gap-2">
            <i data-lucide="users" class="w-5 h-5 text-indigo-400"></i> Applicant Management
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Review and shortlist candidates based on their skill match percentage for your latest openings.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${data.applicants.map(app => `
            <div class="p-4 rounded-2xl border border-slate-700 bg-slate-800/50 flex flex-col justify-between">
              <div>
                <h4 class="font-bold text-sm text-white">${app.name}</h4>
                <p class="text-[11px] text-slate-400 mb-2">${app.applied_role} • ${app.college || 'IIT Bombay'}</p>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
                  ${app.match_score}% Skill Match
                </span>
              </div>
              <button onclick="WixViews.updateStatus(${app.id}, 'Shortlisted')" class="w-full py-2 rounded-xl bg-slate-700 border border-slate-600 text-slate-200 font-bold text-xs hover:bg-emerald-950 hover:border-emerald-600 hover:text-emerald-300 transition">
                ${app.status} ✓
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  handlePublishOpportunity: async function(event) {
    event.preventDefault();
    const chips = Array.from(document.querySelectorAll('#wix-skills-chips input:checked')).map(c => c.value);

    const payload = {
      full_name: document.getElementById('wix-form-name').value,
      company_email: document.getElementById('wix-form-email').value,
      job_title: document.getElementById('wix-form-title').value,
      industry: document.getElementById('wix-form-industry').value,
      location: document.getElementById('wix-form-location').value,
      job_type: document.getElementById('wix-form-type').value,
      required_skills: chips.length > 0 ? chips : ['Engineering'],
      job_description: document.getElementById('wix-form-desc').value
    };

    try {
      const res = await fetch('/api/wix/publish-opportunity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        SkillBridgeApp.showToast(data.message || "Opportunity published successfully!", "success");
        WixViews.renderCompanyDashboard(document.getElementById('view-container'));
        return;
      }
    } catch (err) {}
    SkillBridgeApp.showToast("Opportunity published successfully to network!", "success");
  },

  updateStatus: async function(applicantId, newStatus) {
    try {
      await fetch('/api/wix/company/applicant-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicant_id: applicantId, status: newStatus })
      });
    } catch (err) {}
    SkillBridgeApp.showToast(`Candidate status updated to ${newStatus}`, "info");
  },

  // 4. COLLEGE DASHBOARD
  renderCollegeDashboard: async function(container) {
    let data = this.fallbackCollegeData;

    try {
      const res = await fetch('/api/wix/college/analytics');
      if (res.ok) {
        data = await res.json();
      }
    } catch (err) {
      console.warn("Using offline fallback data for College Dashboard");
    }

    container.innerHTML = `
      <!-- Placement Analytics -->
      <div class="rounded-3xl p-6 md:p-8 mb-8 bg-[#0f172a] border border-slate-800">
        <div class="mb-6">
          <h2 class="text-xl font-black text-white flex items-center gap-2">
            <i data-lucide="bar-chart-2" class="w-5 h-5 text-indigo-400"></i> Placement Analytics
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Real-time data on student readiness and industry alignment across our global network.
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-5 rounded-2xl bg-slate-800/60 border border-slate-700">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Assessed</span>
            <div class="text-3xl font-black text-slate-100 mt-1">${data.metrics.students_assessed}</div>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-700/30">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Ready</span>
            <div class="text-3xl font-black text-emerald-400 mt-1">${data.metrics.placement_ready}</div>
          </div>

          <div class="p-5 rounded-2xl bg-amber-950/30 border border-amber-700/30">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Skill Gap</span>
            <div class="text-2xl font-black text-amber-400 mt-1">${data.metrics.top_skill_gap}</div>
          </div>

          <div class="p-5 rounded-2xl bg-indigo-950/30 border border-indigo-700/30">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Internship Matches</span>
            <div class="text-3xl font-black text-indigo-400 mt-1">${data.metrics.internship_matches}</div>
          </div>
        </div>
      </div>

      <!-- Top Skill Gaps -->
      <div class="rounded-3xl p-6 md:p-8 bg-[#0f172a] border border-slate-800">
        <div class="mb-4">
          <h3 class="text-lg font-black text-white flex items-center gap-2">
            <i data-lucide="alert-circle" class="w-5 h-5 text-amber-400"></i> Top Skill Gaps in Academia
          </h3>
          <p class="text-xs text-slate-400 mt-1">
            Identify the most critical skills students are missing to bridge the gap between academia and industry.
          </p>
        </div>

        <div class="space-y-4">
          ${data.skill_gaps.map(sg => `
            <div class="p-4 rounded-2xl border border-slate-700 bg-slate-800/50">
              <div class="flex justify-between items-center mb-1.5">
                <span class="font-bold text-sm text-slate-100">${sg.skill}</span>
                <span class="text-xs font-bold text-indigo-400">${sg.students_affected} Students Affected (${sg.percentage}%)</span>
              </div>
              <div class="w-full bg-slate-700 rounded-full h-2 mb-2">
                <div class="bg-indigo-500 h-2 rounded-full" style="width: ${sg.percentage}%"></div>
              </div>
              <p class="text-xs text-slate-400">${sg.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
    lucide.createIcons();
  }
};
