
import React from 'react';
import { useNavigate } from 'react-router-dom';
import FormDialog from '@/components/ui/FormDialog';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { 
  FileText, 
  TestTube, 
  FileBarChart, 
  FileImage, 
  Stethoscope, 
  Headphones, 
  Speaker, 
  FileAudio,
  Brain,
  Ear,
  Heart,
  FilePenLine,
  Pill,
  Microscope,
  Activity,
  FileX2
} from 'lucide-react';

interface ReportSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  visitId?: string;
}

interface ReportTypeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  implemented?: boolean;
}

const ReportType: React.FC<ReportTypeProps> = ({ 
  title, 
  description, 
  icon, 
  onClick, 
  implemented = false 
}) => {
  return (
    <Card 
      className={`flex flex-col justify-between items-center p-3 hover:bg-accent/50 cursor-pointer transition-colors hover:shadow-md ${
        !implemented ? 'opacity-60' : ''
      }`}
      onClick={onClick}
    >
      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-center">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
      </div>
    </Card>
  );
};

interface ReportCategoryProps {
  title: string;
  reports: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    implemented?: boolean;
  }>;
  onSelectReport: (type: string) => void;
}

const ReportCategory: React.FC<ReportCategoryProps> = ({ title, reports, onSelectReport }) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-semibold mb-3 text-foreground border-b pb-1">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {reports.map((report) => (
          <ReportType
            key={report.id}
            title={report.title}
            description={report.description}
            icon={report.icon}
            implemented={report.implemented}
            onClick={() => onSelectReport(report.id)}
          />
        ))}
      </div>
    </div>
  );
};

const ReportSelectorDialog: React.FC<ReportSelectorDialogProps> = ({
  open,
  onOpenChange,
  patientId,
  visitId
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleReportTypeSelect = (type: string) => {
    onOpenChange(false);
    
    // Create the base URL with visitId if provided
    const baseUrl = `/admin/patients/report/new/${type}/${patientId}`;
    const url = visitId ? `${baseUrl}?visitId=${visitId}` : baseUrl;
    
    // Check if the report type is implemented
    const implementedTypes = ['audiometry', 'bera', 'abr', 'speech', 'laboratory'];
    
    if (implementedTypes.includes(type)) {
      navigate(url);
    } else {
      toast({
        title: "Not Implemented",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} report form is not yet implemented.`,
        variant: "destructive"
      });
    }
  };

  const reportCategories = [
    {
      title: "ENT & Audiology",
      reports: [
        {
          id: 'audiometry',
          title: 'Audiometry',
          description: 'Hearing assessment tests',
          icon: <Headphones className="h-6 w-6 text-blue-500" />,
          implemented: true
        },
        {
          id: 'bera',
          title: 'BERA',
          description: 'Brainstem Evoked Response',
          icon: <FileAudio className="h-6 w-6 text-purple-500" />,
          implemented: true
        },
        {
          id: 'abr',
          title: 'ABR',
          description: 'Auditory Brainstem Response',
          icon: <Speaker className="h-6 w-6 text-violet-500" />,
          implemented: true
        },
        {
          id: 'speech',
          title: 'Speech',
          description: 'Speech & language evaluation',
          icon: <FileText className="h-6 w-6 text-indigo-500" />,
          implemented: true
        }
      ]
    },
    {
      title: "Laboratory",
      reports: [
        {
          id: 'laboratory',
          title: 'Laboratory',
          description: 'Blood tests, urine analysis',
          icon: <TestTube className="h-6 w-6 text-amber-500" />,
          implemented: true
        },
        {
          id: 'pathology',
          title: 'Pathology',
          description: 'Tissue examination reports',
          icon: <Microscope className="h-6 w-6 text-pink-500" />
        },
        {
          id: 'biochemistry',
          title: 'Biochemistry',
          description: 'Chemical analysis reports',
          icon: <Activity className="h-6 w-6 text-orange-500" />
        }
      ]
    },
    {
      title: "Imaging & Diagnostics",
      reports: [
        {
          id: 'radiography',
          title: 'Radiography',
          description: 'X-rays and imaging',
          icon: <FileImage className="h-6 w-6 text-green-500" />
        },
        {
          id: 'ultrasound',
          title: 'Ultrasound',
          description: 'Ultrasound scan reports',
          icon: <FileBarChart className="h-6 w-6 text-cyan-500" />
        },
        {
          id: 'mri',
          title: 'MRI',
          description: 'Magnetic Resonance Imaging',
          icon: <Brain className="h-6 w-6 text-teal-500" />
        },
        {
          id: 'ct_scan',
          title: 'CT Scan',
          description: 'Computed Tomography',
          icon: <FileImage className="h-6 w-6 text-slate-500" />
        }
      ]
    },
    {
      title: "Clinical Reports",
      reports: [
        {
          id: 'general',
          title: 'General',
          description: 'General medical reports',
          icon: <Stethoscope className="h-6 w-6 text-red-500" />
        },
        {
          id: 'dental',
          title: 'Dental',
          description: 'Oral examination findings',
          icon: <Pill className="h-6 w-6 text-emerald-500" />
        },
        {
          id: 'cardiology',
          title: 'Cardiology',
          description: 'Heart examination reports',
          icon: <Heart className="h-6 w-6 text-red-600" />
        },
        {
          id: 'consultation',
          title: 'Consultation',
          description: 'Doctor consultation notes',
          icon: <FilePenLine className="h-6 w-6 text-gray-600" />
        }
      ]
    }
  ];

  return (
    <FormDialog
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Select Report Type"
      maxWidth="max-w-4xl"
      maxHeight="max-h-[85vh]"
    >
      <div className="space-y-6 py-2">
        <p className="text-sm text-muted-foreground mb-4">
          Choose the type of report you want to create for this patient
        </p>
        
        {reportCategories.map((category) => (
          <ReportCategory
            key={category.title}
            title={category.title}
            reports={category.reports}
            onSelectReport={handleReportTypeSelect}
          />
        ))}
      </div>
    </FormDialog>
  );
};

export default ReportSelectorDialog;
