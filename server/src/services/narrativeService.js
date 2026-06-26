import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

// Builds a clean, factual prompt from the deterministic fact panel.
// The model is given ONLY pre-computed numbers — it cannot invent or recalculate anything.
function buildPrompt(factPanel) {
  const { grant, reportingMonth, performance, liveComputedFromPrimaryData, finance } = factPanel;

  const financeSummary = finance
    .map(f => `- ${f.budgetLine}: ${(f.cumulativeUtilizationRate * 100).toFixed(1)}% of approved budget utilized so far`)
    .join("\n");

  return `You are writing a short donor-facing progress report paragraph for an education grant.
Use ONLY the facts below. Do not invent numbers, dates, or claims not present here.
Keep it to 4-6 sentences, professional, factual tone, no exaggeration.

Grant: ${grant.grantName} (${grant.donor})
Reporting month: ${reportingMonth}
Covered districts: ${grant.coveredDistricts.join(", ")}

Performance facts:
- PBL completion rate: ${(performance.metrics.pblCompletionRate * 100).toFixed(1)}%
- Evidence submission rate: ${(performance.metrics.evidenceSubmissionRate * 100).toFixed(1)}%
- Attendance rate: ${(liveComputedFromPrimaryData.attendanceRate * 100).toFixed(1)}%
- Risk status: ${performance.riskStatus}
- Milestone summary: ${performance.milestoneSummary}

Budget utilization:
${financeSummary}

Write the paragraph now.`;
}

// Clean, deterministic fallback — used when AI is disabled or fails.
// Uses the SAME facts, just template-based instead of model-generated.
function buildTemplateNarrative(factPanel) {
  const { grant, reportingMonth, performance, liveComputedFromPrimaryData } = factPanel;
  const completion = (performance.metrics.pblCompletionRate * 100).toFixed(1);
  const evidence = (performance.metrics.evidenceSubmissionRate * 100).toFixed(1);
  const attendance = (liveComputedFromPrimaryData.attendanceRate * 100).toFixed(1);

  return `In ${reportingMonth}, ${grant.grantName} (${grant.donor}) reported a PBL completion rate of ${completion}% and an evidence submission rate of ${evidence}% across ${grant.coveredDistricts.join(", ")}. The attendance rate stood at ${attendance}%, placing the grant's overall status at "${performance.riskStatus}". ${performance.milestoneSummary}`;
}

// Main entry point. aiEnabled=false (or missing API key) → template fallback, same shape either way.
export async function generateGrantNarrative(factPanel, aiEnabled) {
  if (!aiEnabled || !genAI) {
    return { narrative: buildTemplateNarrative(factPanel), source: "template" };
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildPrompt(factPanel);
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    return { narrative: text.trim(), source: "ai" };
  } catch (err) {
    console.error("Gemini call failed, falling back to template:", err.message);
    return { narrative: buildTemplateNarrative(factPanel), source: "template_fallback" };
  }
}