export default function FilterBar({ filters, options, onChange }) {
  const handle = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="flex flex-wrap gap-3 bg-white p-4 rounded-lg shadow mb-6">
      <Select label="Month" value={filters.month} onChange={handle("month")} options={options.months} />
      <Select label="District" value={filters.district} onChange={handle("district")} options={options.districts} />
      <Select label="Block" value={filters.block} onChange={handle("block")} options={options.blocks} />
      <Select label="Subject" value={filters.subject} onChange={handle("subject")} options={options.subjects} />
      <Select label="Grade" value={filters.grade} onChange={handle("grade")} options={options.grades} />
    </div>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <div className="flex flex-col">
      <label className="text-xs text-gray-500 mb-1">{label}</label>
      <select
        value={value || ""}
        onChange={onChange}
        className="border rounded px-3 py-1.5 text-sm min-w-[150px]"
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}