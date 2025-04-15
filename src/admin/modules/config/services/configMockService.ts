
import { Config } from "../types/Config";

/**
 * Generate mock config data for development
 */
export const getMockConfigs = (page: number, size: number, searchTerm?: string) => {
  const mockConfigs: Config[] = [];

  // Generate 50 mock configs
  for (let i = 0; i < 50; i++) {
    const mockConfig: Config = {
      importKey: i % 2 === 0, // Alternate between true and false
      exportKey: i % 3 === 0, // Alternate every 3rd item
    };

    mockConfigs.push(mockConfig);
  }

  // Apply search filter (if applicable)
  let filteredConfigs = [...mockConfigs];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredConfigs = filteredConfigs.filter(
      (config) =>
        config.importKey.toString().toLowerCase().includes(term) ||
        config.exportKey.toString().toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedConfigs = filteredConfigs.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedConfigs,
      totalElements: filteredConfigs.length,
      totalPages: Math.ceil(filteredConfigs.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredConfigs.length,
    },
  });
};

/**
 * Mock function to get a single config by ID
 */
export const getMockConfigById = async (id: number): Promise<Config> => {
  const mockConfig: Config = {
    importKey: id % 2 === 0, // Alternate between true and false
    exportKey: id % 3 === 0, // Alternate every 3rd item
  };

  return Promise.resolve(mockConfig);
};
