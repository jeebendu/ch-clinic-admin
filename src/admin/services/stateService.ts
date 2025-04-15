
import { State } from "@/admin/modules/core/types/State";

// Mock implementation
export const getStatesByCountryId = async (countryId: number): Promise<State[]> => {
  const country = { id: countryId, name: "Country " + countryId };
  
  const mockStates: State[] = [
    { id: 1, name: "State 1", country },
    { id: 2, name: "State 2", country },
    { id: 3, name: "State 3", country },
    { id: 4, name: "State 4", country },
    { id: 5, name: "State 5", country },
  ];

  return mockStates;
};

export default { getStatesByCountryId };
