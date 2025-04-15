
import { Transaction } from "../types/Transaction";
import { PaymentType } from "../types/PaymentType";

/**
 * Generate mock transactions data for development
 */
export const getMockTransactions = (page: number, size: number, searchTerm?: string) => {
  const paymentTypes: PaymentType[] = [
    { id: 1, name: "Credit Card" },
    { id: 2, name: "Debit Card" },
    { id: 3, name: "Cash" },
    { id: 4, name: "Bank Transfer" },
    { id: 5, name: "UPI" },
  ];

  const mockTransactions: Transaction[] = [];

  // Generate 100 mock transactions
  for (let i = 0; i < 100; i++) {
    const mockTransaction: Transaction = {
      id: i + 1,
      type: paymentTypes[i % paymentTypes.length],
      withdraw: i % 2 === 0 ? Math.floor(Math.random() * 1000) : undefined,
      deposit: i % 2 !== 0 ? Math.floor(Math.random() * 1000) : undefined,
      total: Math.floor(Math.random() * 10000),
      remark: `Transaction ${i + 1}`,
    };

    mockTransactions.push(mockTransaction);
  }

  // Apply search filter
  let filteredTransactions = [...mockTransactions];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredTransactions = filteredTransactions.filter(
      (transaction) =>
        transaction.remark?.toLowerCase().includes(term) ||
        transaction.type?.name.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedTransactions,
      totalElements: filteredTransactions.length,
      totalPages: Math.ceil(filteredTransactions.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredTransactions.length,
    },
  });
};

/**
 * Mock function to get a single transaction by ID
 */
export const getMockTransactionById = async (id: number): Promise<Transaction> => {
  const paymentTypes: PaymentType[] = [
    { id: 1, name: "Credit Card" },
    { id: 2, name: "Debit Card" },
    { id: 3, name: "Cash" },
    { id: 4, name: "Bank Transfer" },
    { id: 5, name: "UPI" },
  ];

  const mockTransaction: Transaction = {
    id: id,
    type: paymentTypes[id % paymentTypes.length],
    withdraw: id % 2 === 0 ? Math.floor(Math.random() * 1000) : undefined,
    deposit: id % 2 !== 0 ? Math.floor(Math.random() * 1000) : undefined,
    total: Math.floor(Math.random() * 10000),
    remark: `Transaction ${id}`,
  };

  return Promise.resolve(mockTransaction);
};
