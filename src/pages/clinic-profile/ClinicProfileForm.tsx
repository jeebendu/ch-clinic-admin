
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Upload, Clock, Shield, CreditCard, 
  Globe, Plus, X, Palette 
} from 'lucide-react';
import { ClinicProfile, DAYS_OF_WEEK, INSURANCE_PROVIDERS, PAYMENT_METHODS } from '../types/ClinicProfile';

interface ClinicProfileFormProps {
  profile: Partial<ClinicProfile>;
  onChange: (field: string, value: any) => void;
  isLoading?: boolean;
}

const ClinicProfileForm: React.FC<ClinicProfileFormProps> = ({ 
  profile, 
  onChange, 
  isLoading 
}) => {
  const [newService, setNewService] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleInputChange = (field: string, value: any) => {
    onChange(field, value);
  };

  const addService = () => {
    if (newService.trim()) {
      const services = profile.services || [];
      onChange('services', [...services, newService.trim()]);
      setNewService('');
    }
  };

  const removeService = (index: number) => {
    const services = profile.services || [];
    onChange('services', services.filter((_, i) => i !== index));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim()) {
      const specialties = profile.specialties || [];
      onChange('specialties', [...specialties, newSpecialty.trim()]);
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    const specialties = profile.specialties || [];
    onChange('specialties', specialties.filter((_, i) => i !== index));
  };

  const toggleInsurance = (insurance: string) => {
    const current = profile.insuranceAccepted || [];
    const exists = current.includes(insurance);
    if (exists) {
      onChange('insuranceAccepted', current.filter(i => i !== insurance));
    } else {
      onChange('insuranceAccepted', [...current, insurance]);
    }
  };

  const togglePaymentMethod = (method: string) => {
    const current = profile.paymentMethods || [];
    const exists = current.includes(method);
    if (exists) {
      onChange('paymentMethods', current.filter(m => m !== method));
    } else {
      onChange('paymentMethods', [...current, method]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Clinic Name *</Label>
              <Input
                id="name"
                value={profile.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter clinic name"
              />
            </div>
            <div>
              <Label htmlFor="tagline">Tagline</Label>
              <Input
                id="tagline"
                value={profile.tagline || ''}
                onChange={(e) => handleInputChange('tagline', e.target.value)}
                placeholder="Your clinic's motto or tagline"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your clinic and services"
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="establishedYear">Established Year</Label>
              <Input
                id="establishedYear"
                type="number"
                value={profile.establishedYear || ''}
                onChange={(e) => handleInputChange('establishedYear', parseInt(e.target.value) || undefined)}
                placeholder="2010"
              />
            </div>
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profile.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourclinic.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="info@yourclinic.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={profile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+91 98765 43210"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                value={profile.alternatePhone || ''}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                placeholder="+91 98765 43211"
              />
            </div>
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                value={profile.emergencyContact || ''}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="+91 98765 43220"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={profile.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Street address, area, locality"
              rows={2}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={profile.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value)}
                placeholder="Mumbai"
              />
            </div>
            <div>
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                type="number"
                value={profile.pincode || ''}
                onChange={(e) => handleInputChange('pincode', parseInt(e.target.value) || undefined)}
                placeholder="400001"
              />
            </div>
            <div>
              <Label htmlFor="landmark">Landmark</Label>
              <Input
                id="landmark"
                value={profile.landmark || ''}
                onChange={(e) => handleInputChange('landmark', e.target.value)}
                placeholder="Near City Hospital"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Assets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Digital Assets
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={profile.logo || ''}
                onChange={(e) => handleInputChange('logo', e.target.value)}
                placeholder="https://example.com/logo.png"
              />
              {profile.logo && (
                <div className="mt-2">
                  <img src={profile.logo} alt="Logo preview" className="w-16 h-16 object-contain border rounded" />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="banner">Banner URL</Label>
              <Input
                id="banner"
                value={profile.banner || ''}
                onChange={(e) => handleInputChange('banner', e.target.value)}
                placeholder="https://example.com/banner.jpg"
              />
            </div>
            <div>
              <Label htmlFor="favicon">Favicon URL</Label>
              <Input
                id="favicon"
                value={profile.favicon || ''}
                onChange={(e) => handleInputChange('favicon', e.target.value)}
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services & Specialties */}
      <Card>
        <CardHeader>
          <CardTitle>Services & Specialties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Services</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add a service"
                onKeyPress={(e) => e.key === 'Enter' && addService()}
              />
              <Button type="button" onClick={addService} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(profile.services || []).map((service, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {service}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeService(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Specialties</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add a specialty"
                onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
              />
              <Button type="button" onClick={addSpecialty} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {(profile.specialties || []).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeSpecialty(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Licensing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Licensing & Certifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="licenseNumber">License Number</Label>
              <Input
                id="licenseNumber"
                value={profile.licenseNumber || ''}
                onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                placeholder="MH-MED-2023-001"
              />
            </div>
            <div>
              <Label htmlFor="licenseAuthority">License Authority</Label>
              <Input
                id="licenseAuthority"
                value={profile.licenseAuthority || ''}
                onChange={(e) => handleInputChange('licenseAuthority', e.target.value)}
                placeholder="Maharashtra Medical Council"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Insurance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment & Insurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Payment Methods Accepted</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
              {PAYMENT_METHODS.map((method) => (
                <Button
                  key={method}
                  variant={profile.paymentMethods?.includes(method) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePaymentMethod(method)}
                  className="justify-start"
                >
                  {method}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Insurance Providers Accepted</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {INSURANCE_PROVIDERS.map((insurance) => (
                <Button
                  key={insurance}
                  variant={profile.insuranceAccepted?.includes(insurance) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleInsurance(insurance)}
                  className="justify-start"
                >
                  {insurance}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            SEO & Meta Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={profile.metaTitle || ''}
              onChange={(e) => handleInputChange('metaTitle', e.target.value)}
              placeholder="Your Clinic Name - Quality Healthcare Services"
            />
          </div>
          <div>
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={profile.metaDescription || ''}
              onChange={(e) => handleInputChange('metaDescription', e.target.value)}
              placeholder="Brief description of your clinic for search engines"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClinicProfileForm;
