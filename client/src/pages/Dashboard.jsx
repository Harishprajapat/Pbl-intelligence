import { useEffect, useState } from "react";
import { getFilters, getSummary, getTrend, getGeography } from "../api/dashboard";
import FilterBar from "../components/FilterBar";
import KpiCards from "../components/KpiCards";
import TrendChart from "../components/TrendChart";
import Leaderboard from "../components/Leaderboard";

export default function Dashboard() {
  const [filters, setFilters] = useState({ month: "2025-09" });
  const [options, setOptions] = useState({});
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState([]);
  const [geoLevel, setGeoLevel] = useState("district");
  const [geography, setGeography] = useState([]);

  useEffect(() => {
    getFilters().then(setOptions);
  }, []);

  useEffect(() => {
    getSummary(filters).then(setSummary);
    getTrend(filters).then(setTrend);
  }, [filters]);

  useEffect(() => {
    getGeography({ ...filters, level: geoLevel }).then(setGeography);
  }, [filters, geoLevel]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">PBL Intelligence Dashboard</h1>

      <FilterBar filters={filters} options={options} onChange={setFilters} />
      <KpiCards summary={summary} trend={trend} />
      <TrendChart trend={trend} />
      <Leaderboard geography={geography} level={geoLevel} onLevelChange={setGeoLevel} />
    </div>
  );
}