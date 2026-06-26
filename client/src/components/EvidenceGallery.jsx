export default function EvidenceGallery({ evidence }) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-5 mb-6">
        <p className="text-sm text-gray-400">No evidence assets indexed for this month.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-5 mb-6">
      <p className="text-sm font-semibold mb-3">Evidence ({evidence.length})</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {evidence.map((item) => (
          <div key={item.recordId} className="border rounded overflow-hidden">
            <img
              src={`/evidence/${item.relativePath.replace("images/", "")}`}
              alt={item.caption}
              className="w-full h-32 object-cover"
            />
            <p className="text-xs text-gray-500 p-2">{item.caption}</p>
          </div>
        ))}
      </div>
    </div>
  );
}