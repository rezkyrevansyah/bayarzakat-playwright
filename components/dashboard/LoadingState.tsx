export default function LoadingState() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="h-16 bg-white rounded-xl animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="h-36 bg-white rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
