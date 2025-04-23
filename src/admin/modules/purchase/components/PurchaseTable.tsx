
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Order } from "../types/PurchaseOrder";

interface Props {
  purchases: Order[];
  onEdit: (order: Order) => void;
}

const PurchaseTable: React.FC<Props> = ({ purchases, onEdit }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>PO No.</TableHead>
        <TableHead>Vendor</TableHead>
        <TableHead>Date</TableHead>
        <TableHead>Subtotal</TableHead>
        <TableHead>Total</TableHead>
        <TableHead>Status</TableHead>
        <TableHead></TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {purchases.map(p => (
        <TableRow key={p.id}>
          <TableCell>{p.uid}</TableCell>
          <TableCell>{p.vendor.name}</TableCell>
          <TableCell>{p.orderTime.toLocaleDateString()}</TableCell>
          <TableCell>{p.subtotal}</TableCell>
          <TableCell>{p.grandTotal}</TableCell>
          <TableCell>
            {p.approved ?
              <span className="text-green-600">Approved</span> :
              <span className="text-yellow-600">Pending</span>}
          </TableCell>
          <TableCell>
            <Button variant="outline" size="icon" onClick={() => onEdit(p)}>
              <Edit size={16} />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default PurchaseTable;
