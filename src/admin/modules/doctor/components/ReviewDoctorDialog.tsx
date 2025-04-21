
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Doctor } from "../types/Doctor";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Star, Check } from "lucide-react";

interface ReviewDoctorDialogProps {
  open: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onVerify: (doctor: Doctor) => void;
  loading?: boolean;
}

const ReviewDoctorDialog: React.FC<ReviewDoctorDialogProps> = ({
  open,
  doctor,
  onClose,
  onVerify,
  loading = false,
}) => {
  if (!doctor) return null;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Review Doctor Details</span>
            {doctor.verified && (
              <Badge variant="success" className="flex items-center gap-1">
                <Check className="h-4 w-4" /> Verified
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left: Doctor Avatar + Basic */}
          <div className="md:w-1/3">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-2">
                <AvatarImage src={doctor?.user?.image} />
                <AvatarFallback>
                  {doctor.firstname.charAt(0).toUpperCase()}{doctor.lastname.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-medium text-lg">{doctor.firstname} {doctor.lastname}</div>
              <div>{doctor.desgination}</div>
              <Badge variant={doctor.verified ? "success" : "destructive"} className="mt-1">
                {doctor.verified ? "Verified" : "Not Verified"}
              </Badge>
              <div className="mt-3 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="ml-2 text-sm">{doctor.rating?.toFixed(1) || "0.0"}</span>
                <span className="text-xs text-muted-foreground ml-1">
                  ({doctor.reviewCount || 0})
                </span>
              </div>
            </div>
          </div>
          {/* Right: Details */}
          <div className="md:w-2/3 space-y-2">
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">UID</span>
                <span>{doctor.uid}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Phone</span>
                <span>{doctor.phone || doctor?.user?.phone || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Email</span>
                <span>{doctor.email || "—"}</span>
              </div>
              <div>
                <span className="block text-xs font-semibold text-muted-foreground">Joined</span>
                <span>
                  {doctor.joiningDate ? format(new Date(doctor.joiningDate), 'MMM d, yyyy') : "—"}
                </span>
              </div>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Gender</span>
              <span>
                {
                  doctor.gender === 0 ? "Male" :
                  doctor.gender === 1 ? "Female" :
                  doctor.gender === 2 ? "Other" : "Not specified"
                }
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Location</span>
              <span>
                {[doctor.city, doctor?.district?.name, doctor?.state?.name, doctor?.country?.name].filter(Boolean).join(", ") || "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Qualification</span>
              <span>{doctor.qualification || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Experience</span>
              <span>{doctor.expYear} years</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Specializations</span>
              <span>
                {(doctor.specializationList && doctor.specializationList.length > 0)
                  ? doctor.specializationList.map(spec => spec.name).join(', ')
                  : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Services</span>
              <span>
                {(doctor.serviceList && doctor.serviceList.length > 0)
                  ? doctor.serviceList.map(service => service.name).join(', ')
                  : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Branches</span>
              <span>
                {(doctor.branchList && doctor.branchList.length > 0)
                  ? doctor.branchList.map(branch => branch.name).join(', ')
                  : "—"}
              </span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">About</span>
              <span>{doctor.about || "—"}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-muted-foreground">Biography</span>
              <span>{doctor.biography || "—"}</span>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
          {!doctor.verified && (
            <Button disabled={loading} onClick={() => onVerify(doctor)} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Check className="mr-1 h-4 w-4" /> Verify Doctor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDoctorDialog;
