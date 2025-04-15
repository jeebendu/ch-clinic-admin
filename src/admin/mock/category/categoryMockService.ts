import { Category } from "@/admin/types/newModel/Category";

/**
 * Generate mock categories data for development
 */
export const getMockCategories = (page: number, size: number, searchTerm?: string) => {
  const mockCategories: Category[] = [];

  // Generate 50 mock categories
  for (let i = 0; i < 50; i++) {
    const mockCategory: Category = {
      id: i + 1,
      name: `Category ${i + 1}`,
    };

    mockCategories.push(mockCategory);
  }

  // Apply search filter
  let filteredCategories = [...mockCategories];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCategories = filteredCategories.filter((category) =>
      category.name?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedCategories,
      totalElements: filteredCategories.length,
      totalPages: Math.ceil(filteredCategories.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredCategories.length,
    },
  });
};

/**
 * Mock function to get a single category by ID
 */
export const getMockCategoryById = async (id: number): Promise<Category> => {
  const mockCategory: Category = {
    id: id,
    name: `Category ${id}`,
  };

  return Promise.resolve(mockCategory);
};