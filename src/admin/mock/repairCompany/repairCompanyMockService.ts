import { RepairCompany } from "@/admin/types/newModel/RepairComany";

/**
 * Generate mock repair companies data for development
 */
export const getMockRepairCompanies = (page: number, size: number, searchTerm?: string) => {
  const mockRepairCompanies: RepairCompany[] = [];

  // Generate 100 mock repair companies
  for (let i = 0; i < 100; i++) {
    const mockRepairCompany: RepairCompany = {
      id: i + 1,
      name: `Repair Company ${i + 1}`,
      billAddress: `Billing Address ${i + 1}`,
      billCity: `City ${i % 5 + 1}`,
      billState: `State ${i % 3 + 1}`,
      billPin: `12345${i}`,
      billPhone: `+123456789${i}`,
      billEmail: `repair${i + 1}@example.com`,
      billAccountNo: `ACC${i + 1}`,
      shipAddress: `Shipping Address ${i + 1}`,
      shipCity: `City ${i % 5 + 1}`,
      shipState: `State ${i % 3 + 1}`,
      shipPin: `54321${i}`,
      shipEmail: `ship${i + 1}@example.com`,
      shipPhone: `+987654321${i}`,
      shipAccountNo: `SHIPACC${i + 1}`,
    };

    mockRepairCompanies.push(mockRepairCompany);
  }

  // Apply search filter
  let filteredCompanies = [...mockRepairCompanies];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCompanies = filteredCompanies.filter(
      (company) =>
        company.name?.toLowerCase().includes(term) ||
        company.billEmail?.toLowerCase().includes(term) ||
        company.shipEmail?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedCompanies,
      totalElements: filteredCompanies.length,
      totalPages: Math.ceil(filteredCompanies.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredCompanies.length,
    },
  });
};

/**
 * Mock function to get a single repair company by ID
 */
export const getMockRepairCompanyById = async (id: number): Promise<RepairCompany> => {
  const mockRepairCompany: RepairCompany = {
    id: id,
    name: `Repair Company ${id}`,
    billAddress: `Billing Address ${id}`,
    billCity: `City ${id % 5 + 1}`,
    billState: `State ${id % 3 + 1}`,
    billPin: `12345${id}`,
    billPhone: `+123456789${id}`,
    billEmail: `repair${id}@example.com`,
    billAccountNo: `ACC${id}`,
    shipAddress: `Shipping Address ${id}`,
    shipCity: `City ${id % 5 + 1}`,
    shipState: `State ${id % 3 + 1}`,
    shipPin: `54321${id}`,
    shipEmail: `ship${id}@example.com`,
    shipPhone: `+987654321${id}`,
    shipAccountNo: `SHIPACC${id}`,
  };

  return Promise.resolve(mockRepairCompany);
};