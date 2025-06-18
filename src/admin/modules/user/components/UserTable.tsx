
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
import { Staff, User } from "../types/User";
import { format } from "date-fns";

interface UserTableProps {
    user: Staff[];
    onDelete: (id: number) => void;
    onEdit: (user: Staff) => void;
}

const UserTable = ({ user, onDelete, onEdit }: UserTableProps) => {
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
                            <TableHead>Uid</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Effective Period</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {user.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    No user found
                                </TableCell>
                            </TableRow>
                        ) : (
                            user.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.uid}</TableCell>
                                    <TableCell className="font-medium">{user.firstname} {user.lastname}</TableCell>
                                    <TableCell>{user?.user?.role?.name}</TableCell>
                                    <TableCell>{user?.user?.email}</TableCell>
                                    <TableCell>{user?.user?.phone}</TableCell>
                                    <TableCell>
                                        {user?.user.effectiveFrom? format(user?.user.effectiveFrom, 'yyyy-MM-dd') :format(new Date(), 'yyyy-MM-dd')}
                                    </TableCell>


                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs rounded-full ${user?.user?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user?.user?.status ? 'Active' : 'Inactive'}
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

            {/* Map Modal */}
            <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
                <DialogContent className="max-w-4xl h-[80vh]">
                    <DialogHeader className="border-b pb-4">
                        <DialogTitle className="text-clinic-primary">Branch Location</DialogTitle>
                    </DialogHeader>
                    <div className="h-full w-full">
                        {selectedMapUrl && (
                            <iframe
                                src={selectedMapUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: "400px" }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded"
                            ></iframe>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default UserTable;
