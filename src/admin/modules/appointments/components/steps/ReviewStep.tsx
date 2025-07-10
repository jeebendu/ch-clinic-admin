
import { User, Building, Calendar } from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "../../types/Appointment";


interface ReviewStepProps {
  appointmentObj: Appointment
}

export function ReviewStep({appointmentObj}: ReviewStepProps) {
  
  // const clinic = getClinicById(selectedClinic);
  // const patient = getFamilyMemberById(selectedMember);

  // Format date for better display
  // let formattedDate = "";
  // if (selectedDate) {
  //   try {
  //     const date = new Date(selectedDate);
  //     formattedDate = format(date, "EEEE, MMMM d, yyyy");
  //   } catch (e) {
  //     formattedDate = selectedDate;
  //   }
  // }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        

        <div className="bg-white rounded-lg border p-4 space-y-2">
          <div className="flex items-center mb-1">
            <User className="h-4 w-4 text-purple-500 mr-2" />
            <h4 className="font-medium">Patient</h4>
          </div>

          <p className="font-medium text-base pl-6">
            {appointmentObj?.familyMember
              ? `${appointmentObj?.familyMember?.name} (${appointmentObj?.familyMember?.gender}, ${appointmentObj?.familyMember?.age} yrs)`
              : `${appointmentObj?.patient?.firstname} ${appointmentObj?.patient?.lastname} (${appointmentObj?.patient?.gender}, ${appointmentObj?.patient?.age} yrs)`
            }
          </p>

          <p className="text-sm text-gray-600 pl-6">
            {appointmentObj.familyMember ? appointmentObj.familyMember.relationship : 'My Self'}
          </p>
        </div>

        <div className="bg-white rounded-lg border p-4 space-y-2">
          <div className="flex items-center mb-1">
            <Calendar className="h-4 w-4 text-amber-500 mr-2" />
            <h4 className="font-medium">Appointment</h4>
          </div>
          <p className="font-medium text-base pl-6">
            {appointmentObj?.slot?.date ? format(new Date(appointmentObj.slot.date), "EEEE, MMMM d, yyyy") : "Date not available"}
          </p>
          <p className="text-sm text--600 pl-6">{appointmentObj?.slot?.startTime ? format(new Date(`1970-01-01T${appointmentObj.slot.startTime}`), "hh:mm a") : "Time not available"}</p>
        </div>

        <div className="bg-white rounded-lg border p-4 space-y-2">
          <div className="flex items-center mb-1">
            <Building className="h-4 w-4 text-emerald-500 mr-2" />
            <h4 className="font-medium">Branch/Clinic</h4>
          </div>
           <p className="font-medium text-base pl-6">{appointmentObj?.slot?.doctorBranch?.branch?.clinic?.name}, 
            &nbsp;{appointmentObj?.slot?.doctorBranch?.branch?.name}</p>
          <p className="text-sm text-gray-600 pl-6">{appointmentObj?.slot?.doctorBranch?.branch?.location},{appointmentObj?.slot?.doctorBranch?.branch?.city}</p>
          <p className="text-sm text-gray-600 pl-6">{appointmentObj?.slot?.doctorBranch?.branch?.district?.name}</p>
          <p className="text-sm text-gray-600 pl-6">{appointmentObj?.slot?.doctorBranch?.branch?.pincode}</p>
        </div>

        

        <div className="bg-white rounded-lg border p-4 space-y-2">
          <div className="flex items-center mb-1">
            <User className="h-4 w-4 text-primary mr-2" />
            <h4 className="font-medium">Doctor</h4>
          </div>
          <p className="font-medium text-base pl-6">Dr. {appointmentObj?.doctorBranch?.doctor?.firstname } {appointmentObj?.doctorBranch?.doctor?.lastname}</p>
          {appointmentObj?.doctorBranch?.doctor?.specializationList && appointmentObj?.doctorBranch?.doctor?.specializationList?.length > 0 && <p className="text-sm text-gray-600 pl-6">
            {appointmentObj?.doctorBranch?.doctor?.specializationList.map((item, index) => (
              <span key={index} className="mr-1">{item.name}{index < appointmentObj?.doctorBranch?.doctor?.specializationList.length - 1 ? ", " : ""}</span>
            ))}
          </p>}
        </div>

      </div>
      
      <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm">
        <p className="text-blue-700">Please verify all appointment details before proceeding to payment.</p>
      </div>
    </div>
  );
}
