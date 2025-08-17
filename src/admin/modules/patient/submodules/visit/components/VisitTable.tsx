
import { Visit } from "../types/Visit";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions, RowAction } from "@/components/ui/data-table-row-actions";

interface VisitTableProps {
  visits: Visit[];
  getPrimaryActions: (visit: Visit) => RowAction[];
  getSecondaryActions: (visit: Visit) => RowAction[];
}

export const VisitTable = ({ visits, getPrimaryActions, getSecondaryActions }: VisitTableProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      case 'follow-up':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'routine':
        return 'bg-blue-50 text-blue-700 hover:bg-blue-100';
      case 'follow-up':
        return 'bg-orange-50 text-orange-700 hover:bg-orange-100';
      case 'emergency':
        return 'bg-red-50 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
    }
  };

  const getPaymentStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-50 text-green-700 hover:bg-green-100';
      case 'partial':
        return 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100';
      case 'pending':
        return 'bg-orange-50 text-orange-700 hover:bg-orange-100';
      case 'unpaid':
        return 'bg-red-50 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-50 text-gray-700 hover:bg-gray-100';
    }
  };

  const columns: ColumnDef<Visit>[] = [
    {
      accessorKey: "id",
      header: "Visit ID",
      cell: ({ row }) => (
        <div className="font-medium">#{row.getValue("id")}</div>
      ),
    },
    {
      accessorKey: "patientId",
      header: "Patient ID",
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("patientId")}</div>
      ),
    },
    {
      accessorKey: "visitDate",
      header: "Visit Date",
      cell: ({ row }) => (
        <div>{format(new Date(row.getValue("visitDate")), 'MMM dd, yyyy')}</div>
      ),
    },
    {
      accessorKey: "visitType",
      header: "Type",
      cell: ({ row }) => (
        <Badge 
          variant="outline" 
          className={getTypeColor(row.getValue("visitType"))}
        >
          {row.getValue("visitType")}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge 
          variant="outline" 
          className={getStatusColor(row.getValue("status"))}
        >
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string;
        if (!status) return <span className="text-muted-foreground">-</span>;
        
        return (
          <Badge 
            variant="outline" 
            className={getPaymentStatusColor(status)}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "paymentAmount",
      header: "Amount",
      cell: ({ row }) => {
        const amount = row.getValue("paymentAmount") as number;
        const paid = row.original.paymentPaid;
        
        if (!amount) return <span className="text-muted-foreground">-</span>;
        
        return (
          <div className="text-right">
            <div className="font-medium">${amount.toFixed(2)}</div>
            {paid && paid < amount && (
              <div className="text-xs text-green-600">
                Paid: ${paid.toFixed(2)}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "reasonForVisit",
      header: "Reason",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("reasonForVisit")}>
          {row.getValue("reasonForVisit")}
        </div>
      ),
    },
    {
      accessorKey: "doctorId",
      header: "Doctor",
      cell: ({ row }) => {
        const doctorId = row.getValue("doctorId") as string;
        return doctorId ? (
          <div>Dr. {doctorId}</div>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DataTableRowActions
          primaryActions={getPrimaryActions(row.original)}
          secondaryActions={getSecondaryActions(row.original)}
        />
      ),
    },
  ];

  return <DataTable columns={columns} data={visits} />;
};
