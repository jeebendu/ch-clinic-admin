import { useEffect, useState } from "react";
import { Loader2, MapPin, Navigation } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Appointment } from "../../types/Appointment";
import { DoctorBranch } from "../../types/DoctorClinic";
import SpecialityService from "@/admin/modules/doctor/doctor-speciality/services/SpecialityService";
import { toast } from "@/hooks/use-toast";
import ChipSelector from "@/components/ui/ChipSelector";
import DoctorService from "@/admin/modules/doctor/services/doctorService";


interface ClinicSelectionStepProps {
  appointment: Appointment;
  onDoctorBranchSelect: (branch: DoctorBranch) => void;
}


export function ClinicSelectionStep({
  appointment,
  onDoctorBranchSelect
}: ClinicSelectionStepProps) {

  const [selectedSpecializations, setSelectedSpecializations] = useState<Array<{ id: number, name: string }>>([]);
  const [availableSpecializations, setAvailableSpecializations] = useState<Array<{ id: number, name: string }>>([]);
  const [loadingSpecializations, setLoadingSpecializations] = useState(false);
  const [specialIds, setSpecialIds] = useState<Number[]>([]);

  const [branchList, setBranchList] = useState<DoctorBranch[]>([]);

  const handleClinicSelection = (drbranchId: string) => {
    const selectedBranch = branchList.find(drbranch => drbranch.id == Number(drbranchId));
    if (selectedBranch) {
      onDoctorBranchSelect(selectedBranch);

    }
  };
 

  useEffect(() => {
    const fetchData = async () => {
      setLoadingSpecializations(true);
      try {
        const specializationResponse = await SpecialityService.list();
        if (specializationResponse && Array.isArray(specializationResponse)) {
          const specializations = specializationResponse.map((spec: any) => ({
            id: spec.id,
            name: spec.name
          }));
          setAvailableSpecializations(specializations);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load form data",
          variant: "destructive",
        });
      } finally {
        setLoadingSpecializations(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchDoctorBranchList();
  }, [specialIds]);


  const onSpecializationAdded = (data: any) => {
    setSelectedSpecializations(data);
  const ids = data.map(item => item.id);
  setSpecialIds(ids);
};

  const fetchDoctorBranchList = async () => {
    const data = await DoctorService.doctorbranchFilter(specialIds);
    setBranchList(data);
    if(!appointment?.doctorBranch?.id){
      onDoctorBranchSelect(data[0]);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        {loadingSpecializations ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading specializations...</span>
          </div>
        ) : (
          <ChipSelector
            label="Specializations"
            availableItems={availableSpecializations}
            selectedItems={selectedSpecializations}
            onSelectionChange={(data) => { onSpecializationAdded(data) }}
            placeholder="No specializations selected"
            searchPlaceholder="Search specializations..."
            disabled={false}
          />
        )}

        {/* {appointment.doctorBranch && ( */}
          <>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Location</h4>
              <RadioGroup
                value={String(appointment?.doctorBranch?.id)}
                onValueChange={handleClinicSelection}
                className="space-y-3"
              >
                <div
                  className={`bg-slate-50 rounded-lg p-4 transition-colors ${appointment?.doctorBranch?.id ? "border-2 border-primary shadow-sm" : "border border-gray-100"
                    }`}
                >
                  <div className="flex items-start">
                    <RadioGroupItem value={String(appointment?.doctorBranch?.id)} id={`clinic-${appointment?.doctorBranch?.id}`} className="mt-1" />
                    <Label htmlFor={`clinic-${appointment?.doctorBranch?.id}`} className="ml-3 cursor-pointer flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-teal-500 mr-1 flex-shrink-0" />
                              <div className="font-medium text-lg">Doctor: {appointment?.doctorBranch?.doctor?.firstname} {appointment?.doctorBranch?.doctor?.lastname}</div>
                          </div>
                              <div className="text-sm text-gray-500 ml-5">Exp: {appointment?.doctorBranch?.doctor?.expYear}</div>
                              <div className="text-sm text-gray-500 ml-5">Specialization: {appointment?.doctorBranch?.doctor?.specialization}</div>
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Navigation className="h-4 w-4 mr-1" />
                          <span className="text-sm">2.3 km</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {branchList.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Also Available At</h4>
                <RadioGroup
                  value={String(appointment?.doctorBranch?.id)}
                  onValueChange={handleClinicSelection}
                  className="space-y-3"
                >
                  {branchList.map((drBranch) => (
                    <div
                      key={drBranch.id}
                      className="bg-slate-50 rounded-lg p-4 transition-colors border border-gray-100"

                    >
                      <div className="flex items-start">
                        <RadioGroupItem value={String(drBranch.id)} id={`clinic-${drBranch.id}`} className="mt-1" />
                        <Label htmlFor={`clinic-${drBranch.id}`} className="ml-3 cursor-pointer flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 text-sky-500 mr-1 flex-shrink-0" />
                                <div className="font-medium text-lg">Doctor: {drBranch?.doctor?.firstname} {drBranch?.doctor?.lastname}</div>
                              </div>
                              <div className="text-sm text-gray-500 ml-5">Exp: {drBranch?.doctor?.expYear}</div>
                              <div className="text-sm text-gray-500 ml-5">Specialization: {drBranch?.doctor?.specialization}</div>
                            </div>
                            <div className="flex items-center text-gray-500">
                              <Navigation className="h-4 w-4 mr-1" />
                              <span className="text-sm">5.1 km</span>
                            </div>
                          </div>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </>
        {/* )} */}
      </div>
    </div>
  );
}