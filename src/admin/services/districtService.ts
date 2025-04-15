
import { District } from "@/admin/modules/core/types/District";
import { State } from "@/admin/modules/core/types/State";

// Mock implementation
export const getDistrictByStateId = async (stateId: number): Promise<District[]> => {
  const country = { id: 1, name: "Country 1" };
  const state: State = { id: stateId, name: "State " + stateId, country };
  
  const mockDistricts: District[] = [
    { id: 1, name: "District 1", state },
    { id: 2, name: "District 2", state },
    { id: 3, name: "District 3", state },
    { id: 4, name: "District 4", state },
    { id: 5, name: "District 5", state },
  ];

  return mockDistricts;
};

export default { getDistrictByStateId };
