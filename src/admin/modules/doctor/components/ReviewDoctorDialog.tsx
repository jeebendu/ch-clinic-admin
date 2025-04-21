
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Doctor } from "../types/Doctor";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Star, Check } from "lucide-react";

// Soft section header
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs font-bold text-primary uppercase tracking-wider mb-1 mt-3">{children}</div>
);

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

  const infoBlock = "flex flex-col gap-1 bg-softGray/60 rounded-lg px-4 py-2";
  const infoItem = "flex items-baseline gap-2";

  const addInfo = doctor.additionalInfoDoctor;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[680px] max-h-[88vh] overflow-y-auto shadow-lg border-0 bg-gradient-to-br from-white via-indigo-50 to-purple-50 p-0">
        <DialogHeader className="p-6 pb-3 border-b bg-purple-50/60 rounded-t-lg">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-darkPurple">
            <span>Review Doctor Details</span>
            {doctor.verified && (
              <Badge variant="success" className="flex items-center gap-1 font-medium text-xs">
                <Check className="h-4 w-4" /> Verified
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-8 px-6 py-6 bg-white/60">
          {/* Left: Doctor Avatar + Basic */}
          <div className="md:w-1/3 flex flex-col items-center text-center bg-white/70 rounded-xl shadow-md p-4">
            <Avatar className="h-20 w-20 mb-2 ring-2 ring-primary/30">
              <AvatarImage src={doctor?.user?.image} />
              <AvatarFallback>
                {doctor.firstname.charAt(0).toUpperCase()}{doctor.lastname.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="font-semibold text-lg">{doctor.firstname} {doctor.lastname}</div>
            <div className="text-sm text-gray-500">{doctor.desgination}</div>
            <Badge
              variant={doctor.verified ? "success" : "destructive"}
              className="mt-1"
            >
              {doctor.verified ? "Verified" : "Not Verified"}
            </Badge>
            <div className="mt-3 flex items-center justify-center text-yellow-600">
              <Star className="h-5 w-5 mr-1 text-yellow-400 fill-yellow-400" />
              <span className="font-medium">{doctor.rating?.toFixed(1) || "0.0"}</span>
              <span className="text-xs text-muted-foreground ml-1">
                ({doctor.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
          {/* Right: Details */}
          <div className="md:w-2/3 flex flex-col gap-3">
            <div className={infoBlock}>
              <SectionTitle>Basic Info</SectionTitle>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">UID:</span>
                <span>{doctor.uid}</span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Phone:</span>
                <span>{doctor.phone || doctor?.user?.phone || "—"}</span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Email:</span>
                <span>{doctor.email || "—"}</span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Joined:</span>
                <span>
                  {doctor.joiningDate ? format(new Date(doctor.joiningDate), 'MMM d, yyyy') : "—"}
                </span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Gender:</span>
                <span>
                  {
                    doctor.gender === 0 ? "Male" :
                      doctor.gender === 1 ? "Female" :
                        doctor.gender === 2 ? "Other" : "Not specified"
                  }
                </span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Experience:</span>
                <span>{doctor.expYear} years</span>
              </div>
            </div>
            <div className={infoBlock}>
              <SectionTitle>Qualifications</SectionTitle>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Qualification:</span>
                <span>{doctor.qualification || "—"}</span>
              </div>
            </div>
            <div className={infoBlock}>
              <SectionTitle>Other Details</SectionTitle>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Location:</span>
                <span>
                  {[doctor.city, doctor?.district?.name, doctor?.state?.name, doctor?.country?.name].filter(Boolean).join(", ") || "—"}
                </span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Specializations:</span>
                <span>
                  {(doctor.specializationList && doctor.specializationList.length > 0)
                    ? doctor.specializationList.map(spec => spec.name).join(', ')
                    : "—"}
                </span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Services:</span>
                <span>
                  {(doctor.serviceList && doctor.serviceList.length > 0)
                    ? doctor.serviceList.map(service => service.name).join(', ')
                    : "—"}
                </span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Branches:</span>
                <span>
                  {(doctor.branchList && doctor.branchList.length > 0)
                    ? doctor.branchList.map(branch => branch.name).join(', ')
                    : "—"}
                </span>
              </div>
            </div>

            {/* -------- Additional Doctor Info Section -------- */}
            {addInfo && (
              <div className={infoBlock}>
                <SectionTitle>Additional Info</SectionTitle>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Registration No.:</span>
                  <span>{addInfo.registationNumber || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Registration Council:</span>
                  <span>{addInfo.registationCouncil || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Registration Year:</span>
                  <span>{addInfo.registationYear || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Degree College:</span>
                  <span>{addInfo.degreeCollege || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Year Completion Degree:</span>
                  <span>{addInfo.yearCompletionDegree || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Establishment Type:</span>
                  <span>{addInfo.establishmentType === "own" ? "Own" : addInfo.establishmentType === "visit" ? "Visiting" : "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Establishment Name:</span>
                  <span>{addInfo.establishmentName || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">Establishment City:</span>
                  <span>{addInfo.establishmentCity || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">State:</span>
                  <span>{addInfo.state?.name || "—"}</span>
                </div>
                <div className={infoItem}>
                  <span className="text-xs font-semibold text-muted-foreground min-w-[130px]">District:</span>
                  <span>{addInfo.district?.name || "—"}</span>
                </div>
              </div>
            )}

            <div className={infoBlock}>
              <SectionTitle>About & Biography</SectionTitle>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">About:</span>
                <span>{doctor.about || "—"}</span>
              </div>
              <div className={infoItem}>
                <span className="text-xs font-semibold text-muted-foreground min-w-[60px]">Biography:</span>
                <span>{doctor.biography || "—"}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-3 px-6 pb-6 pt-2 bg-purple-50/60 rounded-b-lg">
          <Button variant="outline" onClick={onClose} className="min-w-[100px]">Close</Button>
          {!doctor.verified && (
            <Button
              disabled={loading}
              onClick={() => onVerify(doctor)}
              className="bg-vividPurple hover:bg-primary text-white font-bold min-w-[160px] shadow-md hover-scale transition-transform duration-200"
              style={{ boxShadow: "0 2px 8px rgba(65, 65, 66, 0.13)",color:"black"}}
            >
              <Check className="mr-2 h-4 w-4" /> Verify Doctor
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDoctorDialog;
