
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Star, Clock, Calendar } from "lucide-react";
import { AppointmentDateTimeSelector } from "@/admin/components/AppointmentDateTimeSelector";

interface Clinic {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  rating: number;
  distance: string;
  specialties: string[];
  nextAvailable: string;
  image: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  period: 'morning' | 'afternoon' | 'evening';
}

const mockClinics: Clinic[] = [
  {
    id: 1,
    name: "City Medical Center",
    address: "123 Main Street, Downtown",
    phone: "+1 (555) 123-4567",
    email: "info@citymedical.com",
    rating: 4.8,
    distance: "0.5 km",
    specialties: ["Cardiology", "Neurology", "Orthopedics"],
    nextAvailable: "Today 2:30 PM",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "Wellness Healthcare",
    address: "456 Oak Avenue, Midtown",
    phone: "+1 (555) 987-6543",
    email: "contact@wellness.com",
    rating: 4.6,
    distance: "1.2 km",
    specialties: ["Dermatology", "Pediatrics", "General Medicine"],
    nextAvailable: "Tomorrow 9:00 AM",
    image: "/api/placeholder/300/200"
  }
];

export const ClinicsTab: React.FC = () => {
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [showDateTimeSelector, setShowDateTimeSelector] = useState(false);

  const handleBookAppointment = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setShowDateTimeSelector(true);
  };

  const handleDateTimeSelect = (date: Date, timeSlot: TimeSlot) => {
    console.log("Selected:", { clinic: selectedClinic, date, timeSlot });
    // Handle appointment booking logic here
  };

  const handleBackToList = () => {
    setShowDateTimeSelector(false);
    setSelectedClinic(null);
  };

  if (showDateTimeSelector && selectedClinic) {
    return (
      <div className="space-y-6">
        {/* Clinic Info Header */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img
                  src={selectedClinic.image}
                  alt={selectedClinic.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedClinic.name}
                  </h3>
                  <p className="text-gray-600 flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {selectedClinic.address}
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={handleBackToList}>
                ← Back to Clinics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Date Time Selector */}
        <AppointmentDateTimeSelector
          onDateTimeSelect={handleDateTimeSelect}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Clinics</h2>
          <p className="text-gray-600">Choose a clinic to book your appointment</p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {mockClinics.length} clinics available
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {mockClinics.map((clinic) => (
          <Card key={clinic.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="relative">
              <img
                src={clinic.image}
                alt={clinic.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                  {clinic.distance}
                </Badge>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {clinic.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(clinic.rating)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">
                      {clinic.rating}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{clinic.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{clinic.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{clinic.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Specialties:</p>
                <div className="flex flex-wrap gap-1">
                  {clinic.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="h-4 w-4" />
                  <span>{clinic.nextAvailable}</span>
                </div>
                <Button
                  onClick={() => handleBookAppointment(clinic)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
