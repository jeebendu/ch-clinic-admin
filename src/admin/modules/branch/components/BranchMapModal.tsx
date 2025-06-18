
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MapPin } from "lucide-react";
import { Branch } from "../types/Branch";

interface BranchMapModalProps {
  branch: Branch | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BranchMapModal = ({ branch, open, onOpenChange }: BranchMapModalProps) => {
  if (!branch) return null;

  const mapUrl = branch.mapurl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${branch.location}, ${branch.city}, ${branch.district?.name}, ${branch.state?.name}`
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader className="border-b border-gray-200 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            {branch.name} - Location
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-4">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">{branch.name}</h3>
            <p className="text-gray-600 text-sm">{branch.location}</p>
            <p className="text-gray-500 text-sm">
              {branch.city}, {branch.district?.name}, {branch.state?.name} - {branch.pincode}
            </p>
          </div>
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <div className="mt-4 text-center">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchMapModal;
