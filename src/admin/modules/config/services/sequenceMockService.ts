
import { Sequence } from "../types/Sequence";

/**
 * Generate mock sequences data for development
 */
export const getMockSequences = (page: number, size: number, searchTerm?: string) => {
  const mockSequences: Sequence[] = [];

  // Generate 50 mock sequences
  for (let i = 0; i < 50; i++) {
    const mockSequence: Sequence = {
      id: i + 1,
      includeBranchCode: i % 2 === 0,
      includeYear: i % 3 === 0,
      incrementLastFinal: `Final${i}`,
      incrementLastId: i * 10,
      incrementPadChar: i % 10,
      incrementPadLength: 5,
      incrementPrefix: `Prefix${i}`,
      module: {
        id: i % 5 + 1,
        name: `Module ${i % 5 + 1}`,
      },
    };

    mockSequences.push(mockSequence);
  }

  // Apply search filter
  let filteredSequences = [...mockSequences];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredSequences = filteredSequences.filter(
      (sequence) =>
        sequence.incrementLastFinal.toLowerCase().includes(term) ||
        sequence.incrementPrefix.toLowerCase().includes(term) ||
        (sequence.module?.name.toLowerCase().includes(term) ?? false)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedSequences = filteredSequences.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedSequences,
      totalElements: filteredSequences.length,
      totalPages: Math.ceil(filteredSequences.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredSequences.length,
    },
  });
};

/**
 * Mock function to get a single sequence by ID
 */
export const getMockSequenceById = async (id: number): Promise<Sequence> => {
  const mockSequence: Sequence = {
    id: id,
    includeBranchCode: id % 2 === 0,
    includeYear: id % 3 === 0,
    incrementLastFinal: `Final${id}`,
    incrementLastId: id * 10,
    incrementPadChar: id % 10,
    incrementPadLength: 5,
    incrementPrefix: `Prefix${id}`,
    module: {
      id: id % 5 + 1,
      name: `Module ${id % 5 + 1}`,
    },
  };

  return Promise.resolve(mockSequence);
};
