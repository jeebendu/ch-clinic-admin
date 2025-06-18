
import React from "react";
import { Branch } from "../types/Branch";
import BranchCard from "./BranchCard";

interface BranchCardListProps {
  branches: Branch[];
  onEdit: (branch: Branch) => void;
  onDelete: (id: number) => void;
}

const BranchCardList = ({ branches, onEdit, onDelete }: BranchCardListProps) => {
  if (branches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p className="text-gray-500 text-center">
          No branches found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {branches.map((branch) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default BranchCardList;
