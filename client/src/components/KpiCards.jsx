export default function KpiCards({ summary, trend }) {
  if (!summary) return null;

  // delta = current month vs previous month, for the 2 required MoM metrics
  const delta = computeDelta(trend, summary);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card title="Total Schools" value={summary.totalSchools} />
      <Card title="Participation Rate" value={pct(summary.participationRate)} deltaPct={delta.participationRate} />
      <Card title="Evidence Submitted" value={pct(summary.evidenceRate)} />
      <Card title="Attendance Rate" value={pct(summary.attendanceRate)} deltaPct={delta.attendanceRate} />
    </div>
  );
}

function Card({ title, value, deltaPct }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {deltaPct !== undefined && (
        <p className={`text-xs mt-1 ${deltaPct >= 0 ? "text-green-600" : "text-red-600"}`}>
          {deltaPct >= 0 ? "▲" : "▼"} {Math.abs(deltaPct).toFixed(1)}% vs last month
        </p>
      )}
    </div>
  );
}

function pct(val) {
  return `${(val * 100).toFixed(1)}%`;
}

function computeDelta(trend, summary) {
  if (!trend || trend.length < 2) return {};
  // find current month's index in trend, compare to previous index
  const idx = trend.findIndex(t => Math.abs(t.attendanceRate - summary.attendanceRate) < 0.0001);
  if (idx <= 0) return {};
  const curr = trend[idx];
  const prev = trend[idx - 1];
  return {
    participationRate: ((curr.participationRate - prev.participationRate) / prev.participationRate) * 100,
    attendanceRate: ((curr.attendanceRate - prev.attendanceRate) / prev.attendanceRate) * 100,
  };
}