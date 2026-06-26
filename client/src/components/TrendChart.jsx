import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function TrendChart({ trend }) {
  if (!trend || trend.length === 0) return null;

  const data = trend.map(t => ({
    month: t.month,
    "Participation %": Number((t.participationRate * 100).toFixed(1)),
    "Attendance %": Number((t.attendanceRate * 100).toFixed(1)),
    "Evidence %": Number((t.evidenceRate * 100).toFixed(1)),
  }));

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <p className="text-sm font-semibold mb-3">Monthly Trend</p>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis unit="%" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Participation %" stroke="#2563eb" strokeWidth={2} />
          <Line type="monotone" dataKey="Attendance %" stroke="#16a34a" strokeWidth={2} />
          <Line type="monotone" dataKey="Evidence %" stroke="#d97706" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}