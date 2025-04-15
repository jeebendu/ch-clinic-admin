import { Status } from "@/admin/types/newModel/Status";

/**
 * Generate mock statuses data for development
 */
export const getMockStatuses = (page: number, size: number, searchTerm?: string) => {
  const mockStatuses: Status[] = [];

  // Generate 50 mock statuses
  for (let i = 0; i < 50; i++) {
    const mockStatus: Status = {
      id: i + 1,
      name: `Status ${i + 1}`,
      module: {
        id: i % 5 + 1,
        name: `Module ${i % 5 + 1}`,
      },
    };

    mockStatuses.push(mockStatus);
  }

  // Apply search filter
  let filteredStatuses = [...mockStatuses];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredStatuses = filteredStatuses.filter(
      (status) =>
        status.name.toLowerCase().includes(term) ||
        status.module.name.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedStatuses = filteredStatuses.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedStatuses,
      totalElements: filteredStatuses.length,
      totalPages: Math.ceil(filteredStatuses.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredStatuses.length,
    },
  });
};

/**
 * Mock function to get a single status by ID
 */
export const getMockStatusById = async (id: number): Promise<Status> => {
  const mockStatus: Status = {
    id: id,
    name: `Status ${id}`,
    module: {
      id: id % 5 + 1,
      name: `Module ${id % 5 + 1}`,
    },
  };

  return Promise.resolve(mockStatus);
};