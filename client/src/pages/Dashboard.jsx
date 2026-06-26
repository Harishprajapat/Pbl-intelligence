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
    const [loading, setLoading] = useState(false);

 useEffect(() => {
    getFilters().then(setOptions);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getSummary(filters),
      getTrend(filters),
      getGeography({ ...filters, level: geoLevel }),
    ]).then(([summaryData, trendData, geoData]) => {
      setSummary(summaryData);
      setTrend(trendData);
      setGeography(geoData);
      setLoading(false);
    });
  }, [filters, geoLevel]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">PBL Intelligence Dashboard</h1>

      <FilterBar filters={filters} options={options} onChange={setFilters} />

      <div className={`transition-opacity ${loading ? "opacity-40" : "opacity-100"}`}>
        <KpiCards summary={summary} trend={trend} />
        <TrendChart trend={trend} />
        <Leaderboard geography={geography} level={geoLevel} onLevelChange={setGeoLevel} />
      </div>

      {loading && (
        <p className="text-sm text-gray-400 mt-2">Updating…</p>
      )}
    </div>
  );
}