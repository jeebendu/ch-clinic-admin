
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  XCircle,
  Edit,
  Loader2,
  ArrowLeft,
  Clock,
  CreditCard,
  Shield,
  Star,
  TrendingUp
} from "lucide-react";
import QRCode from 'qrcode';
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/admin/components/AdminLayout";
import ClinicService from "@/admin/modules/clinics/services/clinic/clinicService";
import { Clinic } from "@/admin/modules/clinics/types/Clinic";
import { useNavigate } from "react-router-dom";
import ClinicProfileView from "./clinic-profile/ClinicProfileView";

const ClinicProfilePage = () => {
  const navigate = useNavigate();
  const [clinic, setClinic] = useState<Clinic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    generateQRCode();
    fetchClinicData();
  }, []);

  const fetchClinicData = async () => {
    try {
      setIsLoading(true);
      const clinicData = await ClinicService.getById(1);
      setClinic(clinicData);
    } catch (error) {
      console.error('Error fetching clinic data:', error);
      toast({
        title: "Error",
        description: "Failed to load clinic data.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!qrCodeUrl || !clinic) return;

    const link = document.createElement('a');
    link.download = `${clinic.name.replace(/\s+/g, '_')}_Registration_QR.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Download Started",
      description: "QR code has been downloaded successfully."
    });
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading clinic profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!clinic) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600">Clinic data not found.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const clinicProfile = clinic;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6 space-y-8">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{clinic.name}</h1>
              <p className="text-gray-600 mt-1">Comprehensive Clinic Profile</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={clinic.active ? "default" : "secondary"} className="px-3 py-1">
              {clinic.active ? (
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
            
            <Button 
              variant="outline"
              onClick={() => navigate('/clinic-profile/edit')}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <ClinicProfileView profile={clinicProfile} />

            {/* Business Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  Business Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">245</div>
                    <div className="text-sm text-gray-600">Total Patients</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">48</div>
                    <div className="text-sm text-gray-600">This Month</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">12</div>
                    <div className="text-sm text-gray-600">Today</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">4.8</div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subscription & Billing */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                  Subscription & Billing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Current Plan</p>
                    <p className="font-medium text-lg">{clinic.plan?.name || 'Basic Plan'}</p>
                    <Badge variant="outline" className="mt-1">Active</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Next Billing</p>
                    <p className="font-medium">March 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Cost</p>
                    <p className="font-medium text-lg">₹2,499</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-medium">•••• 4532</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Encryption</span>
                    <Badge variant="default">AES-256</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">HIPAA Compliance</span>
                    <Badge variant="default">Certified</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Security Audit</span>
                    <span className="text-sm text-gray-600">Jan 15, 2025</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  Timeline & History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium">
                      {clinic.createdTime ? new Date(clinic.createdTime).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Modified</p>
                    <p className="font-medium">
                      {clinic.modifiedTime ? new Date(clinic.modifiedTime).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium">Today, 2:30 PM</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Logins</p>
                    <p className="font-medium">1,247</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code & Quick Stats */}
          <div className="space-y-6">
            {/* QR Code Section */}
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
                  <Badge variant={clinic.active ? "default" : "secondary"}>
                    {clinic.active ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Clinic ID</span>
                  <span className="font-mono text-sm">{clinic.id}</span>
                </div>
                
                {clinic.uid && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">UID</span>
                    <span className="font-mono text-sm">{clinic.uid}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Users</span>
                  <span className="font-medium">12</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Storage Used</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
              </CardContent>
            </Card>

            {/* Performance Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  Performance Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  <div className="text-4xl font-bold text-green-600">92</div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Patient Satisfaction</span>
                    <span className="text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>System Uptime</span>
                    <span className="text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time</span>
                    <span className="text-yellow-600">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-600" />
                  Recent Activities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Profile updated</span>
                    <span className="text-gray-500 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>New patient registered</span>
                    <span className="text-gray-500 ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>System backup completed</span>
                    <span className="text-gray-500 ml-auto">1d ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Plan upgraded</span>
                    <span className="text-gray-500 ml-auto">3d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ClinicProfilePage;
