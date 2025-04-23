// In your RoleTable component:
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, ShieldCheck, Trash } from "lucide-react";
import { LoginHistory } from "../types/LoginHistory";

interface LoginHistoryTableProps {
    loginHistory: LoginHistory[];

}

const LoginHistoryTable = ({ loginHistory }: LoginHistoryTableProps) => {


    return (
        <>
            <div className="bg-white rounded-lg border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Login Time</TableHead>
                            <TableHead>Logout Time</TableHead>
                            <TableHead>IP Address</TableHead>
                            <TableHead>User Agent</TableHead>
                            <TableHead>Address</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Mobile</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            Array.isArray(loginHistory) && loginHistory.map((user) =>(
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user?.user?.name}</TableCell>
                                    <TableCell className="font-medium">{user?.loginTime}</TableCell>
                                    <TableCell className="font-medium">{user?.logoutTime}</TableCell>
                                    <TableCell className="font-medium">{user?.ipAddress}</TableCell>
                                    <TableCell className="font-medium">{user?.userAgent}</TableCell>
                                    <TableCell className="font-medium">{user?.city}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs rounded-full ${user?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user?.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="font-medium">{user?.mobile}</TableCell>

                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>



        </>
    );
};

export default LoginHistoryTable;