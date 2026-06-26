export default function GrantSelector({ grants, months, selectedGrant, selectedMonth, onGrantChange, onMonthChange }) {
  return (
    <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow mb-6">
      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Grant</label>
        <select
          value={selectedGrant || ""}
          onChange={(e) => onGrantChange(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm min-w-[220px]"
        >
          <option value="">Select a grant</option>
          {grants.map((g) => (
            <option key={g.grantId} value={g.grantId}>{g.grantName} ({g.donor})</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-500 mb-1">Reporting Month</label>
        <select
          value={selectedMonth || ""}
          onChange={(e) => onMonthChange(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm min-w-[150px]"
          disabled={!selectedGrant}
        >
          <option value="">Select a month</option>
          {months.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>
    </div>
  );
}