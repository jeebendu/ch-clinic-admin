
import React from "react";
import { ClinicRequest } from "../../types/ClinicRequest";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Edit, Trash, UserX, Building, Mail, Phone, MapPin, Calendar, User } from "lucide-react";

interface ClinicRequestCardListProps {
  requests: ClinicRequest[];
  onDelete: (id: number) => void;
  onEdit: (request: ClinicRequest) => void;
  onApprove: (request: ClinicRequest) => void;
  onReject: (request: ClinicRequest) => void;
}

const ClinicRequestCardList = ({ 
  requests, 
  onDelete, 
  onEdit, 
  onApprove, 
  onReject 
}: ClinicRequestCardListProps) => {
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString() + ' ' + 
           new Date(dateStr).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Approved':
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">✅ Approved</Badge>;
      case 'Rejected':
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">❌ Rejected</Badge>;
      case 'Pending':
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">⏳ Pending</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {requests.length === 0 ? (
        <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-lg border">
          <p className="text-muted-foreground">No clinic requests found</p>
        </div>
      ) : (
        requests.map((request) => (
          <Card key={request.id} className="overflow-hidden hover:shadow-md transition-all border-l-4 border-l-primary">
            <div className="flex flex-col sm:flex-row">
              {/* Profile Summary Section - First Column */}
              <div className="flex items-center p-3 sm:p-4 gap-3 w-full sm:w-[320px] bg-gradient-to-br from-primary/5 to-primary/10 flex-shrink-0">
                <div className="bg-primary text-white p-3 rounded-full">
                  <Building className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                    {request.title}
                  </h3>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                    <Building className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">ID: {request.id}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {request.name}
                  </div>
                </div>
              </div>

              {/* Main Content Section */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col sm:flex-row justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 mb-3 sm:mb-0 flex-1">
                  
                  {/* Contact Info */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Contact Info</div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{request.contact}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{request.email}</span>
                    </div>
                    {request.contactName && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <User className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{request.contactName}</span>
                      </div>
                    )}
                  </div>

                  {/* Location Info */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Location</div>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{request.address}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {request.city}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 flex-shrink-0" />
                      <span>{formatDate(request.requestDate)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">Status</div>
                    <div>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex justify-end items-start mt-2 sm:mt-0 sm:w-[140px] flex-shrink-0">
                  <div className="flex gap-1 flex-wrap">
                    {request.status === 'Pending' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onApprove(request)} 
                          className="h-7 px-2 text-green-500 hover:text-green-700 hover:bg-green-50"
                          title="Approve"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onReject(request)} 
                          className="h-7 px-2 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50"
                          title="Reject"
                        >
                          <UserX className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onEdit(request)} 
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => onDelete(request.id)} 
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default ClinicRequestCardList;
