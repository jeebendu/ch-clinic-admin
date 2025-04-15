
import React, { useState } from "react";
import { Branch } from "../types/Branch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Map, MapPin, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface BranchCardListProps {
  branches: Branch[];
  onDelete: (id: number) => void;
  onEdit: (branch: Branch) => void;
}

const BranchCardList = ({ branches, onDelete, onEdit }: BranchCardListProps) => {
  const [selectedMapUrl, setSelectedMapUrl] = useState<string | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);

  const handleViewMap = (mapurl: string | undefined) => {
    if (mapurl) {
      setSelectedMapUrl(mapurl);
      setMapModalOpen(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.length === 0 ? (
          <div className="col-span-full flex justify-center items-center p-8 bg-white rounded-lg border">
            <p className="text-muted-foreground">No branches found</p>
          </div>
        ) : (
          branches.map((branch) => (
            <Card key={branch.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center">
                  <span className="text-lg">{branch.name}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${branch.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {branch.active ? 'Active' : 'Inactive'}
                  </span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">Code: {branch.code}</div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p>{branch.location}</p>
                    <p>{branch.city}, {branch.pincode}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
                {branch.mapurl && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleViewMap(branch.mapurl)} 
                    className="text-teal-500 hover:text-teal-700 hover:bg-teal-50"
                  >
                    <Map className="h-4 w-4 mr-1" />
                    Map
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(branch)} 
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(branch.id || 0)} 
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Map Modal */}
      <Dialog open={mapModalOpen} onOpenChange={setMapModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-clinic-primary">Branch Location</DialogTitle>
          </DialogHeader>
          <div className="h-full w-full">
            {selectedMapUrl && (
              <iframe 
                src={selectedMapUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: "400px" }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded"
              ></iframe>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BranchCardList;
