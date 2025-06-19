
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "../../types/Doctor";
import { UserCheck, Mail, Phone, MapPin, Stethoscope, Award, Calendar, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DoctorViewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
}

const DoctorViewDialog = ({ isOpen, onClose, doctor }: DoctorViewDialogProps) => {
  if (!doctor) return null;

  const getStatusBadge = (verified: boolean) => {
    return (
      <Badge className={`text-xs ${
        verified ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
      }`}>
        {verified ? "✅ Verified" : "❌ Not Verified"}
      </Badge>
    );
  };

  const getOnlineBadge = (online: boolean) => {
    return (
      <Badge className={`text-xs ${
        online ? "bg-blue-100 text-blue-800 border-blue-200" : "bg-gray-100 text-gray-800 border-gray-200"
      }`}>
        {online ? "🌐 Online" : "📵 Offline"}
      </Badge>
    );
  };

  const getInitials = (firstname: string = '', lastname: string = '') => {
    return `${firstname.charAt(0) || ''}${lastname.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent mobileDrawer={true}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Dr. {doctor.firstname} {doctor.lastname}
          </DialogTitle>
        </DialogHeader>

        <DialogBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-16 w-16 border-2 border-primary/10">
                    <AvatarImage src={doctor?.user?.image || doctor.image} />
                    <AvatarFallback className="bg-primary/20 text-primary-foreground text-lg">
                      {getInitials(doctor.firstname, doctor.lastname)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">Dr. {doctor.firstname} {doctor.lastname}</h3>
                    <p className="text-sm text-muted-foreground">{doctor.qualification || 'General Physician'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Doctor ID</label>
                  <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{doctor.uid || doctor.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Gender</label>
                  <p className="text-sm">{doctor.gender || 'Not specified'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Experience</label>
                  <p className="text-sm">{doctor.expYear || 0} years</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="mt-1 flex gap-2">
                    {getStatusBadge(doctor.verified || false)}
                    {getOnlineBadge(doctor.online || false)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    {doctor.phone || doctor?.user?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-sm flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    {doctor.email || doctor?.user?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Location</label>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-3 w-3" />
                    {doctor.city || doctor.state?.name
                      ? `${doctor.city || ''} ${doctor.state?.name ? `, ${doctor.state?.name}` : ''}`
                      : 'Not specified'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Qualification</label>
                  <p className="text-sm flex items-center gap-2">
                    <Award className="h-3 w-3" />
                    {doctor.qualification || 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Specializations</label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {doctor.specializationList && doctor.specializationList.length > 0 ? (
                      doctor.specializationList.map((spec) => (
                        <Badge key={spec.id} variant="outline" className="text-xs">
                          {spec.name}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400">No specializations listed</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Online Consultation</label>
                  <p className="text-sm">{doctor.online ? 'Available' : 'Not Available'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Published Online</label>
                  <p className="text-sm">{doctor.publishedOnline ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">External Doctor</label>
                  <p className="text-sm">{doctor.external ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Registration Number</label>
                  <p className="text-sm text-gray-600">{doctor.regNo || 'Not provided'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorViewDialog;
