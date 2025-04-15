
import React from "react";
import { Branch } from "../types/Branch";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MapPin, Building2 } from "lucide-react";

interface BranchCardListProps {
  branches: Branch[];
  onDelete: (id: number) => void;
}

const BranchCardList: React.FC<BranchCardListProps> = ({ branches, onDelete }) => {
  if (branches.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No branches found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {branches.map((branch) => (
        <Card key={branch.id} className="overflow-hidden">
          <div className="bg-primary/10 p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  {branch.name}
                </h3>
                <p className="text-sm text-muted-foreground">{branch.code}</p>
              </div>
              {branch.active !== undefined && (
                <span className={`px-2 py-1 text-xs rounded-full ${branch.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {branch.active ? 'Active' : 'Inactive'}
                </span>
              )}
            </div>
          </div>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1 mr-2" />
                <div>
                  <p className="text-sm">{branch.location}</p>
                  <p className="text-sm">
                    {branch.city}
                    {branch.state && `, ${branch.state.name}`}
                    {branch.country && `, ${branch.country.name}`}
                  </p>
                  <p className="text-sm">Pincode: {branch.pincode}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 pt-0 border-t">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onDelete(branch.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BranchCardList;
