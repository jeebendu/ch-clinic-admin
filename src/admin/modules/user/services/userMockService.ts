
import { User } from "../types/User";
import { Role, Permission, Module } from "../submodules/roles/types/Role";

/**
 * Generate mock users data for development
 */
export const getMockUsers = (page: number, size: number, searchTerm?: string) => {
  const mockUsers: User[] = [];

  // Generate 100 mock users
  for (let i = 0; i < 100; i++) {
    const mockModule: Module = {
      id: i % 5 + 1,
      name: `Module ${i % 5 + 1}`,
      code: `MOD${i % 5 + 1}`,
    };

    const mockPermission: Permission = {
      id: i + 1,
      module: mockModule,
      read: true,
      write: i % 2 === 0,
      upload: i % 3 === 0,
      print: i % 4 === 0,
      approve: i % 5 === 0,
    };

    const mockRole: Role = {
      id: i % 3 + 1,
      name: `Role ${i % 3 + 1}`,
      permissions: [mockPermission],
    };

    const mockUser: User = {
      id: i + 1,
      uid: `user-${i + 1}`, // Add the required uid property
      branch: {
        id: i % 5 + 1,
        name: `Branch ${i % 5 + 1}`,
        code: `BR${i % 5 + 1}`,
        location: `Location ${i % 5 + 1}`,
        active: true,
        state: null,
        district: null,
        country: null,
        city: `City ${i % 5 + 1}`,
        mapurl: '',
        pincode: 12345,
        image: '',
        latitude: 0,
        longitude: 0,
      },
      name: `User ${i + 1}`,
      username: `user${i + 1}`,
      email: `user${i + 1}@example.com`,
      phone: `+123456789${i}`,
      password: `password${i + 1}`,
      effectiveTo: new Date(2025, i % 12, (i % 28) + 1),
      effectiveFrom: new Date(2024, i % 12, (i % 28) + 1),
      role: mockRole,
      image: `https://via.placeholder.com/150?text=User+${i + 1}`,
    };

    mockUsers.push(mockUser);
  }

  // Apply search filter
  let filteredUsers = [...mockUsers];
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredUsers = filteredUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.username.toLowerCase().includes(term)
    );
  }

  // Paginate
  const startIndex = page * size;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + size);

  return Promise.resolve({
    data: {
      content: paginatedUsers,
      totalElements: filteredUsers.length,
      totalPages: Math.ceil(filteredUsers.length / size),
      size: size,
      number: page,
      last: startIndex + size >= filteredUsers.length,
    },
  });
};

/**
 * Mock function to get a single user by ID
 */
export const getMockUserById = async (id: number): Promise<User> => {
  const mockModule: Module = {
    id: 1,
    name: "Module 1",
    code: "MOD1",
  };

  const mockPermission: Permission = {
    id: 1,
    module: mockModule,
    read: true,
    write: id % 2 === 0,
    upload: id % 3 === 0,
    print: id % 4 === 0,
    approve: id % 5 === 0,
  };

  const mockRole: Role = {
    id: id % 3 + 1,
    name: `Role ${id % 3 + 1}`,
    permissions: [mockPermission],
  };

  const mockUser: User = {
    id: id,
    uid: `user-${id}`, // Add the required uid property
    branch: {
      id: 1,
      name: "Branch 1",
      code: "BR1",
      location: "Location 1",
      active: true,
      state: null,
      district: null,
      country: null,
      city: "City 1",
      mapurl: '',
      pincode: 12345,
      image: '',
      latitude: 0,
      longitude: 0,
    },
    name: `User ${id}`,
    username: `user${id}`,
    email: `user${id}@example.com`,
    phone: `+123456789${id}`,
    password: `password${id}`,
    effectiveTo: new Date(2025, id % 12, (id % 28) + 1),
    effectiveFrom: new Date(2024, id % 12, (id % 28) + 1),
    role: mockRole,
    image: `https://via.placeholder.com/150?text=User+${id}`,
  };

  return Promise.resolve(mockUser);
};
