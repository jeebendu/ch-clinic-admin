import { Order, OrderItem } from "./Order";


/**
 * Generate mock orders data for development
 */
export const getMockOrders = (page: number, size: number, searchTerm?: string) => {
  const mockOrders: Order[] = [];

  // Generate 100 mock orders
  for (let i = 0; i < 100; i++) {
    const mockOrder: Order = {
      id: i + 1,
      uid: `order-${i + 1}`,
      orderTime: new Date(2023, i % 12, (i % 28) + 1),
      createdTime: new Date(2023, i % 12, (i % 28) + 1),
      paymentType: undefined,
      customer: {
        id: i + 1,
        firstName: `Customer ${i + 1}`,
        lastName: `LarName ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: `+123456789${i}`,
        address: `Address ${i + 1}`,
      },
      status: true,
      remark: `Remark for order ${i + 1}`,
      items: generateMockOrderItems(i + 1),
      subtotal: 100 + i * 10,
      discount: i * 5,
      paid: 100 + i * 10 - (i * 5),
      pending: 0,
      grandTotal: 100 + i * 10 - (i * 5),
      product: undefined,
      paidAmount: 100 + i * 10 - (i * 5),
      discountType: "percentage",
      discountValue: i * 5,
      balance: 0,
      customer_type: null,
    };

    mockOrders.push(mockOrder);
  }

  // Apply search filter
  let filteredOrders = [...mockOrders];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredOrders = filteredOrders.filter(
      (order) =>
        order.customer.firstName.toLowerCase().includes(term) ||
        order.uid.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedOrders,
      totalElements: filteredOrders.length,
      totalPages: Math.ceil(filteredOrders.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredOrders.length,
    },
  });
};

/**
 * Generate mock order items
 */
const generateMockOrderItems = (orderId: number): OrderItem[] => {
  const items: OrderItem[] = [];
  for (let j = 0; j < 3; j++) {
    const mockItem: OrderItem = {
      id: j + 1,
      productName: `Product ${j + 1}`,
      productId: j + 1,
      price: 20 + j * 10,
      qty: j + 1,
      qtyType: "pcs",
      total: (20 + j * 10) * (j + 1),
      serials: [],
      batch: {
        id: 1,
        serialId: 1,
        serialNo: `SN-${orderId}-${j + 1}`,
      },
      _product: undefined,
    };
    items.push(mockItem);
  }
  return items;
};

/**
 * Mock function to get a single order by ID
 */
export const getMockOrderById = async (id: number): Promise<Order> => {
  const mockOrder: Order = {
    id: id,
    uid: `order-${id}`,
    orderTime: new Date(2023, id % 12, (id % 28) + 1),
    createdTime: new Date(2023, id % 12, (id % 28) + 1),
    paymentType: undefined,
    customer: {
      id: id,
      firstName: `Customer ${id}`,
     lastName: `LastName ${id}`,
      email: `customer${id}@example.com`,
      phone: `+123456789${id}`,
        address: `Address ${id}`,
    },
    status: true,
    remark: `Remark for order ${id}`,
    items: generateMockOrderItems(id),
    subtotal: 100 + id * 10,
    discount: id * 5,
    paid: 100 + id * 10 - (id * 5),
    pending: 0,
    grandTotal: 100 + id * 10 - (id * 5),
    product: undefined,
    paidAmount: 100 + id * 10 - (id * 5),
    discountType: "percentage",
    discountValue: id * 5,
    balance: 0,
    customer_type: null,
  };

  return Promise.resolve(mockOrder);
};