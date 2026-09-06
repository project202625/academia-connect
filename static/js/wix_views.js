/**
 * SkillBridge AI - Wix Views Renderer
 * Matches exact design, copy, sections, and forms from:
 * https://vedhagariga896.wixsite.com/skillbridge
 */

window.WixViews = {
  // 1. HOME / LANDING PAGE
  renderHome: function(container) {
    container.innerHTML = `
      <!-- Hero Section -->
      <div class="glass-panel rounded-3xl p-8 md:p-14 mb-10 bg-white border border-slate-200 text-center relative overflow-hidden">
        <div class="max-w-3xl mx-auto">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-200 mb-6">
            🎓 ACADEMIA - INDUSTRY PLATFORM
          </span>
          <h1 class="text-3xl md:text-5xl font-display font-black text-slate-900 tracking-tight leading-tight mb-4">
            Connecting Students, Colleges &amp; Industry Through Skills
          </h1>
          <p class="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-8">
            Empowering the next generation of talent by bridging the gap between academic potential and industry demand.
          </p>
          <div class="flex flex-wrap items-center justify-center gap-4">
            <button onclick="SkillBridgeApp.navigateTo('student-dashboard')" class="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition">
              Get Started as Student →
            </button>
            <button onclick="SkillBridgeApp.navigateTo('company-dashboard')" class="px-6 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm transition">
              Post an Opportunity
            </button>
          </div>
        </div>
      </div>

      <!-- Our Mission -->
      <div class="glass-panel rounded-3xl p-8 mb-10 bg-slate-900 text-white">
        <div class="max-w-3xl mx-auto text-center">
          <span class="text-xs font-black uppercase tracking-wider text-indigo-400 block mb-2">Connecting Academia to Industry</span>
          <h2 class="text-2xl md:text-3xl font-bold font-display mb-4">Our Mission</h2>
          <p class="text-slate-300 text-sm md:text-base leading-relaxed">
            SkillBridge serves as the critical bridge between academic theory and industry practice. We empower students to identify skill gaps, access targeted learning resources, and secure internships that align perfectly with their career aspirations.
          </p>
        </div>
      </div>

      <!-- 3 Stakeholder Cards -->
      <div class="mb-12">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-black font-display text-slate-900">Connect with SkillBridge</h2>
          <p class="text-xs text-slate-500 font-medium mt-1">Dedicated portals for every stakeholder in the education-employment ecosystem</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Students Card -->
          <div class="glass-panel rounded-3xl p-6 bg-white border border-slate-200 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <i data-lucide="graduation-cap" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-lg text-slate-900 mb-2">Students</h3>
              <p class="text-xs text-slate-600 leading-relaxed mb-6">
                Identify your skill gaps, learn the missing skills, and find the perfect internship or job match with AI recommendations.
              </p>
            </div>
            <button onclick="SkillBridgeApp.navigateTo('student-dashboard')" class="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition">
              Get Started →
            </button>
          </div>

          <!-- Companies Card -->
          <div class="glass-panel rounded-3xl p-6 bg-white border border-slate-200 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                <i data-lucide="building-2" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-lg text-slate-900 mb-2">Companies</h3>
              <p class="text-xs text-slate-600 leading-relaxed mb-6">
                Post jobs, find top talent, and streamline your recruitment process with our advanced candidate matching and skill analysis tools.
              </p>
            </div>
            <button onclick="SkillBridgeApp.navigateTo('company-dashboard')" class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition">
              Post a Job →
            </button>
          </div>

          <!-- Colleges Card -->
          <div class="glass-panel rounded-3xl p-6 bg-white border border-slate-200 flex flex-col justify-between hover:shadow-lg transition">
            <div>
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <i data-lucide="school" class="w-6 h-6"></i>
              </div>
              <h3 class="font-bold text-lg text-slate-900 mb-2">Colleges</h3>
              <p class="text-xs text-slate-600 leading-relaxed mb-6">
                Track student progress, identify skill gaps, and boost placement rates with comprehensive reports and industry-aligned training programs.
              </p>
            </div>
            <button onclick="SkillBridgeApp.navigateTo('college-dashboard')" class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition">
              View Reports →
            </button>
          </div>
        </div>
      </div>

      <!-- Core Platform Features -->
      <div class="glass-panel rounded-3xl p-8 mb-12 bg-white border border-slate-200">
        <h2 class="text-xl font-bold font-display text-slate-900 mb-6 text-center">Core Platform Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 class="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <i data-lucide="check-circle-2" class="w-4 h-4 text-indigo-600"></i> Smart Skill Assessment
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Evaluate your technical abilities with our interactive online assessment system designed for accuracy and speed.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 class="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <i data-lucide="target" class="w-4 h-4 text-emerald-600"></i> Gap Analysis Engine
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Identify exactly which skills you're missing by comparing your current profile against industry-standard requirements.
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
            <h4 class="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <i data-lucide="compass" class="w-4 h-4 text-amber-500"></i> AI Learning Path
            </h4>
            <p class="text-xs text-slate-600 leading-relaxed">
              Get personalized learning resources and project suggestions tailored to your specific skill development goals.
            </p>
          </div>
        </div>
      </div>

      <!-- How It Works (5-Step Process) -->
      <div class="glass-panel rounded-3xl p-8 mb-12 bg-white border border-slate-200">
        <div class="text-center mb-8">
          <h2 class="text-2xl font-black font-display text-slate-900">How It Works</h2>
          <p class="text-xs text-slate-500 font-medium">A seamless 5-step journey from classroom to career</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span class="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs inline-flex items-center justify-center mb-3">1</span>
            <h4 class="font-bold text-xs text-slate-900 mb-1.5">Profile Creation</h4>
            <p class="text-[11px] text-slate-600 leading-relaxed">Start by creating a comprehensive profile that highlights your academic background, skills, and projects.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span class="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs inline-flex items-center justify-center mb-3">2</span>
            <h4 class="font-bold text-xs text-slate-900 mb-1.5">Skill Assessment</h4>
            <p class="text-[11px] text-slate-600 leading-relaxed">Take our interactive assessment to evaluate your current technical and soft skills against industry benchmarks.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span class="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs inline-flex items-center justify-center mb-3">3</span>
            <h4 class="font-bold text-xs text-slate-900 mb-1.5">Gap Analysis</h4>
            <p class="text-[11px] text-slate-600 leading-relaxed">Our AI identifies your skill gaps and provides a clear visual report on which areas need immediate focus.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span class="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs inline-flex items-center justify-center mb-3">4</span>
            <h4 class="font-bold text-xs text-slate-900 mb-1.5">AI Recommendations</h4>
            <p class="text-[11px] text-slate-600 leading-relaxed">Access curated learning resources, courses, and projects recommended by our AI to bridge your skill gaps.</p>
          </div>

          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span class="w-8 h-8 rounded-full bg-indigo-600 text-white font-black text-xs inline-flex items-center justify-center mb-3">5</span>
            <h4 class="font-bold text-xs text-slate-900 mb-1.5">Job Matching</h4>
            <p class="text-[11px] text-slate-600 leading-relaxed">Finally, connect with companies and find internships or jobs that perfectly match your profile and skills.</p>
          </div>
        </div>
      </div>
    `;
    lucide.createIcons();
  },

  // 2. STUDENT DASHBOARD (matching https://vedhagariga896.wixsite.com/skillbridge/student-dashboard)
  renderStudentDashboard: async function(container) {
    container.innerHTML = `<div class="p-16 text-center text-slate-400"><i class="animate-spin text-3xl text-indigo-600 inline-block mb-3" data-lucide="loader-2"></i><p>Loading Student Dashboard from Backend...</p></div>`;
    lucide.createIcons();

    try {
      const res = await fetch('/api/wix/student/dashboard');
      const data = await res.json();

      container.innerHTML = `
        <!-- Student Header -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="${data.profile.avatar}" class="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-100" alt="Avatar">
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-2xl font-black text-slate-900">${data.profile.name}</h2>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Verified</span>
              </div>
              <p class="text-xs text-slate-500 font-medium">${data.profile.major} • Roll No: ${data.profile.roll_no}</p>
            </div>
          </div>

          <div class="flex items-center gap-4 bg-slate-50 p-3 px-5 rounded-2xl border border-slate-200">
            <div>
              <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider">Profile Completion</div>
              <div class="text-2xl font-black text-indigo-600">${data.profile.profile_completion}%</div>
            </div>
            <div class="w-20 bg-slate-200 rounded-full h-2">
              <div class="bg-indigo-600 h-2 rounded-full" style="width: ${data.profile.profile_completion}%"></div>
            </div>
          </div>
        </div>

        <!-- Skill Gap Analysis Section -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="mb-4">
            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="activity" class="w-5 h-5 text-indigo-600"></i> Skill Gap Analysis
            </h3>
            <p class="text-xs text-slate-500">
              Identify the specific technical and soft skills you need to bridge the gap between your current profile and the industry requirements for your target role.
            </p>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            ${data.skill_gaps.map(sg => {
              const isAvail = sg.status === 'Available';
              return `
                <div class="p-4 rounded-2xl border ${isAvail ? 'bg-emerald-50/60 border-emerald-200' : 'bg-red-50/60 border-red-200'}">
                  <div class="flex justify-between items-start mb-2">
                    <span class="font-bold text-sm text-slate-900">${sg.skill}</span>
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black ${isAvail ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'}">
                      ${sg.status}
                    </span>
                  </div>
                  <div class="w-full bg-slate-200 rounded-full h-1.5 mb-1.5">
                    <div class="${isAvail ? 'bg-emerald-600' : 'bg-red-500'} h-1.5 rounded-full" style="width: ${sg.proficiency}%"></div>
                  </div>
                  <span class="text-[10px] text-slate-500">Proficiency: ${sg.proficiency}%</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- AI Learning Path Section -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="mb-4">
            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="compass" class="w-5 h-5 text-amber-500"></i> AI Learning Path
            </h3>
            <p class="text-xs text-slate-500">
              Our AI engine has identified the most efficient learning resources to master your missing skills and prepare for your next career step.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            ${data.learning_path.map(lp => `
              <div class="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <span class="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">${lp.platform}</span>
                  <h4 class="font-bold text-xs text-slate-900 mt-2 mb-1">${lp.title}</h4>
                  <p class="text-[11px] text-slate-500 mb-4">Target: ${lp.skill} • Est: ${lp.est_time}</p>
                </div>
                <a href="${lp.link}" target="_blank" class="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-indigo-400 text-slate-800 text-xs font-bold text-center transition">
                  Explore Course ↗
                </a>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Opportunities & Applications Section -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
                <i data-lucide="briefcase" class="w-5 h-5 text-indigo-600"></i> Opportunities &amp; Applications
              </h3>
              <p class="text-xs text-slate-500">Curated opportunities matched against your verified skills</p>
            </div>
            <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">View All</span>
          </div>

          <div class="space-y-3">
            ${data.opportunities.map(opp => `
              <div class="p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div class="flex items-center gap-2 mb-1">
                    <h4 class="font-bold text-sm text-slate-900">${opp.job_title}</h4>
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-black ${opp.match_score >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}">
                      ${opp.match_score}% Match
                    </span>
                  </div>
                  <p class="text-xs text-slate-600">🏢 ${opp.company_name} • 📍 ${opp.location} • Required: ${opp.required_skills}</p>
                </div>
                <button onclick="WixViews.handleStudentApply(${opp.id}, '${opp.job_title}', ${opp.match_score})" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition">
                  Apply Now →
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load student dashboard.</div>`;
    }
  },

  handleStudentApply: async function(jobId, title, matchScore) {
    try {
      const res = await fetch('/api/wix/student/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          student_name: "Vedha Gariga",
          student_email: "student@skillbridge.io",
          match_score: matchScore
        })
      });
      const data = await res.json();
      SkillBridgeApp.showToast(data.message || `Applied for ${title}!`, "success");
    } catch (err) {
      console.error(err);
      SkillBridgeApp.showToast("Application failed", "error");
    }
  },

  // 3. COMPANY DASHBOARD (matching https://vedhagariga896.wixsite.com/skillbridge/company-dashboard)
  renderCompanyDashboard: async function(container) {
    container.innerHTML = `<div class="p-16 text-center text-slate-400"><i class="animate-spin text-3xl text-indigo-600 inline-block mb-3" data-lucide="loader-2"></i><p>Loading Company Dashboard from Backend...</p></div>`;
    lucide.createIcons();

    try {
      const res = await fetch('/api/wix/company/applicants');
      const data = await res.json();

      container.innerHTML = `
        <!-- Post Your Opportunity Section -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="mb-6">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="plus-circle" class="w-5 h-5 text-indigo-600"></i> Post Your Opportunity
            </h2>
            <p class="text-xs text-slate-500">
              Connect with students and colleges by sharing your job or internship requirements. We'll match your candidates based on their skills.
            </p>
          </div>

          <form onsubmit="WixViews.handlePublishOpportunity(event)" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Full name</label>
                <input id="wix-form-name" type="text" placeholder="e.g. Talent Lead" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Company email</label>
                <input id="wix-form-email" type="email" placeholder="e.g. hr@abctech.com" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Job title</label>
                <input id="wix-form-title" type="text" placeholder="e.g. Software Developer Intern" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Industry</label>
                <input id="wix-form-industry" type="text" placeholder="e.g. Software Engineering" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Location</label>
                <input id="wix-form-location" type="text" placeholder="e.g. Bengaluru (Hybrid)" required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Job type</label>
              <select id="wix-form-type" class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
                <option value="Internship">Internship</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Required skills</label>
              <div class="flex flex-wrap gap-2 text-xs" id="wix-skills-chips">
                ${['Project Management', 'Communication', 'Leadership', 'Data Analysis', 'Design', 'Marketing', 'Sales', 'Engineering', 'Python', 'React', 'REST API'].map(skill => `
                  <label class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-slate-50 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition">
                    <input type="checkbox" value="${skill}" class="accent-indigo-600">
                    <span>${skill}</span>
                  </label>
                `).join('')}
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Job description</label>
              <textarea id="wix-form-desc" rows="3" placeholder="Outline the role responsibilities and qualifications..." required class="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"></textarea>
            </div>

            <button type="submit" class="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition">
              Publish Opportunity →
            </button>
          </form>
        </div>

        <!-- Applicant Management Section -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200">
          <div class="mb-4">
            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="users" class="w-5 h-5 text-indigo-600"></i> Applicant Management
            </h3>
            <p class="text-xs text-slate-500">
              Review and shortlist candidates based on their skill match percentage for your latest openings.
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            ${data.applicants.map(app => `
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h4 class="font-bold text-sm text-slate-900">${app.name}</h4>
                  <p class="text-[11px] text-slate-500 mb-2">${app.applied_role}</p>
                  <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 mb-3">
                    ${app.match_score}% Match
                  </span>
                </div>
                <button onclick="WixViews.updateStatus(${app.id}, 'Shortlisted')" class="w-full py-2 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-xs hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 transition">
                  ${app.status} ✓
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load company dashboard.</div>`;
    }
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
      const data = await res.json();
      SkillBridgeApp.showToast(data.message || "Opportunity published successfully!", "success");
      WixViews.renderCompanyDashboard(document.getElementById('view-container'));
    } catch (err) {
      console.error(err);
      SkillBridgeApp.showToast("Failed to publish opportunity", "error");
    }
  },

  updateStatus: async function(applicantId, newStatus) {
    try {
      await fetch('/api/wix/company/applicant-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicant_id: applicantId, status: newStatus })
      });
      SkillBridgeApp.showToast(`Candidate status set to ${newStatus}`, "info");
    } catch (err) {
      console.error(err);
    }
  },

  // 4. COLLEGE DASHBOARD (matching https://vedhagariga896.wixsite.com/skillbridge/college-dashboard)
  renderCollegeDashboard: async function(container) {
    container.innerHTML = `<div class="p-16 text-center text-slate-400"><i class="animate-spin text-3xl text-indigo-600 inline-block mb-3" data-lucide="loader-2"></i><p>Loading College Analytics from Backend...</p></div>`;
    lucide.createIcons();

    try {
      const res = await fetch('/api/wix/college/analytics');
      const data = await res.json();

      container.innerHTML = `
        <!-- Placement Analytics -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 mb-8 bg-white border border-slate-200">
          <div class="mb-6">
            <h2 class="text-xl font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="bar-chart-2" class="w-5 h-5 text-indigo-600"></i> Placement Analytics
            </h2>
            <p class="text-xs text-slate-500">
              Real-time data on student readiness and industry alignment across our global network.
            </p>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Students Assessed</span>
              <div class="text-3xl font-black text-slate-900 mt-1">${data.metrics.students_assessed}</div>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Placement Ready</span>
              <div class="text-3xl font-black text-emerald-600 mt-1">${data.metrics.placement_ready}</div>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Skill Gaps</span>
              <div class="text-2xl font-black text-amber-500 mt-1">${data.metrics.top_skill_gap}</div>
            </div>

            <div class="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">Internship Matches</span>
              <div class="text-3xl font-black text-indigo-600 mt-1">${data.metrics.internship_matches}</div>
            </div>
          </div>
        </div>

        <!-- Top Skill Gaps -->
        <div class="glass-panel rounded-3xl p-6 md:p-8 bg-white border border-slate-200">
          <div class="mb-4">
            <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">
              <i data-lucide="alert-circle" class="w-5 h-5 text-amber-500"></i> Top Skill Gaps
            </h3>
            <p class="text-xs text-slate-500">
              Identify the most critical skills your peers are missing to bridge the gap between academia and industry.
            </p>
          </div>

          <div class="space-y-4">
            ${data.skill_gaps.map(sg => `
              <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50">
                <div class="flex justify-between items-center mb-1.5">
                  <span class="font-bold text-sm text-slate-900">${sg.skill}</span>
                  <span class="text-xs font-bold text-indigo-600">${sg.students_affected} Students Affected (${sg.percentage}%)</span>
                </div>
                <div class="w-full bg-slate-200 rounded-full h-2 mb-2">
                  <div class="bg-indigo-600 h-2 rounded-full" style="width: ${sg.percentage}%"></div>
                </div>
                <p class="text-xs text-slate-500">${sg.description}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      lucide.createIcons();
    } catch (err) {
      console.error(err);
      container.innerHTML = `<div class="p-8 text-center text-red-500">Failed to load college analytics.</div>`;
    }
  }
};
