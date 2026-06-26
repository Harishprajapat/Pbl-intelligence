import { useState } from "react";
import { generateNarrative } from "../api/grants";

export default function NarrativeBox({ grantId, month }) {
  const [aiEnabled, setAiEnabled] = useState(true);
  const [narrative, setNarrative] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const result = await generateNarrative(grantId, month, aiEnabled);
    setNarrative(result);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold">Report Narrative</p>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={aiEnabled} onChange={(e) => setAiEnabled(e.target.checked)} />
            AI enabled
          </label>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 text-white text-sm px-4 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Report"}
          </button>
        </div>
      </div>

      {narrative && (
        <div>
          <p className="text-sm leading-relaxed text-gray-700">{narrative.narrative}</p>
          <p className="text-xs text-gray-400 mt-2">
            Source: {narrative.source === "ai" ? "AI generated" : narrative.source === "template_fallback" ? "Template (AI fallback — call failed)" : "Template (AI disabled)"}
          </p>
        </div>
      )}
    </div>
  );
}