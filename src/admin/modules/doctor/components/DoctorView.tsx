
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "../types/Doctor";
import { Calendar, Clock, Mail, MapPin, Phone, Star, UserCheck, Briefcase, Award, Languages } from "lucide-react";
import { format } from "date-fns";

interface DoctorViewProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onEdit: () => void;
}

const DoctorView: React.FC<DoctorViewProps> = ({ isOpen, onClose, doctor, onEdit }) => {
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase();
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return format(new Date(date), "MMMM d, yyyy");
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Doctor Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Doctor Basic Info Card */}
          <div className="md:w-1/3">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-2">
                    <AvatarImage src={doctor.image} />
                    <AvatarFallback className="text-2xl">
                      {getInitials(doctor.firstname, doctor.lastname)}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="text-xl">
                    {doctor.firstname} {doctor.lastname}
                  </CardTitle>
                  <CardDescription>{doctor.desgination}</CardDescription>
                  <div className="mt-2">
                    <Badge variant={doctor.status === "Active" ? "success" : "destructive"}>
                      {doctor.status}
                    </Badge>
                    {doctor.external && (
                      <Badge variant="outline" className="ml-2">
                        External
                      </Badge>
                    )}
                  </div>
                  <div className="mt-3 flex items-center justify-center">
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
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground">ID</div>
                      <div>{doctor.uid}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div>{doctor.phone || "Not provided"}</div>
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
                          doctor.district?.name,
                          doctor.state?.name,
                          doctor.country?.name,
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
              </CardContent>
            </Card>
          </div>

          {/* Tabs for details */}
          <div className="md:w-2/3">
            <Tabs defaultValue="profile">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="professional">Professional</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Gender</h4>
                      <p>{getGenderText(doctor.gender)}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">About</h4>
                      <p className="whitespace-pre-line">{doctor.about || "No information provided."}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Biography</h4>
                      <p className="whitespace-pre-line">{doctor.biography || "No biography provided."}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="professional" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Qualifications & Experience</h4>
                      <div className="flex items-start space-x-2">
                        <Award className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{doctor.qualification}</p>
                          <p className="text-sm text-muted-foreground">{doctor.expYear} years experience</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.specializationList?.length > 0 ? (
                          doctor.specializationList.map((specialization) => (
                            <Badge key={specialization.id} variant="secondary">
                              {specialization.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No specializations listed.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.serviceList?.length > 0 ? (
                          doctor.serviceList.map((service) => (
                            <Badge key={service.id} variant="outline">
                              {service.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No services listed.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Languages</h4>
                      <div className="flex items-start space-x-2">
                        <Languages className="h-5 w-5 text-primary mt-0.5" />
                        <div className="flex flex-wrap gap-2">
                          {doctor.languageList?.length > 0 ? (
                            doctor.languageList.map((language) => (
                              <Badge key={language.id} variant="outline">
                                {language.name}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No languages listed.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Associated Branches</h4>
                      <div className="flex flex-wrap gap-2">
                        {doctor.branchList?.length > 0 ? (
                          doctor.branchList.map((branch) => (
                            <Badge key={branch.id} className="bg-brand-primary/10 text-brand-primary border-brand-primary/30">
                              {branch.name}
                            </Badge>
                          ))
                        ) : (
                          <p className="text-sm text-muted-foreground">No branches assigned.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Consultation Fee</h4>
                      <div className="flex items-start space-x-2">
                        <div className="font-medium">
                          ${doctor.consultationFee || "0"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Schedule & Availability</CardTitle>
                    <CardDescription>Doctor's working hours and availability</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                      <Clock className="mx-auto h-10 w-10 mb-4 text-muted-foreground/50" />
                      <p>Schedule information not available.</p>
                      <p className="text-sm">Visit the Availability section to manage this doctor's schedule.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit Doctor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorView;
