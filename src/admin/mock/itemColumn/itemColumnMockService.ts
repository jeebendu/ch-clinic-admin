import { ItemColumn } from "@/admin/mock/itemColumn/itemColumn";

/**
 * Generate mock ItemColumn data for development
 */
export const getMockItemColumns = (page: number, size: number, searchTerm?: string) => {
  const mockItemColumns: ItemColumn[] = [];

  // Generate 100 mock ItemColumns
  for (let i = 0; i < 100; i++) {
    const mockItemColumn: ItemColumn = {
      id: i + 1,
      vendor: {
        id: i % 10 + 1,
        name: `Distributor ${i % 10 + 1}`,
        contact: `+123456789${i}`,
        address: `Address ${i % 10 + 1}`,
        gst: `GST${i % 10 + 1}`,
      },
      startPoint: `Start Point ${i + 1}`,
      expSeparator: `Separator ${i + 1}`,
      sn: `SN${i + 1}`,
      hsn: `HSN${i + 1}`,
      mfg: `MFG${i + 1}`,
      name: `Item Name ${i + 1}`,
      pack: `Pack ${i + 1}`,
      batch: `Batch${i + 1}`,
      exp: `2025-${(i % 12) + 1}-${(i % 28) + 1}`,
      mrp: (i + 1) * 10,
      qty: (i + 1) * 5,
      free: i % 2 === 0 ? 1 : 0,
      rate: (i + 1) * 2,
      amount: (i + 1) * 20,
      dis: (i + 1) * 0.5,
      sgst: (i + 1) * 0.18,
      cgst: (i + 1) * 0.18,
      netAmount: (i + 1) * 25,
    };

    mockItemColumns.push(mockItemColumn);
  }

  // Apply search filter
  let filteredItemColumns = [...mockItemColumns];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredItemColumns = filteredItemColumns.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.vendor.name?.toLowerCase().includes(term) ||
        item.vendor.gst?.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedItemColumns = filteredItemColumns.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedItemColumns,
      totalElements: filteredItemColumns.length,
      totalPages: Math.ceil(filteredItemColumns.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredItemColumns.length,
    },
  });
};

/**
 * Mock function to get a single ItemColumn by ID
 */
export const getMockItemColumnById = async (id: number): Promise<ItemColumn> => {
  const mockItemColumn: ItemColumn = {
    id: id,
    vendor: {
      id: 1,
      name: "Distributor 1",
      contact: "+1234567890",
      address: "Address 1",
      gst: "GST1",
    },
    startPoint: `Start Point ${id}`,
    expSeparator: `Separator ${id}`,
    sn: `SN${id}`,
    hsn: `HSN${id}`,
    mfg: `MFG${id}`,
    name: `Item Name ${id}`,
    pack: `Pack ${id}`,
    batch: `Batch${id}`,
    exp: `2025-${(id % 12) + 1}-${(id % 28) + 1}`,
    mrp: id * 10,
    qty: id * 5,
    free: id % 2 === 0 ? 1 : 0,
    rate: id * 2,
    amount: id * 20,
    dis: id * 0.5,
    sgst: id * 0.18,
    cgst: id * 0.18,
    netAmount: id * 25,
  };

  return Promise.resolve(mockItemColumn);
};