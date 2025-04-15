import React, { useState, useEffect } from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import DataTable from "@/admin/components/DataTable";
import { FileType } from "@/admin/types/file";
import { Button } from "@/components/ui/button";
import { Grid, List, Filter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const [files, setFiles] = useState<FileType[]>([]);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [viewType, setViewType] = useState<"grid" | "list">("list");
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching data
    const demoData: FileType[] = [
      {
        id: "1",
        name: "Project Proposal.docx",
        type: "file",
        modified: "2025-03-28T10:15:00",
        owner: "You",
        size: "245 KB",
      },
      {
        id: "2",
        name: "Marketing Assets",
        type: "folder",
        modified: "2025-04-01T14:30:00",
        owner: "You",
        size: "2.1 GB",
      },
      {
        id: "3",
        name: "Q1 Financial Report.xlsx",
        type: "file",
        modified: "2025-03-15T09:20:00",
        owner: "John Smith",
        size: "1.8 MB",
      },
      {
        id: "4",
        name: "Product Designs",
        type: "folder",
        modified: "2025-04-05T16:45:00",
        owner: "Design Team",
        size: "4.3 GB",
      },
      {
        id: "5",
        name: "Meeting Notes.pdf",
        type: "file",
        modified: "2025-04-06T11:30:00",
        owner: "You",
        size: "540 KB",
      },
      {
        id: "6",
        name: "Client Presentations",
        type: "folder",
        modified: "2025-03-22T13:15:00",
        owner: "Sarah Lee",
        size: "1.2 GB",
      },
      {
        id: "7",
        name: "Company Logo.png",
        type: "file",
        modified: "2025-02-18T10:00:00",
        owner: "Design Team",
        size: "2.3 MB",
      },
      {
        id: "8",
        name: "HR Documents",
        type: "folder",
        modified: "2025-04-02T09:10:00",
        owner: "HR Department",
        size: "890 MB",
      },
      {
        id: "9",
        name: "Project Timeline.pdf",
        type: "file",
        modified: "2025-04-07T15:45:00",
        owner: "You",
        size: "1.1 MB",
      },
      {
        id: "10",
        name: "User Research",
        type: "folder",
        modified: "2025-03-10T14:20:00",
        owner: "Research Team",
        size: "3.7 GB",
      },
      {
        id: "11",
        name: "Budget 2025.xlsx",
        type: "file",
        modified: "2025-03-30T11:25:00",
        owner: "Finance Team",
        size: "980 KB",
      },
      {
        id: "12",
        name: "Website Assets",
        type: "folder",
        modified: "2025-04-04T10:05:00",
        owner: "Marketing",
        size: "1.5 GB",
      },
      {
        id: "13",
        name: "Employee Handbook.pdf",
        type: "file",
        modified: "2025-02-25T13:40:00",
        owner: "HR Department",
        size: "4.2 MB",
      },
      {
        id: "14",
        name: "Product Roadmap.pptx",
        type: "file",
        modified: "2025-04-08T09:30:00",
        owner: "Product Team",
        size: "3.1 MB",
      },
      {
        id: "15",
        name: "Customer Data",
        type: "folder",
        modified: "2025-03-05T16:15:00",
        owner: "Sales Team",
        size: "5.6 GB",
      },
    ];

    setFiles(demoData);
  }, []);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new column and default to ascending order
      setSortColumn(column);
      setSortDirection("asc");
    }

    // Sort the data
    const sortedFiles = [...files].sort((a: any, b: any) => {
      if (a[column] < b[column]) return sortDirection === "asc" ? -1 : 1;
      if (a[column] > b[column]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    setFiles(sortedFiles);
    
    toast({
      title: "Sorted by " + column,
      description: `Showing ${sortDirection === "asc" ? "ascending" : "descending"} order`,
    });
  };

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">My Files</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewType("grid")}
            className={viewType === "grid" ? "bg-blue-50 text-blue-600" : ""}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewType("list")}
            className={viewType === "list" ? "bg-blue-50 text-blue-600" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-[calc(100vh-200px)] overflow-hidden flex flex-col">
        <DataTable
          data={files}
          onSort={handleSort}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
