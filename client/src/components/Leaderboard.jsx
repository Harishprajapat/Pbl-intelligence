import { useState } from "react";

const riskColor = {
  "On Track": "bg-green-100 text-green-700",
  "Behind": "bg-yellow-100 text-yellow-700",
  "At Risk": "bg-orange-100 text-orange-700",
  "Critical": "bg-red-100 text-red-700",
};

export default function Leaderboard({ geography, level, onLevelChange }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold">
          {level === "block" ? "Block" : "District"} Performance
        </p>
        <select
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          <option value="district">By District</option>
          <option value="block">By Block</option>
        </select>
      </div>

      <div className="overflow-y-auto max-h-96">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500 sticky top-0 bg-white">
            <tr>
              <th className="py-2">Name</th>
              <th>Schools</th>
              <th>Participation</th>
              <th>Evidence</th>
              <th>Attendance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {geography?.map((g) => (
              <tr key={g.name} className="border-t">
                <td className="py-2">{g.name}</td>
                <td>{g.totalSchools}</td>
                <td>{(g.participationRate * 100).toFixed(0)}%</td>
                <td>{(g.evidenceRate * 100).toFixed(0)}%</td>
                <td>{(g.attendanceRate * 100).toFixed(0)}%</td>
                <td>
                  <span className={`text-xs px-2 py-0.5 rounded ${riskColor[g.riskStatus]}`}>
                    {g.riskStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}