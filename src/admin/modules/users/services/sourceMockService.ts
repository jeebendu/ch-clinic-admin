
import { Source } from "../types/Source";

/**
 * Generate mock sources data for development
 */
export const getMockSources = (page: number, size: number, searchTerm?: string) => {
  const mockSources: Source[] = [];

  // Generate 50 mock sources
  for (let i = 0; i < 50; i++) {
    const mockSource: Source = {
      id: i + 1,
      name: `Source ${i + 1}`,
    };

    mockSources.push(mockSource);
  }

  // Apply search filter
  let filteredSources = [...mockSources];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredSources = filteredSources.filter((source) =>
      source.name.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedSources = filteredSources.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedSources,
      totalElements: filteredSources.length,
      totalPages: Math.ceil(filteredSources.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredSources.length,
    },
  });
};

/**
 * Mock function to get a single source by ID
 */
export const getMockSourceById = async (id: number): Promise<Source> => {
  const mockSource: Source = {
    id: id,
    name: `Source ${id}`,
  };

  return Promise.resolve(mockSource);
};
