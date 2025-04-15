import { Relation } from "@/admin/types/newModel/Relation";

/**
 * Generate mock relations data for development
 */
export const getMockRelations = (page: number, size: number, searchTerm?: string) => {
  const mockRelations: Relation[] = [];

  // Generate 50 mock relations
  for (let i = 0; i < 50; i++) {
    const mockRelation: Relation = {
      id: i + 1,
      name: `Relation ${i + 1}`,
    };

    mockRelations.push(mockRelation);
  }

  // Apply search filter
  let filteredRelations = [...mockRelations];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredRelations = filteredRelations.filter((relation) =>
      relation.name?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedRelations = filteredRelations.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedRelations,
      totalElements: filteredRelations.length,
      totalPages: Math.ceil(filteredRelations.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredRelations.length,
    },
  });
};

/**
 * Mock function to get a single relation by ID
 */
export const getMockRelationById = async (id: number): Promise<Relation> => {
  const mockRelation: Relation = {
    id: id,
    name: `Relation ${id}`,
  };

  return Promise.resolve(mockRelation);
};