
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Edit,
  Upload,
  Save,
  Loader2,
  ArrowLeft,
  Shield,
  Bell,
  Key,
  Clock,
  Activity,
  Settings,
  Camera,
  CheckCircle,
  XCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/admin/components/AdminLayout";
import { useNavigate } from "react-router-dom";
import AuthService from "@/services/authService";
import { Staff } from "@/admin/modules/user/types/User";
import { State } from "@/admin/modules/core/types/State";
import StateService from "@/admin/modules/core/services/state/stateService";
import UserService from "@/admin/modules/user/services/userService";

// interface UserProfile {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   role: string;
//   avatar?: string;
// address?: string;
// city?: string;
// state?: string;
//   pincode?: string;
//   dateOfBirth?: string;
//   gender?: string;
//   department?: string;
//   designation?: string;
//   joinDate?: string;
//   lastLogin?: string;
//   isActive: boolean;
//   preferences: {
//     notifications: boolean;
//     emailAlerts: boolean;
//     smsAlerts: boolean;
//     darkMode: boolean;
//   };
// }

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<Staff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Staff>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarView, setAvatarView] = useState<string>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [states, setStates] = useState<State[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchStates();
      }
    }, 300); // debounce time

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const fetchStates = async () => {
    try {
      setLoading(true);
      const response = await StateService.list();
      setStates(response.data); // expects [{ id, name }]
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (state) => {
    setFormData((prev) => ({
      ...prev,
      state: state,
    }));
    setShowDropdown(false);
    setSearchTerm(''); // optional: reset input
  };

  const { toast } = useToast();

  useEffect(() => {
    fetchUserProfile();
  }, []);


  const fetchUserProfile = async () => {
    try {
      setIsLoading(true);
      const res = await UserService.ggetStaffProfile();

      console.log("res.data.profile",res.data.profile)
      setUser(res.data);
      setAvatarView(res.data.profile)
      setFormData(res.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      console.log(formData)


      let staffForm = new FormData();


      if (avatarFile && avatarFile.name) {
        const fileSizeInMB = avatarFile.size / (1024 * 1024);
        if (fileSizeInMB > 5) {
          toast({
            title: "Error",
            description: "File size exceeds 5 MB. Please upload a smaller file.",
            variant: "destructive"
          });
          return;
        }
        staffForm.append('profile', avatarFile, avatarFile.name);
      } else {
        const emptyFile = new File([''], 'empty.txt', { type: 'text/plain' });
        staffForm.append('profile', emptyFile);
      }

      if (formData && typeof formData === 'object') {
        const doctorBLOB = new Blob([JSON.stringify(formData)], { type: 'application/json' });
        staffForm.append('staff', doctorBLOB);
      } else {
        console.error("Invalid staff Data");
      }

      const res = await UserService.saveOrUpdate(staffForm);
      if (res.data.status) {
        toast({
          title: "Success",
          description: "Profile updated successfully."
        });
        setIsEditModalOpen(false);
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive"
        });
      }

      fetchUserProfile();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);

      // Mock password change operation
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Password changed successfully."
      });

      setIsPasswordModalOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      console.error('Error changing password:', error);
      toast({
        title: "Error",
        description: "Failed to change password.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePreference = (key: keyof Staff['preferences'], value: boolean) => {
    if (user) {
      const updatedUser = {
        ...user,
        preferences: {
          ...user.preferences,
          [key]: value
        }
      };
      setUser(updatedUser);

      toast({
        title: "Preference Updated",
        description: `${key} has been ${value ? 'enabled' : 'disabled'}.`
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading user profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600">User profile not found.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);

    console.log(file)
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarView(url);
    } else {
      setAvatarView(null);
    }
  };

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
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={user.id ? "default" : "secondary"} className="px-3 py-1">
              {user.id ? (
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

            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={avatarView} alt={`${user?.firstname} ${user?.lastname}`} />
                      <AvatarFallback>
                        {user?.firstname.charAt(0)}{user?.lastname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <Label
                        htmlFor="avatar-upload"
                        className="cursor-pointer flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm"
                      >
                        <Camera className="w-4 h-4" />
                        Change Avatar
                      </Label>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstname || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter first name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastname || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter last name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        disabled
                        value={formData?.user?.email || ''}
                        // onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData?.user?.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={formData?.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          setFormData(prev => ({
                            ...prev,
                            dob: new Date(e.target.value) // convert string to Date
                          }))
                        }
                      />

                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender || ''} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter full address"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="space-y-2 relative">
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        value={formData.state?.name || searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setFormData((prev) => ({ ...prev, state: null }));
                        }}
                        onFocus={() => setShowDropdown(true)}
                        placeholder="Search and select a state"
                        className="w-full border px-3 py-2 rounded-md"
                      />

                      {showDropdown && (
                        <div className="absolute z-10 w-full bg-white border rounded shadow mt-1 max-h-60 overflow-y-auto">
                          {loading ? (
                            <div className="px-3 py-2 text-gray-500">Loading...</div>
                          ) : states.length > 0 ? (
                            states.map((state) => (
                              <div
                                key={state.id}
                                onClick={() => handleSelect(state)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {state.name}
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-gray-500">No states found</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode</Label>
                      <Input
                        id="pincode"
                        value={formData.pincode || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                        placeholder="Enter pincode"
                      />
                    </div>
                  </div>

                  {/* Professional Information */}
                  <Separator />
                  <h3 className="text-lg font-semibold">Professional Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        // value={formData.department || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                        placeholder="Enter department"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation">Designation</Label>
                      <Input
                        id="designation"
                        // value={formData.designation || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                        placeholder="Enter designation"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Profile Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={avatarView} alt={`${user.firstname} ${user.lastname}`} />
                    <AvatarFallback className="text-lg">
                      {user?.firstname.charAt(0)}{user?.lastname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{user.firstname} {user.lastname}</h2>
                    {/* <p className="text-gray-600">{user.designation}</p> */}
                    {/* <p className="text-sm text-gray-500">{user.department}</p> */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{user?.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{user?.user?.phone}</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant={user?.user?.role?.name === 'Admin' ? 'default' : 'secondary'}>
                    {user?.user?.role?.name}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Date of Birth</p>
                    <p className="font-medium">{user.dob ? new Date(user.dob).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-medium">{user.gender || 'Not specified'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{user.address || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-medium">{user.city || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">State & Pincode</p>
                    <p className="font-medium">{user?.state?.name || 'Not specified'} {user.pincode && `- ${user.pincode}`}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Details */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Join Date</p>
                    <p className="font-medium">{user.createdTime ? new Date(user.createdTime).toLocaleDateString() : 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium">
                      {user.createdTime ? new Date(user.createdTime

                      ).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee ID</p>
                    <p className="font-medium">EMP{user.id.toString().padStart(4, '0')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Work Experience</p>
                    <p className="font-medium">
                      {user.createdTime ? Math.floor((new Date().getTime() - new Date(user.createdTime).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) : 0} years
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Change Password</p>
                    <p className="text-sm text-gray-600">Update your account password</p>
                  </div>
                  <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Key className="w-4 h-4 mr-2" />
                        Change
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Current Password</Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          />
                        </div>
                        <div className="flex justify-end pt-4">
                          <Button onClick={handleChangePassword} disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              'Update Password'
                            )}
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Two-Factor Authentication</span>
                    <Badge variant="outline">Not Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Password Change</span>
                    <span className="text-sm text-gray-600">30 days ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Login Sessions</span>
                    <span className="text-sm text-gray-600">2 active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preferences & Activity */}
          <div className="space-y-6">
            {/* Notification Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-600" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push Notifications</span>
                  <Button
                    variant={user?.preferences?.notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference('notifications', !user?.preferences?.notifications)}
                  >
                    {user?.preferences?.notifications ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Alerts</span>
                  <Button
                    variant={user?.preferences?.emailAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference('emailAlerts', !user?.preferences?.emailAlerts)}
                  >
                    {user?.preferences?.emailAlerts ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">SMS Alerts</span>
                  <Button
                    variant={user?.preferences?.smsAlerts ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference('smsAlerts', !user?.preferences?.smsAlerts)}
                  >
                    {user?.preferences?.smsAlerts ? "On" : "Off"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-600" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Updated profile information</span>
                    <span className="text-gray-500 ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Changed password</span>
                    <span className="text-gray-500 ml-auto">1d ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Login from new device</span>
                    <span className="text-gray-500 ml-auto">3d ago</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>Updated notification settings</span>
                    <span className="text-gray-500 ml-auto">1w ago</span>
                  </div>
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
                  <span className="text-sm text-gray-600">Total Logins</span>
                  <span className="font-medium">547</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Views</span>
                  <span className="font-medium">23</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Account Created</span>
                  <span className="font-medium">
                    {user.createdTime ? new Date(user.createdTime).toLocaleDateString() : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <span className="font-medium text-green-600">85%</span>
                </div>
              </CardContent>
            </Card>

            {/* System Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-600" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Dark Mode</span>
                  <Button
                    variant={user?.preferences?.darkMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreference('darkMode', !user?.preferences?.darkMode)}
                  >
                    {user?.preferences?.darkMode ? "On" : "Off"}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Language</span>
                  <span className="text-sm text-gray-600">English</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Timezone</span>
                  <span className="text-sm text-gray-600">UTC-5</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserProfile;
