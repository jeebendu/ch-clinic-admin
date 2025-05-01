
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Doctor } from "../../types/Doctor";
import { Mail, MapPin, Phone, Star, Calendar, User } from "lucide-react";
import { format } from "date-fns";

interface DoctorProfileSectionProps {
  doctor: Doctor;
  detailed?: boolean;
}

const DoctorProfileSection: React.FC<DoctorProfileSectionProps> = ({ doctor, detailed = false }) => {
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  const getGenderText = (gender: number) => {
    switch (gender) {
      case 0:
        return "Male";
      case 1:
        return "Female";
      case 2:
        return "Other";
      default:
        return "Not specified";
    }
  };

  return (
    <Card className={detailed ? "col-span-2" : ""}>
      <CardHeader className={`pb-2 ${detailed ? "" : "text-center"}`}>
        <div className={`flex ${detailed ? "flex-row items-start gap-4" : "flex-col items-center"}`}>
          <Avatar className={detailed ? "h-16 w-16" : "h-24 w-24 mb-2"}>
            <AvatarImage src={doctor?.user?.image} />
            <AvatarFallback className={detailed ? "text-xl" : "text-2xl"}>
              {getInitials(doctor.firstname, doctor.lastname)}
            </AvatarFallback>
          </Avatar>
          <div className={detailed ? "" : "text-center"}>
            <CardTitle className="text-xl">
              {doctor.firstname} {doctor.lastname}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{doctor.desgination}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant={doctor.verified ? "success" : "destructive"}>
                {doctor.verified ? "Verified" : "Not Verified"}
              </Badge>
              {doctor.external && (
                <Badge variant="outline">
                  External
                </Badge>
              )}
              {doctor.publishedOnline && (
                <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                  Published Online
                </Badge>
              )}
            </div>
            <div className={`mt-3 flex items-center ${detailed ? "" : "justify-center"}`}>
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(doctor.rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-medium">
                {doctor.rating?.toFixed(1) || "0.0"}
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                ({doctor.reviewCount || 0} reviews)
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {detailed ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Basic Information</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Doctor ID</div>
                      <div className="text-sm">{doctor.uid}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Gender</div>
                      <div className="text-sm">{getGenderText(doctor.gender)}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Joined On</div>
                      <div className="text-sm">{formatDate(doctor.joiningDate)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <div className="text-sm">{doctor.phone || doctor?.user?.phone || "Not provided"}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <div className="text-sm break-all">{doctor.email || "Not provided"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-xs text-muted-foreground">Address</div>
                      <div className="text-sm">
                        {[
                          doctor.city,
                          doctor?.district?.name,
                          doctor?.state?.name,
                          doctor?.country?.name,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Not provided"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">About</h4>
                <p className="text-sm whitespace-pre-line">{doctor.about || "No information provided."}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div>{doctor.phone || doctor?.user?.phone || "Not provided"}</div>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Email</div>
                <div className="break-all">{doctor.email || "Not provided"}</div>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Location</div>
                <div>
                  {[
                    doctor.city,
                    doctor?.district?.name,
                    doctor?.state?.name,
                    doctor?.country?.name,
                  ]
                    .filter(Boolean)
                    .join(", ") || "Not provided"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Joined On</div>
                <div>{formatDate(doctor.joiningDate)}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DoctorProfileSection;
