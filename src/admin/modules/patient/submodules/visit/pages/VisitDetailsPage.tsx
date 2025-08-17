
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Visit } from "../types/Visit";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Receipt, FileText, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import visitService from "../services/visitService";

const VisitDetailsPage: React.FC = () => {
  const { visitId } = useParams<{ visitId: string }>();
  const navigate = useNavigate();
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVisit = async () => {
      if (!visitId) {
        setError("Visit ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Mock fetch - replace with actual service call
        const visitData = (await visitService.getById(visitId)).data;
        setVisit(visitData);
      } catch (err) {
        setError("Failed to fetch visit details");
        console.error("Error fetching visit:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [visitId]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    if (visit) {
      navigate(`/admin/patients/visits/${visit.id}/edit`);
    }
  };

  const handleGenerateInvoice = () => {
    if (visit) {
      console.log("Generate invoice for visit:", visit.id);
      // Implement invoice generation logic
    }
  };

  const handleViewPrescription = () => {
    if (visit) {
      console.log("View prescription for visit:", visit.id);
      // Implement prescription view logic
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading visit details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Card>
    );
  }

  if (!visit) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Visit not found</p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Visits
        </Button>
        <div className="flex gap-2">
          <Button onClick={handleEdit} variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit Visit
          </Button>
          <Button onClick={handleGenerateInvoice} variant="outline" size="sm">
            <Receipt className="h-4 w-4 mr-2" />
            Generate Invoice
          </Button>
          <Button onClick={handleViewPrescription} variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            View Prescription
          </Button>
        </div>
      </div>

      {/* Visit details content */}
      <VisitDetailsContent visit={visit} />
    </div>
  );
};

export default VisitDetailsPage;
