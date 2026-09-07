/**
 * SkillBridge AI - Portal Views Renderer (SIH Winner Edition)
 * High-fidelity, interactive views for Student, Industry Recruiter, College TPO, and Admin.
 * Resilient design with seamless offline and static hosting fallback data.
 */

window.PortalViews = {
  // ----------------- 1. STUDENT VIEW -----------------
  renderStudent: async function(container, currentUser) {
    const studentId = (currentUser && currentUser.student_id) || 1;
    
    // Default fallback structured data
    let gapData = {
      target_role: "Full Stack Engineer (Cloud & AI)",
      employability_score: 84,
      summary: "High competency in Python and React. Bridging REST API and Docker containerization will increase employability to 96%.",
      radar: {
        labels: ["Python", "FastAPI", "React", "Docker", "SQL", "Machine Learning"],
        student_scores: [85, 60, 75, 35, 80, 45],
        benchmark_scores: [80, 85, 70, 75, 75, 65]
      },
      gaps: [
        {
          skill_id: 3,
          skill_name: "REST API & FastAPI",
          is_core: true,
          student_level: 60,
          benchmark_level: 85,
          gap: 25,
          recommendation: {
            recommended_course: "FastAPI & Microservices Architecture (Coursera)",
            est_hours: "20 Hours",
            project_idea: "Build an asynchronous high-throughput REST API with JWT Auth."
          }
        },
        {
          skill_id: 4,
          skill_name: "Docker & Cloud Native",
          is_core: true,
          student_level: 35,
          benchmark_level: 75,
          gap: 40,
          recommendation: {
            recommended_course: "Docker & Containerization Deep Dive (edX)",
            est_hours: "15 Hours",
            project_idea: "Containerize and deploy a full-stack multi-service web app."
          }
        },
        {
          skill_id: 6,
          skill_name: "Machine Learning & PyTorch",
          is_core: false,
          student_level: 45,
          benchmark_level: 65,
          gap: 20,
          recommendation: {
            recommended_course: "Applied Deep Learning & NLP (NPTEL)",
            est_hours: "30 Hours",
            project_idea: "Train and serve a custom text classification pipeline."
          }
        }
      ]
    };

    let matchData = {
      internships: [
        {
          id: 1,
          title: "Full Stack Developer Intern",
          company_name: "Infosys NextGen",
          location: "Bengaluru (Hybrid)",
          stipend: "₹35,000 / month",
          min_cgpa: "7.5",
          match_score: 92,
          type: "Summer Internship",
          work_mode: "Hybrid",
          deadline: "30 Sep 2026",
          description: "Develop high-scale cloud services and responsive UI components using Python, FastAPI, and React.",
          skills_list: ["Python", "FastAPI", "React", "SQL"],
          application_status: null
        },
        {
          id: 2,
          title: "AI / ML Research Intern",
          company_name: "Tata Consultancy Services",
          location: "Hyderabad",
          stipend: "₹30,000 / month",
          min_cgpa: "8.0",
          match_score: 84,
          type: "Research Internship",
          work_mode: "On-site",
          deadline: "15 Oct 2026",
          description: "Work with research scientists on state-of-the-art NLP model fine-tuning and retrieval-augmented generation.",
          skills_list: ["Python", "PyTorch", "SQL", "NLP"],
          application_status: null
        },
        {
          id: 3,
          title: "Cloud DevOps Associate Intern",
          company_name: "Wipro Technologies",
          location: "Pune (Remote)",
          stipend: "₹28,000 / month",
          min_cgpa: "7.0",
          match_score: 72,
          type: "Internship",
          work_mode: "Remote",
          deadline: "20 Oct 2026",
          description: "Assist cloud engineering teams in building CI/CD deployment pipelines and container clusters.",
          skills_list: ["Docker", "Kubernetes", "CI/CD", "Linux"],
          application_status: null
        }
      ]
    };

    let appsData = {
      applications: [
        {
          id: 1,
          title: "Full Stack Developer Intern",
          company_name: "Infosys NextGen",
          applied_at: new Date().toISOString(),
          match_score: 92,
          status: "Technical Assessment",
          notes: "Resume shortlisted based on verified AICTE Python & React badges. Assessment link dispatched."
        }
      ]
    };

    let rolesData = {
      roles: ["Full Stack Engineer (Cloud & AI)", "AI/ML Engineer", "Cloud DevOps Specialist", "Data Scientist"]
    };

    try {
      const [gapRes, matchRes, appsRes, rolesRes] = await Promise.all([
        fetch(`/api/students/${studentId}/gap-analysis`),
        fetch(`/api/internships/matched/${studentId}`),
        fetch(`/api/applications/student/${studentId}`),
        fetch('/api/roles')
      ]);

      if (gapRes.ok) gapData = await gapRes.json();
      if (matchRes.ok) matchData = await matchRes.json();
      if (appsRes.ok) appsData = await appsRes.json();
      if (rolesRes.ok) rolesData = await rolesRes.json();
    } catch (err) {
      console.warn("Using offline fallback data for Student Portal");
    }

    const userName = (currentUser && currentUser.name) || "Aarav Sharma";
    const userOrg = (currentUser && currentUser.organization) || "IIT Bombay";
    const userDept = (currentUser && currentUser.department) || "B.Tech Computer Science";
    const userCgpa = (currentUser && currentUser.cgpa) || "8.74";
    const userAvatar = (currentUser && currentUser.avatar) || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";

    container.innerHTML = `
      <!-- Profile Banner -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div class="flex items-center gap-5">
            <div class="relative">
              <img src="${userAvatar}" class="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="Student avatar">
              <span class="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white ring-2 ring-white" title="Verified AICTE Student">
                <i data-lucide="check" class="w-3.5 h-3.5"></i>
              </span>
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2 mb-1">
                <h2 class="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">${userName}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <i data-lucide="shield-check" class="w-3.5 h-3.5"></i> NEP-2020 Verified
                </span>
              </div>
              <p class="text-xs md:text-sm text-slate-500 font-medium">
                🏛️ ${userOrg} • ${userDept} • CGPA: <strong class="text-indigo-600">${userCgpa}</strong>
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

      <!-- ⚡ INTERACTIVE LIVE SKILL SIMULATOR -->
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
              <span>🤖 Large Language Models & AI</span>
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

      <!-- Actionable Bridge Roadmaps -->
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
            const currentIdx = stages.indexOf(app.status) !== -1 ? stages.indexOf(app.status) : 1;

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
  },

  // ----------------- 2. INDUSTRY RECRUITER VIEW -----------------
  renderRecruiter: async function(container, currentUser) {
    const recruiterId = (currentUser && currentUser.id) || 3;
    
    let appsData = {
      applications: [
        { id: 1, student_id: 1, name: "Aarav Sharma", applied_role: "Full Stack Developer Intern", college: "IIT Bombay", cgpa: "8.74", match_score: 92, status: "Technical Assessment", applied_at: new Date().toISOString() },
        { id: 2, student_id: 2, name: "Priya Patel", applied_role: "AI / ML Research Intern", college: "NIT Trichy", cgpa: "8.90", match_score: 88, status: "Interview Scheduled", applied_at: new Date().toISOString() },
        { id: 3, student_id: 4, name: "Rohan Verma", applied_role: "Backend Engineer", college: "BITS Pilani", cgpa: "8.45", match_score: 81, status: "Resume Shortlisted", applied_at: new Date().toISOString() }
      ]
    };

    let jobsData = {
      internships: [
        { id: 1, title: "Full Stack Developer Intern", stipend: "₹35,000 / month", location: "Bengaluru", applications_count: 24, status: "Active" }
      ]
    };

    let feedData = {
      feedback: [
        { id: 1, title: "Docker and Microservices Deficit", target_course: "CS302: Operating Systems", company_name: "Infosys NextGen", votes: 42, note: "Graduates understand process scheduling well, but lack practical containerization skills needed on day one." }
      ]
    };

    let capData = {
      capstones: [
        { id: 1, title: "Distributed Consensus Engine with Raft", company_name: "Infosys NextGen", stipend_award: "₹50,000 Award + PPO", registered_teams: 8 }
      ]
    };

    try {
      const [appsRes, jobsRes, feedRes, capRes] = await Promise.all([
        fetch(`/api/applications/recruiter/${recruiterId}`),
        fetch('/api/internships'),
        fetch('/api/curriculum/feedback'),
        fetch('/api/capstones')
      ]);

      if (appsRes.ok) appsData = await appsRes.json();
      if (jobsRes.ok) jobsData = await jobsRes.json();
      if (feedRes.ok) feedData = await feedRes.json();
      if (capRes.ok) capData = await capRes.json();
    } catch (err) {}

    const recName = (currentUser && currentUser.name) || "Vikram Malhotra";
    const recOrg = (currentUser && currentUser.organization) || "Infosys NextGen";
    const recDept = (currentUser && currentUser.department) || "University Talent & AICTE Partner";

    container.innerHTML = `
      <!-- Recruiter Welcome Banner -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${(currentUser && currentUser.avatar) || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}" class="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="Recruiter">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl md:text-3xl font-black text-slate-900">${recName}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Corporate Recruiter
                </span>
              </div>
              <p class="text-sm text-slate-500 font-medium">${recOrg} • ${recDept}</p>
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
                  <td class="p-3.5 font-bold text-slate-900 flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${app.name}
                  </td>
                  <td class="p-3.5">${app.applied_role}</td>
                  <td class="p-3.5 font-medium">${app.college || 'IIT Bombay'} • <strong>${app.cgpa || '8.74'}</strong></td>
                  <td class="p-3.5 text-center">
                    <span class="px-2.5 py-1 rounded-full font-black text-xs ${app.match_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                      ${app.match_score}% Match
                    </span>
                  </td>
                  <td class="p-3.5">
                    <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-800">
                      ${app.status}
                    </span>
                  </td>
                  <td class="p-3.5 text-right">
                    <button onclick="SkillBridgeApp.showToast('Candidate advanced to interview round!', 'success')" class="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] shadow-sm">
                      Advance →
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    lucide.createIcons();
  },

  // ----------------- 3. COLLEGE TPO & DEAN VIEW -----------------
  renderTpo: async function(container, currentUser) {
    let tpoData = {
      metrics: {
        overall_placement_rate: "89.4%",
        avg_ctc: "₹14.2 LPA",
        highest_ctc: "₹52.0 LPA",
        total_registered_students: 840,
        active_corporate_mous: 18,
        active_internships_count: 64
      },
      departments: [
        { name: "Computer Science", readiness: 92, placed: 88 },
        { name: "Information Tech", readiness: 88, placed: 84 },
        { name: "Electronics & Comm", readiness: 76, placed: 72 },
        { name: "Mechanical Eng", readiness: 68, placed: 64 }
      ]
    };

    let auditData = {
      average_alignment_score: 82,
      outdated_modules_count: 3,
      curriculum_topics: [
        { course_code: "CS302", course_name: "Operating Systems & Concurrency", semester: 5, mapped_skill_name: "Process Scheduling & Threads", industry_alignment_score: 90, status: "Aligned", syllabus_gap_note: "Core concepts strong. Recommend adding eBPF and Linux cgroups containerization." },
        { course_code: "CS401", course_name: "Web Technologies & Distributed Systems", semester: 7, mapped_skill_name: "REST APIs & Asynchronous Web", industry_alignment_score: 65, status: "Needs Update", syllabus_gap_note: "Syllabus focused on SOAP/XML. Needs modernization with FastAPI, GraphQL, and OAuth2." },
        { course_code: "CS408", course_name: "Legacy Monolithic Architecture", semester: 8, mapped_skill_name: "System Design", industry_alignment_score: 40, status: "Obsolete", syllabus_gap_note: "Syllabus teaches legacy CORBA. Industry demands microservices, event-driven Kafka, and cloud native containers." }
      ]
    };

    let riskData = {
      at_risk_students: [
        { name: "Vikram Singh", branch: "ECE (Final Year)", cgpa: "6.82", readiness_index: 52, primary_gap: "Data Structures & Modern Python", recommended_intervention: "Fast-track 4-week Python & Algo Bootcamp" },
        { name: "Neha Joshi", branch: "Mechanical", cgpa: "7.10", readiness_index: 58, primary_gap: "SQL Databases & REST APIs", recommended_intervention: "Enroll in Industry Sponsored Full-Stack Capstone" },
        { name: "Arjun Mehta", branch: "Civil Eng", cgpa: "6.95", readiness_index: 48, primary_gap: "Cloud Computing Basics", recommended_intervention: "Assign Faculty Mentor for AICTE AWS Certificate" }
      ]
    };

    try {
      const [tpoRes, auditRes, riskRes] = await Promise.all([
        fetch('/api/tpo/analytics'),
        fetch('/api/curriculum/audit'),
        fetch('/api/tpo/risk-analysis')
      ]);

      if (tpoRes.ok) tpoData = await tpoRes.json();
      if (auditRes.ok) auditData = await auditRes.json();
      if (riskRes.ok) riskData = await riskRes.json();
    } catch (err) {}

    const tpoName = (currentUser && currentUser.name) || "Dr. Sunita Rao";
    const tpoOrg = (currentUser && currentUser.organization) || "IIT Bombay";
    const tpoDept = (currentUser && currentUser.department) || "Training & Placement Cell";

    container.innerHTML = `
      <!-- Institutional Header -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${(currentUser && currentUser.avatar) || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'}" class="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="TPO">
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-900">${tpoName}</h2>
              <p class="text-sm text-slate-500 font-medium">${tpoOrg} • ${tpoDept}</p>
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
  },

  // ----------------- 4. ADMIN & AICTE VIEW -----------------
  renderAdmin: async function(container, currentUser) {
    let data = {
      national_index: {
        overall_employability: "78.4%",
        growth_yoy: "+6.8%",
        participating_universities: "1,420",
        industry_partners: "680+",
        total_internships_facilitated: "48,200"
      },
      top_in_demand_skills: [
        { skill: "Cloud Native & Microservices (FastAPI, Docker)", growth: "+42%", urgency: "Critical" },
        { skill: "AI, Large Language Models & RAG Systems", growth: "+68%", urgency: "Critical" },
        { skill: "Full Stack React & Distributed Systems", growth: "+31%", urgency: "High" }
      ],
      tier_distribution: [
        { tier: "Tier 1 Institutions (IITs, NITs, IIITs)", employability: "91.2%", active_mous: "120+ Corporate MoUs" },
        { tier: "Tier 2 State & Autonomous Colleges", employability: "74.6%", active_mous: "85+ Corporate MoUs" },
        { tier: "Tier 3 Affiliated Engineering Colleges", employability: "58.1%", active_mous: "45+ Remediation MoUs" }
      ]
    };

    try {
      const res = await fetch('/api/admin/metrics');
      if (res.ok) data = await res.json();
    } catch (err) {}

    const adminName = (currentUser && currentUser.name) || "SIH Evaluator Panel";
    const adminOrg = (currentUser && currentUser.organization) || "Ministry of Education / AICTE";
    const adminDept = (currentUser && currentUser.department) || "National Skill Registry & NEP-2020";

    container.innerHTML = `
      <!-- AICTE Header -->
      <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <img src="${(currentUser && currentUser.avatar) || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'}" class="w-18 h-18 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" alt="Admin">
            <div>
              <h2 class="text-2xl md:text-3xl font-black text-slate-900">${adminName}</h2>
              <p class="text-sm text-slate-500 font-medium">${adminOrg} • ${adminDept}</p>
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
  }
};
