import { PaymentType } from "@/admin/types/newModel/PaymentType";

/**
 * Generate mock payment types data for development
 */
export const getMockPaymentTypes = (page: number, size: number, searchTerm?: string) => {
  const mockPaymentTypes: PaymentType[] = [];

  // Generate 50 mock payment types
  for (let i = 0; i < 50; i++) {
    const mockPaymentType: PaymentType = {
      id: i + 1,
      name: `Payment Type ${i + 1}`,
    };

    mockPaymentTypes.push(mockPaymentType);
  }

  // Apply search filter
  let filteredPaymentTypes = [...mockPaymentTypes];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredPaymentTypes = filteredPaymentTypes.filter((paymentType) =>
      paymentType.name.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedPaymentTypes = filteredPaymentTypes.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedPaymentTypes,
      totalElements: filteredPaymentTypes.length,
      totalPages: Math.ceil(filteredPaymentTypes.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredPaymentTypes.length,
    },
  });
};

/**
 * Mock function to get a single payment type by ID
 */
export const getMockPaymentTypeById = async (id: number): Promise<PaymentType> => {
  const mockPaymentType: PaymentType = {
    id: id,
    name: `Payment Type ${id}`,
  };

  return Promise.resolve(mockPaymentType);
};