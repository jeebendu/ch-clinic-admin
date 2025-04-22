
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
import { Expense } from "../types/Expense";

interface ExpenseTableProps {
    expense: Expense[];
    onDelete: (id: number) => void;
    onEdit: (expense: Expense) => void;
}

const ExpenseTable = ({ expense, onDelete, onEdit }: ExpenseTableProps) => {
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
                            <TableHead>Amount</TableHead>
                            <TableHead>Payment Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Submited By</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expense.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    No user found
                                </TableCell>
                            </TableRow>
                        ) : (
                            expense.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.grandTotal}</TableCell>
                                    <TableCell className="font-medium">{user.paymentType?.name}</TableCell>
                                    <TableCell>{user.description}</TableCell>
                                    <TableCell><div>{user.createdBy || 'N/A'} </div>
                                        <div className="text-sm text-muted-foreground">
                                            {user.createdTime ? format(new Date(user.createdTime), 'PPP') : ''}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs rounded-full ${user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.approved ? 'Approved' : 'Pending'}
                                        </span>
                                    </TableCell>
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

export default ExpenseTable;
