
import React from "react";
import AdminLayout from "@/admin/components/AdminLayout";
import PageHeader from "@/admin/components/PageHeader";
import Audiogram, { AudiogramData } from "../components/Audiogram";
import { useToast } from "@/hooks/use-toast";

const AudiometryTest: React.FC = () => {
  const { toast } = useToast();
  
  const handleSaveAudiogram = (data: AudiogramData) => {
    console.log("Saving audiogram data:", data);
    // In a real application, you would send this data to your API
    toast({
      title: "Audiogram Saved",
      description: "The audiogram has been saved successfully.",
    });
  };
  
  return (
    <>
      <div className="p-6">
        <PageHeader 
          title="Audiometry Test" 
          description="Perform and record audiometric evaluations"
        />
        
        <div className="mt-6">
          <Audiogram onSave={handleSaveAudiogram} />
        </div>
      </div>
    </>
  );
};

export default AudiometryTest;
