import { Country } from "../../types/Address";


/**
 * Generate mock countries data for development
 */
export const getMockCountries = (page: number, size: number, searchTerm?: string) => {
  const mockCountries: Country[] = [];

  // Generate 50 mock countries
  for (let i = 0; i < 50; i++) {
    const mockCountry: Country = {
      id: i + 1,
      name: `Country ${i + 1}`,
      code: `C${i + 1}`,
      iso: `ISO${i + 1}`,
      status: i % 2 === 0, // Alternate between true and false
    };

    mockCountries.push(mockCountry);
  }

  // Apply search filter
  let filteredCountries = [...mockCountries];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCountries = filteredCountries.filter(
      (country) =>
        country.name?.toLowerCase().includes(term) ||
        country.code?.toLowerCase().includes(term) ||
        country.iso?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedCountries = filteredCountries.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedCountries,
      totalElements: filteredCountries.length,
      totalPages: Math.ceil(filteredCountries.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredCountries.length,
    },
  });
};

/**
 * Mock function to get a single country by ID
 */
export const getMockCountryById = async (id: number): Promise<Country> => {
  const mockCountry: Country = {
    id: id,
    name: `Country ${id}`,
    code: `C${id}`,
    iso: `ISO${id}`,
    status: id % 2 === 0, // Alternate between true and false
  };

  return Promise.resolve(mockCountry);
};