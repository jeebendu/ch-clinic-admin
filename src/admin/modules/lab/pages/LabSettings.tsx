
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Settings2 } from "lucide-react";

const LabSettings = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Lab Settings</h1>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings2 className="h-5 w-5 mr-2" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="labName">Laboratory Name</Label>
              <Input id="labName" defaultValue="Central Laboratory" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="labCode">Lab Code</Label>
              <Input id="labCode" defaultValue="LAB001" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="labAddress">Address</Label>
              <Textarea id="labAddress" defaultValue="123 Medical Center, Healthcare City" rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" defaultValue="+1 234-567-8900" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" defaultValue="lab@hospital.com" />
            </div>
          </CardContent>
        </Card>

        {/* Report Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Report Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reportTemplate">Default Report Template</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Template</SelectItem>
                  <SelectItem value="detailed">Detailed Template</SelectItem>
                  <SelectItem value="summary">Summary Template</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportHeader">Report Header Text</Label>
              <Input id="reportHeader" defaultValue="Laboratory Report" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reportFooter">Report Footer Text</Label>
              <Textarea id="reportFooter" defaultValue="This report is confidential and intended for medical use only." rows={2} />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="autoGenerate" />
              <Label htmlFor="autoGenerate">Auto-generate reports when tests complete</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="emailReports" defaultChecked />
              <Label htmlFor="emailReports">Email reports to patients automatically</Label>
            </div>
          </CardContent>
        </Card>

        {/* Workflow Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Workflow Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sampleCollection">Default Sample Collection Time</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">09:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="14:00">02:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultPriority">Default Test Priority</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="requireApproval" defaultChecked />
              <Label htmlFor="requireApproval">Require approval before releasing results</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="smsNotifications" />
              <Label htmlFor="smsNotifications">Send SMS notifications to patients</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="barcodeLabeling" defaultChecked />
              <Label htmlFor="barcodeLabeling">Use barcode labeling for samples</Label>
            </div>
          </CardContent>
        </Card>

        {/* Quality Control */}
        <Card>
          <CardHeader>
            <CardTitle>Quality Control</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="qcFrequency">Quality Control Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calibrationReminder">Calibration Reminder (days)</Label>
              <Input id="calibrationReminder" type="number" defaultValue="30" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="enableQC" defaultChecked />
              <Label htmlFor="enableQC">Enable quality control checks</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="alertCriticalValues" defaultChecked />
              <Label htmlFor="alertCriticalValues">Alert for critical values</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabSettings;
