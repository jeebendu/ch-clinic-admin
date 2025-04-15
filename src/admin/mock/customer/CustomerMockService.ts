import { Customer, CustomerLedger } from "./Customer";

/**
 * Generate mock Customer data for development
 */
export const getMockCustomers = (page: number, size: number, searchTerm?: string) => {
  const mockCustomers: Customer[] = [];

  // Generate 100 mock customers
  for (let i = 0; i < 100; i++) {
    const mockCustomer: Customer = {
      id: i + 1,
      firstName: `FirstName${i + 1}`,
      lastName: `LastName${i + 1}`,
      phone: 1234567890 + i,
      email: `customer${i + 1}@example.com`,
      address: `Address ${i + 1}`,
    };

    mockCustomers.push(mockCustomer);
  }

  // Apply search filter
  let filteredCustomers = [...mockCustomers];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredCustomers = filteredCustomers.filter(
      (customer) =>
        customer.firstName.toLowerCase().includes(term) ||
        customer.lastName.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.phone.toString().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedCustomers,
      totalElements: filteredCustomers.length,
      totalPages: Math.ceil(filteredCustomers.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredCustomers.length,
    },
  });
};

/**
 * Mock function to get a single Customer by ID
 */
export const getMockCustomerById = async (id: number): Promise<Customer> => {
  const mockCustomer: Customer = {
    id: id,
    firstName: `FirstName${id}`,
    lastName: `LastName${id}`,
    phone: 1234567890 + id,
    email: `customer${id}@example.com`,
    address: `Address ${id}`,
  };

  return Promise.resolve(mockCustomer);
};

/**
 * Generate mock CustomerLedger data for a specific customer
 */
export const getMockCustomerLedger = (customerId: number, page: number, size: number) => {
  const mockLedgers: CustomerLedger[] = [];

  // Generate 50 mock ledger entries for the customer
  for (let i = 0; i < 50; i++) {
    const mockLedger: CustomerLedger = {
      id: i + 1,
      customer: {
        id: customerId,
        firstName: `FirstName${customerId}`,
        lastName: `LastName${customerId}`,
        phone: 1234567890 + customerId,
        email: `customer${customerId}@example.com`,
        address: `Address ${customerId}`,
      },
      txnDate: new Date(2025, i % 12, (i % 28) + 1),
      credit: i % 2 === 0 ? Math.floor(Math.random() * 1000) : 0,
      debit: i % 2 !== 0 ? Math.floor(Math.random() * 1000) : 0,
      balance: Math.floor(Math.random() * 10000),
      remark: `Transaction ${i + 1}`,
    };

    mockLedgers.push(mockLedger);
  }

  // Paginate
  const startIndex = page * size;
  const paginatedLedgers = mockLedgers.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedLedgers,
      totalElements: mockLedgers.length,
      totalPages: Math.ceil(mockLedgers.length / size),
      size: size,
      number: page,
      last: startIndex + size >= mockLedgers.length,
    },
  });
};