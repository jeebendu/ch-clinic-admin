
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Doctor } from "../types/Doctor";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Globe, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorTableProps {
  doctors: Doctor[];
  loading?: boolean;
  onViewClick?: (doctor: Doctor) => void;
  onEditClick?: (doctor: Doctor) => void;
  onPublishClick?: (doctor: Doctor) => void;
  onVerifyClick?: (doctor: Doctor) => void;
}

const DoctorTable = ({
  doctors,
  loading = false,
  onViewClick,
  onEditClick,
  onPublishClick,
  onVerifyClick,
}: DoctorTableProps) => {
  const navigate = useNavigate();

  const getInitials = (firstname: string = "", lastname: string = "") => {
    return `${firstname.charAt(0) || ""}${lastname.charAt(0) || ""}`.toUpperCase();
  };

  const handleViewDetails = (doctor: Doctor) => {
    navigate(`/admin/doctor/view/${doctor.id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor</TableHead>
            <TableHead>Specialization</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.length > 0 ? (
            doctors.map((doctor) => (
              <TableRow key={doctor.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doctor?.user?.image} />
                      <AvatarFallback>
                        {getInitials(doctor.firstname, doctor.lastname)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {doctor.firstname} {doctor.lastname}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {doctor.desgination}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {doctor.specializationList?.slice(0, 2).map((spec) => (
                      <Badge key={spec.id} variant="outline" className="mr-1">
                        {spec.name}
                      </Badge>
                    ))}
                    {(doctor.specializationList?.length || 0) > 2 && (
                      <Badge variant="outline">
                        +{(doctor.specializationList?.length || 0) - 2} more
                      </Badge>
                    )}
                    {!doctor.specializationList?.length && (
                      <span className="text-muted-foreground text-sm">
                        Not specified
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 flex-wrap">
                    <Badge
                      variant={doctor.verified ? "success" : "destructive"}
                      className="mr-1"
                    >
                      {doctor.verified ? "Verified" : "Not Verified"}
                    </Badge>
                    {doctor.external && (
                      <Badge variant="outline">External</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>{doctor.phone || doctor?.user?.phone || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(doctor)}
                      className="h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {onEditClick && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onEditClick(doctor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {!doctor.publishedOnline && onPublishClick && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => onPublishClick(doctor)}
                        title="Publish Online"
                      >
                        <Globe className="h-4 w-4" />
                      </Button>
                    )}
                    {!doctor.verified && onVerifyClick && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-green-600"
                        onClick={() => onVerifyClick(doctor)}
                        title="Verify Doctor"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No doctors found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DoctorTable;
