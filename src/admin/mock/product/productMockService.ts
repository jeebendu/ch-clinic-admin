import { Product } from "@/admin/types/newModel/Product";
import { Brand } from "@/admin/types/newModel/Brand";
import { Category } from "@/admin/types/newModel/Category";
import { ProductType } from "@/admin/types/newModel/ProductType";

/**
 * Generate mock products data for development
 */
export const getMockProducts = (page: number, size: number, searchTerm?: string) => {
  const mockProducts: Product[] = [];

  // Generate 100 mock products
  for (let i = 0; i < 100; i++) {
    const mockProduct: Product = {
      id: i + 1,
      name: `Product ${i + 1}`,
      price: (i + 1) * 10,
      buyprice: (i + 1) * 8,
      specialprice: (i + 1) * 9,
      qty: i * 5,
      qtyLoose: i * 2,
      stripsPerBox: 10,
      capPerStrip: 5,
      ram: `${i % 4 + 4}GB`,
      storage: `${i % 3 + 64}GB`,
      sku: `SKU${i + 1}`,
      brand: {
        id: i % 5 + 1,
        name: `Brand ${i % 5 + 1}`,
      } as Brand,
      modelno: i + 1000,
      rackNo: `Rack ${i % 10 + 1}`,
      color: i % 2 === 0 ? "Red" : "Blue",
      warranty: `${i % 3 + 1} Year`,
      smallimage: `https://via.placeholder.com/150?text=Small+Image+${i + 1}`,
      largeimage: `https://via.placeholder.com/300?text=Large+Image+${i + 1}`,
      description: `Description for Product ${i + 1}`,
      branchId: i % 5 + 1,
      categoryId: i % 3 + 1,
      brandId: i % 5 + 1,
      category: {
        id: i % 3 + 1,
        name: `Category ${i % 3 + 1}`,
      } as Category,
      serials: {
        id: i + 1,
        serialNo: `SN${i + 1}`,
        qty: i * 2,
      },
      batchList: [],
      isSerialNoEnable: i % 2 === 0,
      batched: i % 3 === 0,
      type: {
        id: i % 4 + 1,
        name: `Type ${i % 4 + 1}`,
        strip: i % 2 === 0,
      } as ProductType,
    };

    mockProducts.push(mockProduct);
  }

  // Apply search filter
  let filteredProducts = [...mockProducts];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        product.sku.toLowerCase().includes(term) ||
        product.brand.name?.toLowerCase().includes(term) ||
        product.category.name?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedProducts,
      totalElements: filteredProducts.length,
      totalPages: Math.ceil(filteredProducts.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredProducts.length,
    },
  });
};

/**
 * Mock function to get a single product by ID
 */
export const getMockProductById = async (id: number): Promise<Product> => {
  const mockProduct: Product = {
    id: id,
    name: `Product ${id}`,
    price: id * 10,
    buyprice: id * 8,
    specialprice: id * 9,
    qty: id * 5,
    qtyLoose: id * 2,
    stripsPerBox: 10,
    capPerStrip: 5,
    ram: `${id % 4 + 4}GB`,
    storage: `${id % 3 + 64}GB`,
    sku: `SKU${id}`,
    brand: {
      id: id % 5 + 1,
      name: `Brand ${id % 5 + 1}`,
    } as Brand,
    modelno: id + 1000,
    rackNo: `Rack ${id % 10 + 1}`,
    color: id % 2 === 0 ? "Red" : "Blue",
    warranty: `${id % 3 + 1} Year`,
    smallimage: `https://via.placeholder.com/150?text=Small+Image+${id}`,
    largeimage: `https://via.placeholder.com/300?text=Large+Image+${id}`,
    description: `Description for Product ${id}`,
    branchId: id % 5 + 1,
    categoryId: id % 3 + 1,
    brandId: id % 5 + 1,
    category: {
      id: id % 3 + 1,
      name: `Category ${id % 3 + 1}`,
    } as Category,
    serials: {
      id: id,
      serialNo: `SN${id}`,
      qty: id * 2,
    },
    batchList: [],
    isSerialNoEnable: id % 2 === 0,
    batched: id % 3 === 0,
    type: {
      id: id % 4 + 1,
      name: `Type ${id % 4 + 1}`,
      strip: id % 2 === 0,
    } as ProductType,
  };

  return Promise.resolve(mockProduct);
};