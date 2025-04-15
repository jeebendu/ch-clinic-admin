
import React from "react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { FileType } from "@/admin/types/file";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, MoreHorizontal, File, Folder } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface DataTableProps {
  data: FileType[];
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: "asc" | "desc";
}

const DataTable = ({
  data,
  onSort,
  sortColumn,
  sortDirection,
}: DataTableProps) => {
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    );
  };

  const handleSort = (column: string) => {
    onSort(column);
  };

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow className="border-b hover:bg-transparent">
              <TableHead className="w-[400px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="flex items-center font-semibold text-xs uppercase tracking-wide"
                >
                  Name
                  {renderSortIcon("name")}
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("modified")}
                  className="flex items-center font-semibold text-xs uppercase tracking-wide"
                >
                  Modified
                  {renderSortIcon("modified")}
                </Button>
              </TableHead>
              <TableHead className="w-[150px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("owner")}
                  className="flex items-center font-semibold text-xs uppercase tracking-wide"
                >
                  Owner
                  {renderSortIcon("owner")}
                </Button>
              </TableHead>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("size")}
                  className="flex items-center font-semibold text-xs uppercase tracking-wide"
                >
                  Size
                  {renderSortIcon("size")}
                </Button>
              </TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="max-h-[calc(100vh-240px)] overflow-y-auto">
            {data.map((file) => (
              <TableRow
                key={file.id}
                className="border-b hover:bg-blue-50 cursor-pointer"
              >
                <TableCell className="py-3">
                  <div className="flex items-center">
                    <span className="mr-3 text-blue-500">
                      {file.type === "folder" ? (
                        <Folder className="h-5 w-5" />
                      ) : (
                        <File className="h-5 w-5" />
                      )}
                    </span>
                    <span className="font-medium">{file.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDistanceToNow(new Date(file.modified), {
                    addSuffix: true,
                  })}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {file.owner}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {file.size}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
