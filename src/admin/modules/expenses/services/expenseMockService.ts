
import { Expense, ExpenseItem } from "../types/Expense";
import { PaymentType } from "../../payments/types/PaymentType";

/**
 * Mock service for Expense
 */
export const ExpenseMockService = {
  generateMockData: (): Expense[] => {
    const mockData: Expense[] = [];

    for (let i = 1; i <= 100; i++) {
      const mockPaymentType: PaymentType = {
        id: i % 5 + 1,
        name: `Payment Type ${i % 5 + 1}`,
      };

      const mockItems: ExpenseItem[] = Array.from({ length: 3 }, (_, index) => ({
        id: index + 1,
        description: `Item ${index + 1} for Expense ${i}`,
        price: Math.floor(Math.random() * 1000) + 100, // Random price between 100 and 1100
        qty: Math.floor(Math.random() * 5) + 1, // Random quantity between 1 and 5
        total: 0, // Will be calculated below
      })).map((item) => ({
        ...item,
        total: item.price * item.qty,
      }));

      const subtotal = mockItems.reduce((sum, item) => sum + item.total, 0);
      const discount = Math.floor(Math.random() * 100); // Random discount between 0 and 100
      const grandTotal = subtotal - discount;

      const mockExpense: Expense = {
        id: i,
        uid: `EXP-${i}`,
        expenseTime: new Date(2025, i % 12, (i % 28) + 1),
        createdTime: new Date(2025, i % 12, (i % 28) + 2),
        paymentType: mockPaymentType,
        status: i % 2 === 0,
        remark: `Remark for Expense ${i}`,
        description: `Description for Expense ${i}`,
        items: mockItems,
        subtotal,
        discount,
        grandTotal,
        approved: i % 3 === 0,
      };

      mockData.push(mockExpense);
    }

    return mockData;
  },

  getMockData: (page: number, size: number, searchTerm?: string) => {
    const mockData = ExpenseMockService.generateMockData();

    // Apply search filter
    let filteredData = [...mockData];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredData = filteredData.filter(
        (expense) =>
          expense.uid.toLowerCase().includes(term) ||
          expense.description.toLowerCase().includes(term) ||
          expense.remark.toLowerCase().includes(term)
      );
    }

    // Paginate
    const startIndex = page * size;
    const paginatedData = filteredData.slice(startIndex, startIndex + size);

    return Promise.resolve({
      data: {
        content: paginatedData,
        totalElements: filteredData.length,
        totalPages: Math.ceil(filteredData.length / size),
        size: size,
        number: page,
        last: startIndex + size >= filteredData.length,
      },
    });
  },

  getMockDataById: (id: number): Promise<Expense> => {
    const mockData = ExpenseMockService.generateMockData();
    const data = mockData.find((item) => item.id === id);

    if (!data) {
      return Promise.reject(new Error("Expense not found"));
    }

    return Promise.resolve(data);
  },
};
