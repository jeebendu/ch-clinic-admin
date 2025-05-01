
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Bell, Mail, Phone, FilePlus, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';

interface Reminder {
  id?: number;
  patientId: number;
  visitId?: number;
  reminderDate: string;
  reminderType: 'follow-up' | 'medication' | 'test-results' | 'appointment';
  description: string;
  notificationType: 'sms' | 'email' | 'both' | 'none';
  status: 'scheduled' | 'sent' | 'completed' | 'cancelled';
  notes?: string;
}

// Mock data - would be replaced by real API calls
const mockReminders: Reminder[] = [
  {
    id: 1,
    patientId: 1,
    visitId: 1,
    reminderDate: addDays(new Date(), 7).toISOString(),
    reminderType: 'follow-up',
    description: 'Audiometry follow-up visit',
    notificationType: 'both',
    status: 'scheduled',
    notes: 'Patient should bring previous test results.'
  },
  {
    id: 2,
    patientId: 1,
    visitId: 1,
    reminderDate: addDays(new Date(), 2).toISOString(),
    reminderType: 'medication',
    description: 'Medication refill reminder',
    notificationType: 'sms',
    status: 'scheduled'
  },
  {
    id: 3,
    patientId: 1,
    visitId: 2,
    reminderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reminderType: 'test-results',
    description: 'Test results review',
    notificationType: 'email',
    status: 'sent'
  }
];

interface PatientRemindersSectionProps {
  patientId: number;
}

const PatientRemindersSection: React.FC<PatientRemindersSectionProps> = ({ patientId }) => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<Reminder[]>(mockReminders);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  
  const [newReminder, setNewReminder] = useState<Reminder>({
    patientId,
    reminderDate: addDays(new Date(), 7).toISOString(),
    reminderType: 'follow-up',
    description: '',
    notificationType: 'sms',
    status: 'scheduled'
  });

  const handleAddReminder = () => {
    const updatedReminders = [
      {
        ...newReminder,
        id: reminders.length > 0 ? Math.max(...reminders.map(reminder => reminder.id || 0)) + 1 : 1,
      },
      ...reminders
    ];
    
    setReminders(updatedReminders);
    setIsAddReminderOpen(false);
    
    toast({
      title: "Reminder Scheduled",
      description: `A ${newReminder.reminderType} reminder has been scheduled for ${format(new Date(newReminder.reminderDate), 'MMM d, yyyy')}.`
    });
    
    // Reset form
    setNewReminder({
      patientId,
      reminderDate: addDays(new Date(), 7).toISOString(),
      reminderType: 'follow-up',
      description: '',
      notificationType: 'sms',
      status: 'scheduled'
    });
  };

  const updateReminderStatus = (reminderId: number | undefined, newStatus: 'scheduled' | 'sent' | 'completed' | 'cancelled') => {
    if (!reminderId) return;
    
    const updatedReminders = reminders.map(reminder => {
      if (reminder.id === reminderId) {
        return {
          ...reminder,
          status: newStatus
        };
      }
      return reminder;
    });
    
    setReminders(updatedReminders);
    
    toast({
      title: "Reminder Status Updated",
      description: `Reminder status has been updated to ${newStatus}.`
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Scheduled</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Sent</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReminderTypeIcon = (type: string) => {
    switch (type) {
      case 'follow-up':
        return <Calendar className="h-4 w-4 text-blue-600" />;
      case 'medication':
        return <FilePlus className="h-4 w-4 text-purple-600" />;
      case 'test-results':
        return <Check className="h-4 w-4 text-green-600" />;
      case 'appointment':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationTypeIcon = (type: string) => {
    switch (type) {
      case 'sms':
        return <Phone className="h-4 w-4" />;
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'both':
        return <Bell className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Follow-Ups & Reminders</CardTitle>
              <CardDescription>Schedule and manage patient follow-ups</CardDescription>
            </div>
            <Button size="sm" onClick={() => setIsAddReminderOpen(true)}>
              <FilePlus className="mr-2 h-4 w-4" />
              Schedule Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        {getReminderTypeIcon(reminder.reminderType)}
                        {reminder.description || reminder.reminderType.replace('-', ' ')}
                        <span className="ml-2">{getStatusBadge(reminder.status)}</span>
                      </h3>
                      <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {formatDate(reminder.reminderDate)}
                        {reminder.notificationType !== 'none' && (
                          <span className="flex items-center gap-1">
                            {getNotificationTypeIcon(reminder.notificationType)}
                            <span className="capitalize">{reminder.notificationType}</span> notification
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {reminder.status === 'scheduled' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => updateReminderStatus(reminder.id, 'completed')}>
                            <Check className="mr-1 h-4 w-4" />
                            Mark Complete
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600" onClick={() => updateReminderStatus(reminder.id, 'cancelled')}>
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {reminder.notes && (
                    <div className="mt-3 pt-3 border-t">
                      <h4 className="text-sm font-medium mb-1">Notes</h4>
                      <p className="text-sm">{reminder.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reminders scheduled for this patient</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Reminder Dialog */}
      <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Schedule Reminder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reminderType">Reminder Type</Label>
              <Select 
                value={newReminder.reminderType} 
                onValueChange={(value: 'follow-up' | 'medication' | 'test-results' | 'appointment') => 
                  setNewReminder({...newReminder, reminderType: value})
                }
              >
                <SelectTrigger id="reminderType">
                  <SelectValue placeholder="Select reminder type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                  <SelectItem value="medication">Medication Reminder</SelectItem>
                  <SelectItem value="test-results">Test Results</SelectItem>
                  <SelectItem value="appointment">Appointment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newReminder.description}
                onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                placeholder="Brief description of the reminder"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reminderDate">Reminder Date</Label>
              <Input
                id="reminderDate"
                type="date"
                value={new Date(newReminder.reminderDate).toISOString().slice(0, 10)}
                onChange={(e) => setNewReminder({...newReminder, reminderDate: new Date(e.target.value).toISOString()})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notificationType">Notification Type</Label>
              <Select 
                value={newReminder.notificationType} 
                onValueChange={(value: 'sms' | 'email' | 'both' | 'none') => 
                  setNewReminder({...newReminder, notificationType: value})
                }
              >
                <SelectTrigger id="notificationType">
                  <SelectValue placeholder="Select notification type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="both">Both SMS & Email</SelectItem>
                  <SelectItem value="none">No Notification</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this reminder"
                value={newReminder.notes || ''}
                onChange={(e) => setNewReminder({...newReminder, notes: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsAddReminderOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddReminder}>Schedule Reminder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientRemindersSection;
