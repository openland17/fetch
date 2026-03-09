"use client";

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col min-h-safe-screen bg-offwhite animate-pulse">
      <div className="h-[200px] bg-navy shrink-0" />
      <div className="flex-1 p-4 space-y-4">
        <div className="h-4 bg-grey/20 rounded w-1/3" />
        <div className="h-24 bg-grey/20 rounded-xl" />
        <div className="h-4 bg-grey/20 rounded w-1/4 mt-4" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-grey/20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
