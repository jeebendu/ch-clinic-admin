
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Appointment } from '../types/Appointment';
import { X, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { useTenant } from '@/hooks/use-tenant';
import { getTenantFileUrl } from '@/utils/tenantUtils';

interface AppointmentPrintLayoutProps {
  appointment: Appointment;
  isOpen: boolean;
  onClose: () => void;
}

const AppointmentPrintLayout: React.FC<AppointmentPrintLayoutProps> = ({
  appointment,
  isOpen,
  onClose
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { tenant } = useTenant();
  
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onAfterPrint: onClose,
  });
  
  const formatDate = (date: string | Date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'dd MMM yyyy');
  };
  
  const formatTime = (date: string | Date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'hh:mm a');
  };
  
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const logoUrl = tenant?.logo ? getTenantFileUrl(tenant.logo, 'logo') : '';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-screen overflow-auto p-0">
        <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Appointment Details</h2>
          <div className="flex gap-2">
            <Button onClick={handlePrint} size="sm">
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div ref={printRef} className="p-8 bg-white">
          {/* Clinic Header */}
          <div className="flex justify-between items-center border-b pb-4">
            <div className="flex items-center">
              {logoUrl && (
                <img src={logoUrl} alt="Clinic Logo" className="h-16 mr-4" />
              )}
              <div>
                <h1 className="text-xl font-bold">{tenant?.title || 'Medical Clinic'}</h1>
                <p className="text-gray-500">{tenant?.description || 'Healthcare Services'}</p>
                <p className="text-gray-500">{tenant?.phone || 'Phone: (555) 123-4567'}</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-semibold">Appointment Details</h2>
              <p className="text-sm text-gray-500">ID: {appointment.id}</p>
              <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(appointment.status)}`}>
                {appointment.status}
              </div>
            </div>
          </div>
          
          {/* Patient and Appointment Info */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                <div className="mt-2 border rounded-md p-4">
                  <p className="font-semibold text-lg">{appointment.patient?.firstname} {appointment.patient?.lastname}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <p className="text-gray-500">ID</p>
                      <p>{appointment.patient?.id || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Gender</p>
                      <p>{appointment.patient?.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Age</p>
                      <p>{appointment.patient?.age || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p>{appointment.patient?.user?.phone || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Email</p>
                      <p>{appointment.patient?.user?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Doctor Information</h3>
                <div className="mt-2 border rounded-md p-4">
                  <p className="font-semibold text-lg">{appointment.doctor?.firstname} {appointment.doctor?.lastname}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div className="col-span-2">
                      <p className="text-gray-500">Specialization</p>
                      <p>{appointment.doctor?.specializationList?.[0]?.name || 'General'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Contact</p>
                      <p>{appointment.doctor?.phone || appointment.doctor?.mobile || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Appointment Details</h3>
                <div className="mt-2 border rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Date</p>
                      <p className="font-medium">{formatDate(appointment.appointmentStart || '')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Time</p>
                      <p className="font-medium">{formatTime(appointment.appointmentStart || '')}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p>{appointment.duration || 30} minutes</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Type</p>
                      <p>{appointment.type || 'Consultation'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500">Reason</p>
                      <p>{appointment.reason || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Notes & Instructions</h3>
                <div className="mt-2 border rounded-md p-4 h-[140px] overflow-auto">
                  <p className="text-sm">{appointment.notes || 'No special instructions.'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 pt-4 border-t text-sm text-gray-500">
            <div className="flex justify-between">
              <div>
                <p>Printed on: {format(new Date(), 'dd MMM yyyy, hh:mm a')}</p>
                <p>Appointment booked by: {appointment.doctor?.firstname} {appointment.doctor?.lastname}</p>
              </div>
              <div className="text-right">
                <p>For any changes, please contact us at:</p>
                <p>{tenant?.phone || '(555) 123-4567'}</p>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p>Thank you for choosing {tenant?.title || 'our clinic'}.</p>
              <p className="mt-1">We look forward to providing you with excellent care.</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentPrintLayout;
