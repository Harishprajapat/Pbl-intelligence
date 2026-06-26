import { useEffect, useState } from "react";
import { listGrants, getGrantMonths, getGrantReport } from "../api/grants";
import GrantSelector from "../components/GrantSelector";
import FactPanel from "../components/FactPanel";
import EvidenceGallery from "../components/EvidenceGallery";
import NarrativeBox from "../components/NarrativeBox";

export default function GrantReport() {
  const [grants, setGrants] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedGrant, setSelectedGrant] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    listGrants().then(setGrants);
  }, []);

  useEffect(() => {
    if (!selectedGrant) return;
    getGrantMonths(selectedGrant).then(setMonths);
    setSelectedMonth("");
    setReport(null);
  }, [selectedGrant]);

  useEffect(() => {
    if (!selectedGrant || !selectedMonth) return;
    getGrantReport(selectedGrant, selectedMonth).then(setReport);
  }, [selectedGrant, selectedMonth]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-4">Grant Reporting Assistant</h1>

      <GrantSelector
        grants={grants}
        months={months}
        selectedGrant={selectedGrant}
        selectedMonth={selectedMonth}
        onGrantChange={setSelectedGrant}
        onMonthChange={setSelectedMonth}
      />

      {report && (
        <>
          <FactPanel report={report} />
          <EvidenceGallery evidence={report.evidence} />
          <NarrativeBox grantId={selectedGrant} month={selectedMonth} />
        </>
      )}
    </div>
  );
}