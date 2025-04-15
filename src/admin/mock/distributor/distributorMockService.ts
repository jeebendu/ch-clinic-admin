import { Distributor } from "@/admin/types/newModel/Distributor";

/**
 * Generate mock distributors data for development
 */
export const getMockDistributors = (page: number, size: number, searchTerm?: string) => {
  const mockDistributors: Distributor[] = [];

  // Generate 50 mock distributors
  for (let i = 0; i < 50; i++) {
    const mockDistributor: Distributor = {
      id: i + 1,
      name: `Distributor ${i + 1}`,
      contact: `+123456789${i}`,
      address: `Address ${i + 1}`,
      gst: `GST${i + 1}`,
    };

    mockDistributors.push(mockDistributor);
  }

  // Apply search filter
  let filteredDistributors = [...mockDistributors];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredDistributors = filteredDistributors.filter(
      (distributor) =>
        distributor.name?.toLowerCase().includes(term) ||
        distributor.contact?.toLowerCase().includes(term) ||
        distributor.address?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedDistributors = filteredDistributors.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedDistributors,
      totalElements: filteredDistributors.length,
      totalPages: Math.ceil(filteredDistributors.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredDistributors.length,
    },
  });
};

/**
 * Mock function to get a single distributor by ID
 */
export const getMockDistributorById = async (id: number): Promise<Distributor> => {
  const mockDistributor: Distributor = {
    id: id,
    name: `Distributor ${id}`,
    contact: `+123456789${id}`,
    address: `Address ${id}`,
    gst: `GST${id}`,
  };

  return Promise.resolve(mockDistributor);
};