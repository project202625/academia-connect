/**
 * SkillBridge AI - Wix Velo Integration Code
 * Copy and paste these snippets into Wix Editor Dev Mode (Velo) to connect 
 * https://vedhagariga896.wixsite.com/skillbridge directly to your FastAPI backend!
 */

// =========================================================================
// 1. Wix Backend Web Module: backend/skillbridgeService.jsw
// =========================================================================
/*
import { fetch } from 'wix-fetch';

// Replace with your public deployed backend URL or ngrok tunnel (e.g., https://your-domain.com or http://127.0.0.1:8000)
const BACKEND_BASE_URL = "http://127.0.0.1:8000";

// 1. Fetch Student Dashboard data (Skill Gaps, AI Learning Path, Opportunities)
export async function getStudentDashboard() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/wix/student/dashboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (err) {
    console.error("Failed to load student dashboard from SkillBridge backend:", err);
    return null;
  }
}

// 2. Student 1-Click Apply for Job
export async function applyForOpportunity(jobId, studentName, studentEmail, matchScore) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/wix/student/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: jobId,
        student_name: studentName,
        student_email: studentEmail,
        match_score: matchScore
      })
    });
    return await response.json();
  } catch (err) {
    console.error("Application submission failed:", err);
    return { status: "error", message: err.message };
  }
}

// 3. Company: Post Your Opportunity form submission
export async function publishOpportunity(opportunityData) {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/wix/publish-opportunity`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opportunityData)
    });
    return await response.json();
  } catch (err) {
    console.error("Publish opportunity failed:", err);
    return { status: "error", message: err.message };
  }
}

// 4. Company: Get Applicant Management list
export async function getCompanyApplicants() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/wix/company/applicants`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (err) {
    console.error("Failed to fetch applicants:", err);
    return null;
  }
}

// 5. College: Get Placement Analytics & Top Skill Gaps
export async function getCollegeAnalytics() {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/api/wix/college/analytics`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  } catch (err) {
    console.error("Failed to load college analytics:", err);
    return null;
  }
}
*/

// =========================================================================
// 2. Wix Page Code for: student-dashboard
// =========================================================================
/*
import { getStudentDashboard, applyForOpportunity } from 'backend/skillbridgeService';

$w.onReady(async function () {
  const data = await getStudentDashboard();
  if (!data) return;

  // Set Profile info
  $w('#studentNameText').text = data.profile.name;
  $w('#majorText').text = data.profile.major;
  $w('#profileCompletionText').text = `${data.profile.profile_completion}%`;

  // Bind Opportunities Repeater
  $w('#opportunitiesRepeater').data = data.opportunities.map(item => ({
    _id: String(item.id),
    ...item
  }));

  $w('#opportunitiesRepeater').onItemReady(($item, itemData) => {
    $item('#jobTitleText').text = itemData.job_title;
    $item('#companyNameText').text = itemData.company_name;
    $item('#matchScoreText').text = `${itemData.match_score}% Match`;

    $item('#applyButton').onClick(async () => {
      $item('#applyButton').label = "Applying...";
      const result = await applyForOpportunity(itemData.id, data.profile.name, "student@skillbridge.io", itemData.match_score);
      $item('#applyButton').label = "Applied ✓";
      $item('#applyButton').disable();
    });
  });
});
*/

// =========================================================================
// 3. Wix Page Code for: company-dashboard
// =========================================================================
/*
import { publishOpportunity, getCompanyApplicants } from 'backend/skillbridgeService';

$w.onReady(async function () {
  // Load initial applicants
  const applicantData = await getCompanyApplicants();
  if (applicantData && applicantData.applicants) {
    $w('#applicantsRepeater').data = applicantData.applicants.map(a => ({ _id: String(a.id), ...a }));
    $w('#applicantsRepeater').onItemReady(($item, itemData) => {
      $item('#applicantNameText').text = itemData.name;
      $item('#applicantRoleText').text = itemData.applied_role;
      $item('#applicantMatchText').text = `${itemData.match_score}% Match`;
      $item('#statusBadge').text = itemData.status;
    });
  }

  // Handle Post Opportunity submit
  $w('#publishOpportunityButton').onClick(async () => {
    const payload = {
      full_name: $w('#fullNameInput').value,
      company_email: $w('#emailInput').value,
      job_title: $w('#jobTitleInput').value,
      industry: $w('#industryInput').value,
      location: $w('#locationInput').value,
      job_type: $w('#jobTypeDropdown').value,
      required_skills: ["Python", "REST API", "Git"],
      job_description: $w('#descriptionInput').value
    };

    $w('#publishOpportunityButton').label = "Publishing...";
    const res = await publishOpportunity(payload);
    if (res.status === "success") {
      $w('#successMessageText').text = "Opportunity Published & Matched with Students!";
      $w('#successMessageText').show();
      $w('#publishOpportunityButton').label = "Published ✓";
    }
  });
});
*/

// =========================================================================
// 4. Wix Page Code for: college-dashboard
// =========================================================================
/*
import { getCollegeAnalytics } from 'backend/skillbridgeService';

$w.onReady(async function () {
  const data = await getCollegeAnalytics();
  if (!data) return;

  $w('#studentsAssessedCount').text = data.metrics.students_assessed;
  $w('#placementReadyCount').text = data.metrics.placement_ready;
  $w('#topSkillGapText').text = data.metrics.top_skill_gap;
  $w('#internshipMatchesCount').text = data.metrics.internship_matches;
});
*/
