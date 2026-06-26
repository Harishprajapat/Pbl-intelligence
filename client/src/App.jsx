import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import GrantReport from "./pages/GrantReport";

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-900 text-white px-6 py-3 flex gap-6 text-sm">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/grants" className="hover:underline">Grant Reports</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/grants" element={<GrantReport />} />
      </Routes>
    </BrowserRouter>
  );
}