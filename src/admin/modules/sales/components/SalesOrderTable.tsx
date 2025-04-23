
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { format } from "date-fns";
import { Order } from "../types/SalesOrder";

interface OrderTableProps {
    order: Order[];
    onDelete: (id: number) => void;
    onEdit: (order: Order) => void;
}

const SalesOrderTable = ({ order, onDelete, onEdit }: OrderTableProps) => {
    const [selectedMapUrl, setSelectedMapUrl] = useState<string | null>(null);
    const [mapModalOpen, setMapModalOpen] = useState(false);

    const handleViewMap = (mapurl: string | undefined) => {
        if (mapurl) {
            setSelectedMapUrl(mapurl);
            setMapModalOpen(true);
        }
    };

    return (
        <>
            <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>UID</TableHead>
                            <TableHead>Customer Name</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Type</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Remark</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    No expenses found
                                </TableCell>
                            </TableRow>
                        ) : (
                            order.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.uid}</TableCell>
                                    <TableCell className="font-medium">{user.customer?.firstName} {user.customer?.lastName}</TableCell>
                                    <TableCell>{user.paidAmount}</TableCell>
                                    <TableCell>{user.paymentType?.name}</TableCell>
                                    <TableCell>
                                        <div className="text-sm text-muted-foreground">
                                            {user.createdTime ? format(new Date(user.createdTime), 'PPP') : ''}
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.remark}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(user)}
                                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(user.id || 0)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </>
    );
};

export default SalesOrderTable;
