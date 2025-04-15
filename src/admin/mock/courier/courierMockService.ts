import { Courier } from "@/admin/types/newModel/Courier";

/**
 * Generate mock couriers data for development
 */
export const getMockCouriers = (page: number, size: number, searchTerm?: string) => {
  const mockCouriers: Courier[] = [];

  // Generate 100 mock couriers
  for (let i = 0; i < 100; i++) {
    const mockCourier: Courier = {
      id: i + 1,
      name: `Courier ${i + 1}`,
      code: `C${i + 1}`,
      websiteUrl: `https://courier${i + 1}.com`,
      apiUrl: `https://api.courier${i + 1}.com`,
    };

    mockCouriers.push(mockCourier);
  }

  // Apply search filter
  let filteredCouriers = [...mockCouriers];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCouriers = filteredCouriers.filter(
      (courier) =>
        courier.name?.toLowerCase().includes(term) ||
        courier.code?.toLowerCase().includes(term) ||
        courier.websiteUrl?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedCouriers = filteredCouriers.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedCouriers,
      totalElements: filteredCouriers.length,
      totalPages: Math.ceil(filteredCouriers.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredCouriers.length,
    },
  });
};

/**
 * Mock function to get a single courier by ID
 */
export const getMockCourierById = async (id: number): Promise<Courier> => {
  const mockCourier: Courier = {
    id: id,
    name: `Courier ${id}`,
    code: `C${id}`,
    websiteUrl: `https://courier${id}.com`,
    apiUrl: `https://api.courier${id}.com`,
  };

  return Promise.resolve(mockCourier);
};