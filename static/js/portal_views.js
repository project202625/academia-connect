/**
 * SkillBridge AI - Portal Views Renderer (SIH Winner Edition)
 * High-fidelity, interactive views for Student, Industry Recruiter, College TPO, and Admin.
 */

window.PortalViews = {
  // ----------------- 1. STUDENT VIEW -----------------
  renderStudent: async function(container, currentUser) {
    const studentId = currentUser.student_id || 1;
    container.innerHTML = `<div class="p-16 text-center text-slate-500"><i class="animate-spin text-3xl text-indigo-600 mb-2 inline-block" data-lucide="loader-2"></i><p>Loading AI Skill Matrix & Radar Benchmarks...</p></div>`;
    lucide.createIcons();

    try {
      const [gapRes, matchRes, appsRes, rolesRes] = await Promise.all([
        fetch(`/api/students/${studentId}/gap-analysis`),
        fetch(`/api/internships/matched/${studentId}`),
        fetch(`/api/applications/student/${studentId}`),
        fetch('/api/roles')
      ]);

      const gapData = await gapRes.json();
      const matchData = await matchRes.json();
      const appsData = await appsRes.json();
      const rolesData = await rolesRes.json();

      container.innerHTML = `
        <!-- Profile Banner -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
          
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div class="flex items-center gap-5">
              <div class="relative">
                <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="Student avatar">
                <span class="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white" title="Verified AICTE Student">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i>
                </span>
              </div>
              <div>
                <div class="flex flex-wrap items-center gap-2 mb-1">
                  <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">${currentUser.name}</h2>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> NEP-2020 Verified
                  </span>
                </div>
                <p class="text-xs md:text-sm text-slate-500 font-medium">
                  🏛️ ${currentUser.organization} • ${currentUser.department || 'B.Tech Computer Science'} • CGPA: <strong class="text-indigo-600">${currentUser.cgpa || '8.74'}</strong>
                </p>
                <div class="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400 font-semibold">
                  <span>Target Role: <strong class="text-slate-800">${gapData.target_role}</strong></span>
                  <span>•</span>
                  <span>Verifiable Passport ID: <strong class="text-indigo-600 font-mono">SP-4BB387CBA1BB</strong></span>
                </div>
              </div>
            </div>

            <!-- Quick Action Buttons -->
            <div class="flex flex-wrap items-center gap-3">
              <button onclick="SkillBridgeApp.openPassportModal(${studentId})" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition flex items-center gap-2">
                <i data-lucide="award" class="w-4 h-4"></i> View Digital Skill Passport
              </button>
              <button onclick="SkillBridgeApp.openResumeParserModal()" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition flex items-center gap-2">
                <i data-lucide="sparkles" class="w-4 h-4 text-amber-400"></i> AI Resume Auto-Sync
              </button>
            </div>
          </div>
        </div>

        <!-- Role Benchmarking & Skill Gap Radar Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          <!-- Left: Employability Gauge & Target Role Selector -->
          <div class="lg:col-span-4 glass-panel rounded-3xl p-6 bg-white flex flex-col justify-between border border-slate-200">
            <div>
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                  <i data-lucide="crosshair" class="w-4 h-4 text-indigo-600"></i> Role Target & Readiness
                </h3>
                <span class="text-[11px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold">Tier-1 Standard</span>
              </div>
              
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Benchmark Target Role:</label>
              <select id="student-role-select" onchange="SkillBridgeApp.changeStudentRole(${studentId}, this.value)" class="w-full text-xs font-bold rounded-xl border border-slate-300 p-3 bg-slate-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none mb-4">
                ${rolesData.roles.map(r => `<option value="${r}" ${r === gapData.target_role ? 'selected' : ''}>${r}</option>`).join('')}
              </select>

              <!-- Gauge Chart -->
              <div class="relative w-44 h-44 mx-auto my-2 flex items-center justify-center">
                <canvas id="employability-gauge"></canvas>
                <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span class="text-4xl font-black text-slate-900" id="employability-score-label">${gapData.employability_score}%</span>
                  <span class="text-[10px] uppercase font-black tracking-wider text-slate-400">Employability Index</span>
                </div>
              </div>
            </div>

            <div class="mt-4 p-4 bg-indigo-50/70 rounded-2xl border border-indigo-100 text-xs text-indigo-950">
              <p class="leading-relaxed"><strong>AI Recommendation:</strong> ${gapData.summary}</p>
            </div>
          </div>

          <!-- Right: Radar Chart Visualization -->
          <div class="lg:col-span-8 glass-panel rounded-3xl p-6 bg-white border border-slate-200">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                  <i data-lucide="radar" class="w-4 h-4 text-emerald-600"></i> AI Competency Radar vs Industry Standard
                </h3>
                <p class="text-xs text-slate-500">Benchmark comparison against tier-1 recruiters hiring for ${gapData.target_role}</p>
              </div>
              <div class="flex items-center gap-3 text-xs font-semibold">
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-indigo-600"></span> Student Skills</span>
                <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Industry Benchmark</span>
              </div>
            </div>

            <div class="h-80 w-full relative">
              <canvas id="skill-radar-canvas"></canvas>
            </div>
          </div>
        </div>

        <!-- ⚡ INTERACTIVE LIVE SKILL SIMULATOR (HACKATHON JUDGE HIGHLIGHT) -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[10px] uppercase tracking-wider">
                  Interactive Simulator
                </span>
                <h3 class="font-display font-black text-lg text-white">Live Skill Gap & Placement Impact Simulator</h3>
              </div>
              <p class="text-xs text-indigo-200">Adjust the sliders below to simulate acquiring new skills and observe live recalculation of your Employability Score and Radar!</p>
            </div>
            <button onclick="SkillBridgeApp.resetSimulation(${studentId})" class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white/10 hover:bg-white/20 text-indigo-100 transition self-start md:self-auto">
              ↺ Reset Levels
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div class="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>🤖 Large Language Models (LLMs)</span>
                <span id="sim-llm-label" class="text-amber-300 font-mono">40%</span>
              </div>
              <input type="range" min="20" max="100" value="40" oninput="SkillBridgeApp.simulateSkill(${studentId}, 3, this.value, 'sim-llm-label')" class="w-full accent-amber-400">
              <div class="text-[10px] text-indigo-300 mt-1">Target Benchmark: 75%</div>
            </div>

            <div class="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>🐳 Docker & Containers</span>
                <span id="sim-docker-label" class="text-amber-300 font-mono">65%</span>
              </div>
              <input type="range" min="20" max="100" value="65" oninput="SkillBridgeApp.simulateSkill(${studentId}, 12, this.value, 'sim-docker-label')" class="w-full accent-amber-400">
              <div class="text-[10px] text-indigo-300 mt-1">Target Benchmark: 70%</div>
            </div>

            <div class="p-3.5 bg-white/5 rounded-2xl border border-white/10">
              <div class="flex justify-between text-xs font-bold mb-1">
                <span>☸️ Kubernetes Orchestration</span>
                <span id="sim-k8s-label" class="text-amber-300 font-mono">25%</span>
              </div>
              <input type="range" min="20" max="100" value="25" oninput="SkillBridgeApp.simulateSkill(${studentId}, 13, this.value, 'sim-k8s-label')" class="w-full accent-amber-400">
              <div class="text-[10px] text-indigo-300 mt-1">Target Benchmark: 85%</div>
            </div>
          </div>
        </div>

        <!-- Actionable Bridge Roadmaps (What student must learn) -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-white border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center gap-2">
                <i data-lucide="zap" class="w-5 h-5 text-amber-500"></i> Targeted Skill Remediation Roadmaps
              </h3>
              <p class="text-xs text-slate-500">Direct interventions and practical capstone projects to close identified gaps</p>
            </div>
            <span class="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-extrabold rounded-xl border border-amber-200">
              ${gapData.gaps.length} Critical Gaps Identified
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${gapData.gaps.map(g => `
              <div class="p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-white transition flex flex-col justify-between">
                <div>
                  <div class="flex items-start justify-between gap-2 mb-2">
                    <span class="font-bold text-sm text-slate-900">${g.skill_name}</span>
                    <span class="px-2 py-0.5 text-[10px] font-black uppercase rounded ${g.is_core ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700'}">
                      ${g.is_core ? 'Core Must-Have' : 'Elective'}
                    </span>
                  </div>
                  
                  <div class="w-full bg-slate-200 rounded-full h-2 mb-2">
                    <div class="bg-indigo-600 h-2 rounded-full" style="width: ${g.student_level}%"></div>
                  </div>
                  <div class="flex justify-between text-[11px] text-slate-500 mb-3">
                    <span>You: <strong>${g.student_level}%</strong></span>
                    <span>Industry Benchmark: <strong>${g.benchmark_level}%</strong></span>
                    <span class="text-red-600 font-black">-${g.gap}%</span>
                  </div>

                  <div class="p-3 bg-indigo-50 rounded-xl text-xs text-indigo-950 mb-3 border border-indigo-100">
                    <p class="font-bold flex items-center gap-1.5 mb-1 text-indigo-800">
                      <i data-lucide="book-open" class="w-3.5 h-3.5"></i> ${g.recommendation.recommended_course}
                    </p>
                    <p class="text-[11px] text-slate-600">⏱️ Est: <strong>${g.recommendation.est_hours}</strong> • Capstone: ${g.recommendation.project_idea}</p>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-2">
                  <button onclick="SkillBridgeApp.completeSkillModule(${studentId}, ${g.skill_id}, '${g.skill_name}')" class="py-2 px-3 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white text-center shadow-sm transition">
                    Learn & Bridge →
                  </button>
                  <button onclick="SkillBridgeApp.openQuizModal(${g.skill_id})" class="py-2 px-3 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-100 text-slate-700 text-center transition">
                    Quiz Challenge
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Matched Internships & Placements -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-white border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center gap-2">
                <i data-lucide="briefcase" class="w-5 h-5 text-indigo-600"></i> AI-Ranked Internships & Campus Placement
              </h3>
              <p class="text-xs text-slate-500">Live positions automatically scored by candidate skill vector matching</p>
            </div>
            <div class="flex items-center gap-2 text-xs font-bold">
              <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">Tier 1 Match: ≥80%</span>
              <span class="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">Tier 2 Match: 60-79%</span>
            </div>
          </div>

          <div class="space-y-4">
            ${matchData.internships.map(job => {
              const pillClass = job.match_score >= 80 ? 'match-pill-high' : (job.match_score >= 60 ? 'match-pill-med' : 'match-pill-low');
              const isApplied = !!job.application_status;

              return `
                <div class="p-5 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition bg-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div class="flex-1">
                    <div class="flex flex-wrap items-center gap-2 mb-2">
                      <span class="font-bold text-base text-slate-900">${job.title}</span>
                      <span class="px-3 py-0.5 rounded-full text-xs font-black ${pillClass}">
                        ${job.match_score}% Compatibility Match
                      </span>
                      <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                        ${job.type}
                      </span>
                      <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-800">
                        ${job.work_mode}
                      </span>
                    </div>

                    <p class="text-xs font-semibold text-slate-600 mb-2">
                      🏢 ${job.company_name} • 📍 ${job.location} • 💰 <span class="text-emerald-700 font-extrabold">${job.stipend}</span> • Min CGPA: <strong>${job.min_cgpa}</strong>
                    </p>

                    <p class="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
                      ${job.description}
                    </p>

                    <div class="flex flex-wrap items-center gap-1.5">
                      <span class="text-[11px] font-bold text-slate-400 mr-1">Required Competencies:</span>
                      ${(job.skills_list || []).map(s => `
                        <span class="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold border border-slate-200">
                          ${s}
                        </span>
                      `).join('')}
                    </div>
                  </div>

                  <div class="flex md:flex-col items-end justify-between md:justify-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 min-w-[150px]">
                    <div class="text-right hidden md:block">
                      <span class="text-[10px] uppercase font-bold text-slate-400">Deadline</span>
                      <p class="text-xs font-bold text-slate-700">${job.deadline}</p>
                    </div>

                    ${isApplied ? `
                      <span class="px-4 py-2 rounded-xl text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5">
                        <i data-lucide="check-circle" class="w-4 h-4"></i> ${job.application_status}
                      </span>
                    ` : `
                      <button onclick="SkillBridgeApp.applyForInternship(${job.id}, ${studentId}, '${job.title}', ${job.match_score})" class="w-full md:w-auto px-5 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-100 transition">
                        1-Click Apply →
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Student Application Status Pipeline Tracker -->
        <div class="glass-panel rounded-3xl p-6 bg-white border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center gap-2">
                <i data-lucide="git-pull-request" class="w-5 h-5 text-violet-600"></i> Active Placement & Internship Pipeline
              </h3>
              <p class="text-xs text-slate-500">Real-time status synced with corporate recruitment portals</p>
            </div>
            <span class="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">
              ${appsData.applications.length} Active Candidacies
            </span>
          </div>

          <div class="space-y-4">
            ${appsData.applications.map(app => {
              const stages = ['Applied', 'Resume Shortlisted', 'Technical Assessment', 'Interview Scheduled', 'Offered'];
              const currentIdx = stages.indexOf(app.status);

              return `
                <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50/70">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 class="font-bold text-sm text-slate-900">${app.title}</h4>
                      <p class="text-xs text-slate-500">${app.company_name} • Applied on ${new Date(app.applied_at).toLocaleDateString()} • AI Match: <strong class="text-indigo-600">${app.match_score}%</strong></p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 self-start sm:self-auto">
                      ${app.status}
                    </span>
                  </div>

                  <!-- Visual Progress Steps -->
                  <div class="grid grid-cols-5 gap-2">
                    ${stages.map((stage, idx) => {
                      const isComplete = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;
                      return `
                        <div class="flex flex-col items-center text-center">
                          <div class="w-full h-2 rounded-full mb-1.5 ${isComplete ? 'bg-indigo-600' : 'bg-slate-200'}"></div>
                          <span class="text-[10px] font-bold ${isCurrent ? 'text-indigo-700 font-black' : (isComplete ? 'text-slate-700' : 'text-slate-400')} line-clamp-1">
                            ${stage}
                          </span>
                        </div>
                      `;
                    }).join('')}
                  </div>

                  ${app.notes ? `
                    <div class="mt-3 text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200">
                      <strong>Recruiter Note:</strong> ${app.notes}
                    </div>
                  ` : ''}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      lucide.createIcons();

      // Render Charts
      SkillCharts.renderSkillRadar(
        'skill-radar-canvas',
        gapData.radar.labels,
        gapData.radar.student_scores,
        gapData.radar.benchmark_scores,
        gapData.target_role
      );

      SkillCharts.renderEmployabilityGauge('employability-gauge', gapData.employability_score);

    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500 font-medium">Failed to load student portal. Please check API server.</div>`;
    }
  },

  // ----------------- 2. INDUSTRY RECRUITER VIEW -----------------
  renderRecruiter: async function(container, currentUser) {
    const recruiterId = currentUser.id || 3;
    container.innerHTML = `<div class="p-16 text-center text-slate-500"><i class="animate-spin text-3xl text-indigo-600 mb-2 inline-block" data-lucide="loader-2"></i><p>Loading corporate hiring workspace...</p></div>`;
    lucide.createIcons();

    try {
      const [appsRes, jobsRes, feedRes, capRes] = await Promise.all([
        fetch(`/api/applications/recruiter/${recruiterId}`),
        fetch('/api/internships'),
        fetch('/api/curriculum/feedback'),
        fetch('/api/capstones')
      ]);

      const appsData = await appsRes.json();
      const jobsData = await jobsRes.json();
      const feedData = await feedRes.json();
      const capData = await capRes.json();

      container.innerHTML = `
        <!-- Recruiter Welcome Banner -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}" class="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="Recruiter">
              <div>
                <div class="flex items-center gap-2">
                  <h2 class="text-2xl md:text-3xl font-black text-slate-900">${currentUser.name}</h2>
                  <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    Corporate Recruiter
                  </span>
                </div>
                <p class="text-sm text-slate-500 font-medium">${currentUser.organization} • ${currentUser.department}</p>
                <p class="text-xs text-slate-400 mt-1">Active Campus Hiring MoU with NITK, IIT Bombay & Anna University</p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <button onclick="SkillBridgeApp.openPostJobModal(${recruiterId})" class="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition flex items-center gap-2">
                <i data-lucide="plus" class="w-4 h-4"></i> Post New Opening
              </button>
              <button onclick="SkillBridgeApp.openPostCapstoneModal(${recruiterId})" class="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-300 hover:bg-slate-50 text-slate-700 transition flex items-center gap-2">
                <i data-lucide="code-2" class="w-4 h-4"></i> Sponsor Capstone Problem
              </button>
            </div>
          </div>
        </div>

        <!-- Hiring Pipeline Applicant Manager -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-white border border-slate-200">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-lg flex items-center gap-2">
                <i data-lucide="users" class="w-5 h-5 text-indigo-600"></i> AI-Ranked Student Talent Pool & Applicants
              </h3>
              <p class="text-xs text-slate-500">Candidates pre-assessed and ranked against job skill requirements</p>
            </div>
            <span class="text-xs font-black text-indigo-700 bg-indigo-50 px-3 py-1 rounded-xl">
              ${appsData.applications.length} Candidates Under Review
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3.5">Candidate</th>
                  <th class="p-3.5">Applied Position</th>
                  <th class="p-3.5">CGPA & Branch</th>
                  <th class="p-3.5 text-center">AI Skill Match</th>
                  <th class="p-3.5">Current Status</th>
                  <th class="p-3.5 text-right">Advance Stage</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${appsData.applications.map(app => `
                  <tr class="hover:bg-slate-50 transition">
                    <td class="p-3.5 font-bold text-slate-900 flex items-center gap-3">
                      <img src="${app.student_avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150'}" class="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-50">
                      <div>
                        <div>${app.student_name}</div>
                        <a href="${app.github_url || '#'}" target="_blank" class="text-[11px] text-indigo-600 font-semibold hover:underline">View GitHub Portfolio ↗</a>
                      </div>
                    </td>
                    <td class="p-3.5 font-semibold text-slate-700">${app.job_title}</td>
                    <td class="p-3.5">
                      <div class="font-bold text-slate-900">${app.cgpa} CGPA</div>
                      <div class="text-[11px] text-slate-400">${app.branch} (${app.graduation_year})</div>
                    </td>
                    <td class="p-3.5 text-center">
                      <span class="px-3 py-1 rounded-full text-xs font-black ${app.match_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                        ${app.match_score}%
                      </span>
                    </td>
                    <td class="p-3.5">
                      <span class="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-800">
                        ${app.status}
                      </span>
                    </td>
                    <td class="p-3.5 text-right">
                      <select onchange="SkillBridgeApp.updateApplicantStatus(${app.id}, this.value)" class="text-xs font-bold rounded-xl border border-slate-300 p-2 bg-white focus:ring-2 focus:ring-indigo-500">
                        <option value="Applied" ${app.status === 'Applied' ? 'selected' : ''}>Applied</option>
                        <option value="Resume Shortlisted" ${app.status === 'Resume Shortlisted' ? 'selected' : ''}>Shortlist Candidate</option>
                        <option value="Technical Assessment" ${app.status === 'Technical Assessment' ? 'selected' : ''}>Schedule Assessment</option>
                        <option value="Interview Scheduled" ${app.status === 'Interview Scheduled' ? 'selected' : ''}>Interview Scheduled</option>
                        <option value="Offered" ${app.status === 'Offered' ? 'selected' : ''}>Issue Offer Letter</option>
                        <option value="Rejected" ${app.status === 'Rejected' ? 'selected' : ''}>Reject</option>
                      </select>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Academia-Industry Feedback Loop Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          <!-- Submit Curriculum Recommendation -->
          <div class="lg:col-span-5 glass-panel rounded-3xl p-6 bg-white border border-slate-200">
            <h3 class="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <i data-lucide="message-square-plus" class="w-4 h-4 text-indigo-600"></i> Curriculum Skill Demand Telemetry
            </h3>
            <p class="text-xs text-slate-500 mb-4">Directly influence university syllabi to avoid post-hire retraining</p>

            <form onsubmit="SkillBridgeApp.submitCurriculumFeedback(event, ${recruiterId})" class="space-y-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Target Academic Course</label>
                <input id="feedback-course" type="text" placeholder="e.g. CS604: Artificial Intelligence & Expert Systems" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Recommended Tech Stack / Modern Topic</label>
                <input id="feedback-topic" type="text" placeholder="e.g. Transformer Architecture & RAG Pipelines" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Industry Business Case / Hiring Rationale</label>
                <textarea id="feedback-usecase" rows="3" placeholder="Explain why modern engineering roles need this practical skill..." required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"></textarea>
              </div>

              <button type="submit" class="w-full py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition">
                Submit Recommendation to TPO Board →
              </button>
            </form>
          </div>

          <!-- Existing Industry Proposals & Upvoting -->
          <div class="lg:col-span-7 glass-panel rounded-3xl p-6 bg-white border border-slate-200">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                <i data-lucide="vote" class="w-4 h-4 text-emerald-600"></i> Corporate Demand Voting
              </h3>
              <span class="text-xs text-slate-400">AICTE Curriculum Council</span>
            </div>

            <div class="space-y-3">
              ${feedData.feedback.map(fb => `
                <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between gap-3">
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-xs font-bold text-slate-900">${fb.recommended_topic}</span>
                      <span class="text-[10px] px-2 py-0.5 rounded font-black ${fb.status === 'Accepted by TPO' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}">
                        ${fb.status}
                      </span>
                    </div>
                    <p class="text-[11px] font-bold text-indigo-700 mb-1">Course: ${fb.course_name}</p>
                    <p class="text-xs text-slate-600 leading-relaxed mb-2">${fb.industry_use_case}</p>
                    <span class="text-[10px] text-slate-400 font-medium">Proposed by ${fb.recruiter_name} (${fb.company_name})</span>
                  </div>

                  <button onclick="SkillBridgeApp.voteCurriculum(${fb.id})" class="flex flex-col items-center px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-700 transition shadow-sm">
                    <i data-lucide="thumbs-up" class="w-4 h-4 mb-0.5"></i>
                    <span class="text-xs font-black">${fb.votes}</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      lucide.createIcons();
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load recruiter workspace.</div>`;
    }
  },

  // ----------------- 3. COLLEGE TPO & DEAN VIEW -----------------
  renderTpo: async function(container, currentUser) {
    container.innerHTML = `<div class="p-16 text-center text-slate-500"><i class="animate-spin text-3xl text-indigo-600 mb-2 inline-block" data-lucide="loader-2"></i><p>Loading institutional analytics & risk models...</p></div>`;
    lucide.createIcons();

    try {
      const [tpoRes, auditRes, feedRes, riskRes] = await Promise.all([
        fetch('/api/tpo/analytics'),
        fetch('/api/curriculum/audit'),
        fetch('/api/curriculum/feedback'),
        fetch('/api/tpo/risk-analysis')
      ]);

      const tpoData = await tpoRes.json();
      const auditData = await auditRes.json();
      const feedData = await feedRes.json();
      const riskData = await riskRes.json();

      container.innerHTML = `
        <!-- Institutional Header -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}" class="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="TPO">
              <div>
                <h2 class="text-2xl md:text-3xl font-black text-slate-900">${currentUser.name}</h2>
                <p class="text-sm text-slate-500 font-medium">${currentUser.organization} • ${currentUser.department}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 text-emerald-800">
                    NIRF Engineering Top 15
                  </span>
                  <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800">
                    NAAC A++ Accredited
                  </span>
                </div>
              </div>
            </div>

            <div class="text-right">
              <div class="text-xs text-slate-400 font-bold uppercase tracking-wider">Placement Conversion Rate</div>
              <div class="text-4xl font-black text-emerald-600">${tpoData.metrics.overall_placement_rate}</div>
              <div class="text-xs text-slate-500 font-medium">Avg Package: <strong>${tpoData.metrics.avg_ctc}</strong> • Highest: <strong>${tpoData.metrics.highest_ctc}</strong></div>
            </div>
          </div>
        </div>

        <!-- High-level Metric Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <div class="text-3xl font-black text-slate-900 mt-1">${tpoData.metrics.total_registered_students}</div>
            <span class="text-[11px] text-slate-500 font-medium">Final & Pre-final Batches</span>
          </div>

          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Active MoUs</span>
            <div class="text-3xl font-black text-indigo-600 mt-1">${tpoData.metrics.active_corporate_mous}</div>
            <span class="text-[11px] text-emerald-600 font-bold">+3 Signed This Quarter</span>
          </div>

          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Openings</span>
            <div class="text-3xl font-black text-slate-900 mt-1">${tpoData.metrics.active_internships_count}</div>
            <span class="text-[11px] text-slate-500 font-medium">Tier-1 Corporate Partners</span>
          </div>

          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Curriculum Alignment</span>
            <div class="text-3xl font-black text-amber-500 mt-1">${auditData.average_alignment_score}%</div>
            <span class="text-[11px] text-amber-700 font-bold">${auditData.outdated_modules_count} Courses Need Updates</span>
          </div>
        </div>

        <!-- Department Readiness vs Placement Chart -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-white border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                <i data-lucide="bar-chart-3" class="w-4 h-4 text-indigo-600"></i> Department Skill Readiness vs Placement Success
              </h3>
              <p class="text-xs text-slate-500">Cross-branch benchmarking to schedule targeted remedial bridge tracks</p>
            </div>
            <div class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
              Batch of 2026
            </div>
          </div>

          <div class="h-72 w-full relative">
            <canvas id="tpo-readiness-chart"></canvas>
          </div>
        </div>

        <!-- AI-Driven Early Intervention Radar (At-Risk Students) -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-white border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-500"></i> AI Placement Risk & Early Intervention Radar
              </h3>
              <p class="text-xs text-slate-500">Proactively identifies students falling below 65% industry readiness thresholds</p>
            </div>
            <span class="px-3 py-1 bg-amber-50 text-amber-800 text-xs font-bold rounded-xl border border-amber-200">
              3 Remediation Interventions Recommended
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3.5">Student Name</th>
                  <th class="p-3.5">Branch & CGPA</th>
                  <th class="p-3.5 text-center">Readiness Index</th>
                  <th class="p-3.5">Primary Skill Gap Bottleneck</th>
                  <th class="p-3.5">TPO Remedial Action Plan</th>
                  <th class="p-3.5 text-right">Intervention</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${riskData.at_risk_students.map(s => `
                  <tr class="hover:bg-amber-50/40 transition">
                    <td class="p-3.5 font-bold text-slate-900">${s.name}</td>
                    <td class="p-3.5">${s.branch} • <strong>${s.cgpa} CGPA</strong></td>
                    <td class="p-3.5 text-center">
                      <span class="px-2.5 py-1 rounded-full font-black text-xs bg-red-100 text-red-800">
                        ${s.readiness_index}%
                      </span>
                    </td>
                    <td class="p-3.5 font-semibold text-red-700">${s.primary_gap}</td>
                    <td class="p-3.5 text-slate-700">${s.recommended_intervention}</td>
                    <td class="p-3.5 text-right">
                      <button onclick="SkillBridgeApp.dispatchIntervention('${s.name}')" class="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-[11px] shadow-sm hover:bg-indigo-700">
                        Dispatch Roadmap ✉️
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Curriculum vs Industry Alignment Audit Table -->
        <div class="glass-panel rounded-3xl p-6 mb-8 bg-white border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="font-bold text-slate-900 text-base flex items-center gap-2">
                <i data-lucide="shield-check" class="w-4 h-4 text-emerald-600"></i> Academic Curriculum Audit (Industry 4.0 Alignment)
              </h3>
              <p class="text-xs text-slate-500">Automated syllabus gap detection against real corporate recruitment criteria</p>
            </div>
            <button onclick="SkillBridgeApp.openCurriculumDiffModal()" class="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-1.5">
              <i data-lucide="git-compare" class="w-3.5 h-3.5 text-amber-400"></i> Compare Before vs After Diff
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-600">
              <thead class="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th class="p-3.5">Course Code</th>
                  <th class="p-3.5">Course Title</th>
                  <th class="p-3.5">Sem</th>
                  <th class="p-3.5">Mapped Skill</th>
                  <th class="p-3.5 text-center">Alignment</th>
                  <th class="p-3.5">Status</th>
                  <th class="p-3.5">TPO Recommendation</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                ${auditData.curriculum_topics.map(c => {
                  let badge = 'bg-emerald-100 text-emerald-800';
                  if (c.status === 'Needs Update') badge = 'bg-amber-100 text-amber-800';
                  else if (c.status === 'Obsolete') badge = 'bg-red-100 text-red-800';

                  return `
                    <tr class="hover:bg-slate-50 transition">
                      <td class="p-3.5 font-mono font-bold text-slate-900">${c.course_code}</td>
                      <td class="p-3.5 font-bold text-slate-900">${c.course_name}</td>
                      <td class="p-3.5 font-bold text-slate-500">S${c.semester}</td>
                      <td class="p-3.5 font-semibold text-indigo-700">${c.mapped_skill_name || 'Core Theory'}</td>
                      <td class="p-3.5 text-center">
                        <span class="font-black text-xs ${c.industry_alignment_score >= 80 ? 'text-emerald-600' : 'text-amber-600'}">
                          ${c.industry_alignment_score}%
                        </span>
                      </td>
                      <td class="p-3.5">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${badge}">
                          ${c.status}
                        </span>
                      </td>
                      <td class="p-3.5 text-slate-600 max-w-xs">
                        ${c.syllabus_gap_note}
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;

      lucide.createIcons();

      // Render TPO Chart
      SkillCharts.renderTpoReadinessChart('tpo-readiness-chart', tpoData.departments);

    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load TPO dashboard.</div>`;
    }
  },

  // ----------------- 4. ADMIN & AICTE VIEW -----------------
  renderAdmin: async function(container, currentUser) {
    container.innerHTML = `<div class="p-16 text-center text-slate-500"><i class="animate-spin text-3xl text-indigo-600 mb-2 inline-block" data-lucide="loader-2"></i><p>Loading national education data...</p></div>`;
    lucide.createIcons();

    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();

      container.innerHTML = `
        <!-- AICTE Header -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}" class="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="Admin">
              <div>
                <h2 class="text-2xl md:text-3xl font-black text-slate-900">${currentUser.name}</h2>
                <p class="text-sm text-slate-500 font-medium">${currentUser.organization} • ${currentUser.department}</p>
                <div class="flex items-center gap-2 mt-1.5">
                  <span class="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-100 text-indigo-800">
                    National NEP-2020 Implementation Wing
                  </span>
                </div>
              </div>
            </div>

            <div class="text-right">
              <span class="text-xs text-slate-400 uppercase tracking-wider font-bold">National Employability Index</span>
              <div class="text-4xl font-black text-indigo-600">${data.national_index.overall_employability}</div>
              <span class="text-xs text-emerald-600 font-bold">${data.national_index.growth_yoy} vs Last Academic Year</span>
            </div>
          </div>
        </div>

        <!-- Key National Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400">Participating Universities</span>
            <div class="text-3xl font-black text-slate-900 mt-1">${data.national_index.participating_universities}</div>
            <span class="text-[11px] text-slate-500 font-medium">Across 28 States & UTs</span>
          </div>

          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400">Corporate Partners</span>
            <div class="text-3xl font-black text-indigo-600 mt-1">${data.national_index.industry_partners}</div>
            <span class="text-[11px] text-emerald-600 font-bold">Vetted Tech Employers</span>
          </div>

          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400">Internships Facilitated</span>
            <div class="text-3xl font-black text-emerald-600 mt-1">${data.national_index.total_internships_facilitated}</div>
            <span class="text-[11px] text-slate-500 font-medium">Academic Year 2025-26</span>
          </div>

          <div class="glass-panel rounded-2xl p-5 bg-white border border-slate-200">
            <span class="text-xs font-bold text-slate-400">Credential Standard</span>
            <div class="text-3xl font-black text-violet-600 mt-1">W3C / AICTE</div>
            <span class="text-[11px] text-slate-500 font-medium">Verifiable Passport</span>
          </div>
        </div>

        <!-- In-Demand Skill Telemetry & Tier Breakdown -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-6 glass-panel rounded-3xl p-6 bg-white border border-slate-200">
            <h3 class="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <i data-lucide="trending-up" class="w-4 h-4 text-emerald-600"></i> Top Emerging Skill Demands in India (2026)
            </h3>
            <p class="text-xs text-slate-500 mb-4">Real-time hiring signal analysis across IT, FinTech & DeepTech</p>

            <div class="space-y-3">
              ${data.top_in_demand_skills.map(s => `
                <div class="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <h4 class="font-bold text-xs text-slate-900">${s.skill}</h4>
                    <span class="text-[10px] text-slate-500 font-medium">National Demand Growth: <strong class="text-emerald-600">${s.growth}</strong></span>
                  </div>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black ${s.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}">
                    ${s.urgency}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="lg:col-span-6 glass-panel rounded-3xl p-6 bg-white border border-slate-200">
            <h3 class="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
              <i data-lucide="layers" class="w-4 h-4 text-indigo-600"></i> Institutional Tier Employability Breakdown
            </h3>
            <p class="text-xs text-slate-500 mb-4">Bridging the gap between tier 1 and tier 2/3 engineering colleges</p>

            <div class="space-y-4">
              ${data.tier_distribution.map(t => `
                <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                  <div class="flex justify-between items-center mb-2">
                    <span class="font-bold text-xs text-slate-900">${t.tier}</span>
                    <span class="font-black text-sm text-indigo-700">${t.employability}</span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-2.5 mb-2">
                    <div class="bg-indigo-600 h-2.5 rounded-full" style="width: ${t.employability}"></div>
                  </div>
                  <div class="text-[11px] text-slate-500 font-medium">Industry Tie-ups: <strong>${t.active_mous}</strong></div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;

      lucide.createIcons();
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load admin metrics.</div>`;
    }
  }
};
