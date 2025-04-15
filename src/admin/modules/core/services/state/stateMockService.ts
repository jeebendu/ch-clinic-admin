import { State } from "@/admin/types/state";

/**
 * Generate mock states data for development
 */
export const getMockStates = (page: number, size: number, searchTerm?: string) => {
  const mockStates: State[] = [];

  // Generate 100 mock states
  for (let i = 0; i < 100; i++) {
    const mockState: State = {
      id: i + 1,
      name: `State ${i + 1}`,
      country: {
        id: i % 10 + 1,
        name: `Country ${i % 10 + 1}`,
        code: `C${i % 10 + 1}`,
        iso: `ISO${i % 10 + 1}`,
        status: i % 2 === 0,
      },
    };

    mockStates.push(mockState);
  }

  // Apply search filter
  let filteredStates = [...mockStates];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredStates = filteredStates.filter(
      (state) =>
        state.name.toLowerCase().includes(term) ||
        state.country.name?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedStates = filteredStates.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedStates,
      totalElements: filteredStates.length,
      totalPages: Math.ceil(filteredStates.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredStates.length,
    },
  });
};

/**
 * Mock function to get a single state by ID
 */
export const getMockStateById = async (id: number): Promise<State> => {
  const mockState: State = {
    id: id,
    name: `State ${id}`,
    country: {
      id: id % 10 + 1,
      name: `Country ${id % 10 + 1}`,
      code: `C${id % 10 + 1}`,
      iso: `ISO${id % 10 + 1}`,
      status: id % 2 === 0,
    },
  };

  return Promise.resolve(mockState);
};