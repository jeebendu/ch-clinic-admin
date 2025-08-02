
import React from 'react';
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

interface ReportTypeProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const ReportType: React.FC<ReportTypeProps> = ({ title, description, icon, onClick }) => {
  return (
    <Card 
      className="flex flex-col justify-between items-center p-4 hover:bg-accent/50 cursor-pointer transition-colors hover:shadow-md"
      onClick={onClick}
    >
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        {icon}
      </div>
      <div className="text-center">
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
};

interface ReportTypeSelectorProps {
  onSelectReportType: (type: string) => void;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({ onSelectReportType }) => {
  const reportTypes = [
    {
      id: 'laboratory',
      title: 'Laboratory',
      description: 'Blood tests, urine analysis, and lab reports',
      icon: <TestTube className="h-8 w-8 text-amber-500" />
    },
    {
      id: 'audiometry',
      title: 'Audiometry',
      description: 'Hearing assessment tests',
      icon: <Headphones className="h-8 w-8 text-blue-500" />
    },
    {
      id: 'bera',
      title: 'BERA',
      description: 'Brainstem Evoked Response Audiometry',
      icon: <FileAudio className="h-8 w-8 text-purple-500" />
    },
    {
      id: 'abr',
      title: 'ABR',
      description: 'Auditory Brainstem Response',
      icon: <Speaker className="h-8 w-8 text-violet-500" />
    },
    {
      id: 'speech',
      title: 'Speech',
      description: 'Speech & language evaluation',
      icon: <FileText className="h-8 w-8 text-indigo-500" />
    },
    {
      id: 'dental',
      title: 'Dental',
      description: 'Oral examination findings',
      icon: <Pill className="h-8 w-8 text-emerald-500" />
    },
    {
      id: 'radiography',
      title: 'Radiography',
      description: 'X-rays and imaging',
      icon: <FileImage className="h-8 w-8 text-green-500" />
    },
    {
      id: 'general',
      title: 'General',
      description: 'General medical reports',
      icon: <FileBarChart className="h-8 w-8 text-red-500" />
    }
  ];

  return (
    <div className="py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => (
          <ReportType
            key={type.id}
            title={type.title}
            description={type.description}
            icon={type.icon}
            onClick={() => onSelectReportType(type.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ReportTypeSelector;
