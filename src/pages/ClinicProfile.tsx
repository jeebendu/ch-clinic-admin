
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Download, 
  QrCode,
  Globe,
  Calendar,
  Users,
  CheckCircle,
  XCircle
} from "lucide-react";
import QRCode from 'qrcode';
import { Clinic } from "@/admin/modules/clinics/types/Clinic";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/admin/components/AdminLayout";

// Mock clinic data - in real app, this would come from API
const mockClinic: Clinic = {
  id: 1,
  name: "HealthCare Plus Clinic",
  email: "contact@healthcareplus.com",
  contact: "+1 (555) 123-4567",
  address: "123 Medical Center Drive, Suite 200, Healthcare City, HC 12345",
  city: "Healthcare City",
  pincode: 12345,
  plan: {
    id: 1,
    name: "Premium Plan"
  },
  state: {
    id: 1,
    name: "Healthcare State"
  },
  district: {
    id: 1,
    name: "Medical District"
  },
  country: {
    id: 1,
    name: "United States"
  },
  active: true,
  createdTime: new Date('2023-01-15'),
  modifiedTime: new Date('2024-12-01')
};

const ClinicProfile = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Automatically generate QR code on component mount
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      setIsGeneratingQR(true);
      const baseUrl = window.location.origin;
      const registrationUrl = `${baseUrl}/register-patient`;
      
      const qrDataUrl = await QRCode.toDataURL(registrationUrl, {
        width: 512,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
      
      toast({
        title: "QR Code Generated",
        description: "QR code for patient registration has been generated successfully."
      });
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingQR(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `${mockClinic.name.replace(/\s+/g, '_')}_Registration_QR.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "QR code has been downloaded successfully."
    });
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{mockClinic.name}</h1>
            <p className="text-gray-600 mt-1">Clinic Profile & Patient Registration</p>
          </div>
          <Badge variant={mockClinic.active ? "default" : "secondary"} className="px-3 py-1">
            {mockClinic.active ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 mr-1" />
                Inactive
              </>
            )}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clinic Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{mockClinic.contact}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{mockClinic.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Plan</p>
                      <p className="font-medium">{mockClinic.plan.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Branches</p>
                      <p className="font-medium">{mockClinic.branches?.length || 0} Active</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Address Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Address</p>
                    <p className="font-medium">{mockClinic.address}</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">City</p>
                      <p className="font-medium">{mockClinic.city}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">District</p>
                      <p className="font-medium">{mockClinic.district?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">State</p>
                      <p className="font-medium">{mockClinic.state?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pincode</p>
                      <p className="font-medium">{mockClinic.pincode}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {mockClinic.createdTime ? new Date(mockClinic.createdTime).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Modified</p>
                    <p className="font-medium">
                      {mockClinic.modifiedTime ? new Date(mockClinic.modifiedTime).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR Code Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-indigo-600" />
                  Patient Registration QR
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Generate a QR code that patients can scan to register for walk-in appointments.
                </p>
                
                <div className="flex flex-col gap-3">
                 
                  
                  {qrCodeUrl && (
                    <>
                      <div className="flex justify-center p-4 bg-white border rounded-lg">
                        <img 
                          src={qrCodeUrl} 
                          alt="Patient Registration QR Code"
                          className="w-48 h-48"
                        />
                      </div>
                      
                      <Button 
                        onClick={downloadQRCode}
                        variant="outline"
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download HD QR Code
                      </Button>
                      
                      <div className="text-xs text-gray-500 text-center">
                        <p>QR Code links to:</p>
                        <p className="font-mono break-all">
                          {window.location.origin}/register-patient
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge variant={mockClinic.active ? "default" : "secondary"}>
                    {mockClinic.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Clinic ID</span>
                  <span className="font-mono text-sm">{mockClinic.id}</span>
                </div>
                
                {mockClinic.uid && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">UID</span>
                    <span className="font-mono text-sm">{mockClinic.uid}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClinicProfile;
