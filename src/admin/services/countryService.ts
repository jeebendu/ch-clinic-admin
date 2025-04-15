
import { Country } from "@/admin/modules/core/types/Country";

// Mock implementation
export const getCountries = async (): Promise<Country[]> => {
  const mockCountries: Country[] = [
    { id: 1, name: "United States", code: "US", iso: "USA", status: true },
    { id: 2, name: "Canada", code: "CA", iso: "CAN", status: true },
    { id: 3, name: "United Kingdom", code: "GB", iso: "GBR", status: true },
    { id: 4, name: "Australia", code: "AU", iso: "AUS", status: true },
    { id: 5, name: "Germany", code: "DE", iso: "DEU", status: true },
  ];

  return mockCountries;
};

export default { getCountries };
