import React, { useEffect, useState } from "react";
import { Visit } from "../types/Visit";
import { useAutoScroll } from "../hooks/useAutoScroll";
import visitService from "../services/visitService";
import VisitTable from "../components/VisitTable";
import VisitList from "../components/VisitList";

const VisitListPage: React.FC = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [view, setView] = useState<"table" | "list">("table");

  const fetchVisits = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const response = await visitService.getPaginatedVisits(page, 20);
    setVisits(prev => [...prev, ...response]);
    setHasMore(response.length > 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchVisits();
  }, [page]);

  useAutoScroll(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Visits</h2>
        <div>
          <button
            className={`px-4 py-2 mr-2 rounded ${view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setView("table")}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 rounded ${view === "list" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            onClick={() => setView("list")}
          >
            List View
          </button>
        </div>
      </div>

      {view === "table" ? (
        <VisitTable visits={visits} />
      ) : (
        <VisitList visits={visits} />
      )}

      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more visits</p>}
    </div>
  );
};

export default VisitListPage;
