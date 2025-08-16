
import React, { useState } from "react";
import InfiniteVisitList from "../components/InfiniteVisitList";

const VisitListPage: React.FC = () => {
  const [search, setSearch] = useState("");

  return (
    <div className="p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-xl font-semibold">Visits</h1>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name..."
            className="h-9 w-[260px] rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <InfiniteVisitList searchTerm={search} pageSize={20} />
    </div>
  );
};

export default VisitListPage;
