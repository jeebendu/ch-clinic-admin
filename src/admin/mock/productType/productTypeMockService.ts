import { ProductType } from "@/admin/types/newModel/ProductType";

/**
 * Generate mock product types data for development
 */
export const getMockProductTypes = (page: number, size: number, searchTerm?: string) => {
  const mockProductTypes: ProductType[] = [];

  // Generate 100 mock product types
  for (let i = 0; i < 100; i++) {
    const mockProductType: ProductType = {
      id: i + 1,
      name: `Product Type ${i + 1}`,
      strip: i % 2 === 0, // Alternate between true and false
    };

    mockProductTypes.push(mockProductType);
  }

  // Apply search filter
  let filteredProductTypes = [...mockProductTypes];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProductTypes = filteredProductTypes.filter(
      (productType) =>
        productType.name?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedProductTypes = filteredProductTypes.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedProductTypes,
      totalElements: filteredProductTypes.length,
      totalPages: Math.ceil(filteredProductTypes.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredProductTypes.length,
    },
  });
};

/**
 * Mock function to get a single product type by ID
 */
export const getMockProductTypeById = async (id: number): Promise<ProductType> => {
  const mockProductType: ProductType = {
    id: id,
    name: `Product Type ${id}`,
    strip: id % 2 === 0, // Alternate between true and false
  };

  return Promise.resolve(mockProductType);
};