
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Phone, Mail, Globe, MapPin, Clock, 
  Calendar, Award, Shield, Users, CreditCard 
} from 'lucide-react';
import { Clinic } from '@/admin/modules/clinics/types/Clinic';

interface ClinicProfileViewProps {
  profile: Clinic;
}

const ClinicProfileView: React.FC<ClinicProfileViewProps> = ({ profile }) => {
  const formatTime = (time: string) => {
    if (!time) return 'Closed';
    return new Date(`1970-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {profile.logo && (
              <div className="flex-shrink-0">
                <img 
                  src={profile.logo} 
                  alt={`${profile.name} Logo`}
                  className="w-24 h-24 object-contain rounded-lg border"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              {profile.tagline && (
                <p className="text-lg text-gray-600 mb-3">{profile.tagline}</p>
              )}
              {profile.description && (
                <p className="text-gray-700 mb-4">{profile.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {profile.establishedYear && (
                  <Badge variant="secondary">
                    <Calendar className="w-4 h-4 mr-1" />
                    Est. {profile.establishedYear}
                  </Badge>
                )}
                {profile.afterHoursAvailable && (
                  <Badge variant="outline">
                    <Clock className="w-4 h-4 mr-1" />
                    24/7 Emergency
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{profile.contact}</span>
              </div>
              {profile.alternatePhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{profile.alternatePhone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{profile.email}</span>
              </div>
              {profile.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {profile.website}
                  </a>
                </div>
              )}
            </div>
            <div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div>
                  <p>{profile.address}</p>
                  <p>{profile.city} - {profile.pincode}</p>
                  {profile.landmark && (
                    <p className="text-sm text-gray-600">Near {profile.landmark}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      {profile.businessHours && profile.businessHours.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Business Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {profile.businessHours.map((hours) => (
                <div key={hours.day} className="flex justify-between items-center py-1">
                  <span className="font-medium">{hours.day}</span>
                  <span className="text-gray-600">
                    {hours.isClosed ? (
                      'Closed'
                    ) : (
                      `${formatTime(hours.openTime!)} - ${formatTime(hours.closeTime!)}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Services & Specialties */}
      {(profile.services || profile.specialties) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Services & Specialties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.services && profile.services.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Services</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.services.map((service, index) => (
                    <Badge key={index} variant="outline">{service}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.specialties && profile.specialties.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Licensing & Accreditations */}
      {(profile.licenseNumber || (profile.accreditations && profile.accreditations.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Licensing & Accreditations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.licenseNumber && (
              <div>
                <h4 className="font-medium mb-2">Medical License</h4>
                <p><strong>License Number:</strong> {profile.licenseNumber}</p>
                {profile.licenseAuthority && (
                  <p><strong>Issuing Authority:</strong> {profile.licenseAuthority}</p>
                )}
                {profile.licenseExpiryDate && (
                  <p><strong>Expires:</strong> {new Date(profile.licenseExpiryDate).toLocaleDateString()}</p>
                )}
              </div>
            )}
            {profile.accreditations && profile.accreditations.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Accreditations</h4>
                <div className="space-y-2">
                  {/* {profile.accreditations.map((acc) => (
                    <div key={acc.id} className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-yellow-500" />
                      { <span>{acc.name} - {acc.issuingAuthority}</span> }
                    </div>
                  ))} */}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment & Insurance */}
      {(profile.paymentMethods || profile.insuranceAccepted) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment & Insurance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profile.paymentMethods && profile.paymentMethods.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Payment Methods</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.paymentMethods.map((method, index) => (
                    <Badge key={index} variant="outline">{method}</Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.insuranceAccepted && profile.insuranceAccepted.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Insurance Accepted</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.insuranceAccepted.map((insurance, index) => (
                    <Badge key={index} variant="secondary">{insurance}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClinicProfileView;
