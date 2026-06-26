const riskColor = {
  "On Track": "bg-green-100 text-green-700",
  "Behind": "bg-yellow-100 text-yellow-700",
  "At Risk": "bg-orange-100 text-orange-700",
  "Critical": "bg-red-100 text-red-700",
};

export default function FactPanel({ report }) {
  if (!report) return null;
  const { grant, reportingMonth, performance, finance, liveComputedFromPrimaryData } = report;

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="font-semibold text-lg">{grant.grantName}</h2>
          <p className="text-sm text-gray-500">{grant.donor} · {reportingMonth} · {grant.coveredDistricts.join(", ")}</p>
        </div>
        {performance && (
          <span className={`text-xs px-3 py-1 rounded ${riskColor[performance.riskStatus]}`}>
            {performance.riskStatus}
          </span>
        )}
      </div>

      {performance && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
          <Stat label="PBL Completion" value={pct(performance.metrics.pblCompletionRate)} />
          <Stat label="Evidence Submitted" value={pct(performance.metrics.evidenceSubmissionRate)} />
          <Stat label="Attendance (live)" value={pct(liveComputedFromPrimaryData?.attendanceRate)} />
          <Stat label="Schools Sampled" value={performance.metrics.sampledSchoolRecords} />
        </div>
      )}

      <p className="text-xs text-gray-500 mb-2">Budget Utilization (cumulative)</p>
      <div className="space-y-2 mb-2">
        {finance.map((f) => (
          <div key={f.budgetLine} className="flex items-center gap-3">
            <span className="text-sm w-48 truncate">{f.budgetLine}</span>
            <div className="flex-1 bg-gray-100 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${Math.min(f.cumulativeUtilizationRate * 100, 100)}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 w-12 text-right">{(f.cumulativeUtilizationRate * 100).toFixed(0)}%</span>
          </div>
        ))}
      </div>

      {performance && (
        <p className="text-xs text-gray-400 mt-3">{performance.milestoneSummary}</p>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function pct(val) {
  if (val === undefined || val === null) return "—";
  return `${(val * 100).toFixed(1)}%`;
}