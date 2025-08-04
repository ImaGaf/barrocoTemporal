import bcrypt from 'bcryptjs';

const BASE_URL = 'https://awd224062025htmlfrozonoinc.onrender.com/barroco';

async function api<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export const getCurrentUser = (): any | null => {
  const userStr = sessionStorage.getItem("user");
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const logoutUser = () => {
  sessionStorage.removeItem("user");
};

// Customer API
export const customerAPI = {
  create: (data: any) => api('/customers', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => api('/customers'),
  getById: (id: string) => api(`/customers/${id}`),
  update: (id: string, data: any) => api(`/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/customers/${id}`, { method: 'DELETE' }),
};

// Product API
export const productAPI = {
  create: (data: any) => api('/products', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => api('/products'),
  getById: (id: string) => api(`/products/${id}`),
  update: (id: string, data: any) => api(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/products/${id}`, { method: 'DELETE' }),
};

// Cart API
export const cartAPI = {
  create: (data: any) => api('/shoppingCart', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: string) => api(`/shoppingCart/${id}`),
  update: (id: string, data: any) => api(`/shoppingCart/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/shoppingCart/${id}`, { method: 'DELETE' }),
};

// Cart Items API
export const cartItemAPI = {
  create: (data: any) => api('/cartitems', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: string) => api(`/cartitems/${id}`),
  update: (id: string, data: any) => api(`/cartitems/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/cartitems/${id}`, { method: 'DELETE' }),
};

// Order API
export const orderAPI = {
  create: (data: any) => api('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => api('/orders'),
  getById: (id: string) => api(`/orders/${id}`),
  update: (id: string, data: any) => api(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/orders/${id}`, { method: 'DELETE' }),
};

// Categories API
export const categoryAPI = {
  create: (data: any) => api('/categories', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => api('/categories'),
  update: (id: string, data: any) => api(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/categories/${id}`, { method: 'DELETE' }),
};

// Payment API
export const paymentAPI = {
  create: (data: any) => api('/payments', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => api('/payments'),
  update: (id: string, data: any) => api(`/payments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/payments/${id}`, { method: 'DELETE' }),
};

// Admin API
export const adminAPI = {
  create: (data: any) => api('/administrators', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: string) => api(`/administrators/${id}`),
  update: (id: string, data: any) => api(`/administrators/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/administrators/${id}`, { method: 'DELETE' }),
  getAll: () => api('/administrators'),
};

// Employee API
export const employeeAPI = {
  create: (data: any) => api('/employees', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: string) => api(`/employees/${id}`),
  update: (id: string, data: any) => api(`/employees/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/employees/${id}`, { method: 'DELETE' }),
  getAll: () => api('/employees'),
};

// Stats API
export const statsAPI = {
  totalSales: () => api('/stats/total-sales'),
  mostSoldProducts: () => api('/stats/most-sold-products'),
  topCustomers: () => api('/stats/top-customers'),
  categorySales: () => api('/stats/category-sales'),
  monthlyIncome: (year?: number) => api(`/stats/monthly-income${year ? `?year=${year}` : ''}`),
  averageTicket: () => api('/stats/average-ticket'),
  discountAverage: () => api('/stats/discount-average'),
  taxCollected: () => api('/stats/tax-collected'),
  cartSubtotal: (cartId: string) => api(`/stats/cart/${cartId}/subtotal`),
  orderProductCount: (orderId: string) => api(`/stats/order/${orderId}/product-count`),
  averageOrderValue: () => api('/stats/order/average-value'),
  customerLastPurchase: (id: string) => api(`/stats/customer/${id}/last-purchase`),
  customerTotalSpent: (id: string) => api(`/stats/customer/${id}/total-spent`),
  customerLoyaltyScore: (id: string) => api(`/stats/customer/${id}/loyalty-score`),
  productStockStatus: (id: string) => api(`/stats/product/${id}/stock-status`),
  lowStockProducts: (threshold?: number) => api(`/stats/product/low-stock${threshold ? `?threshold=${threshold}` : ''}`),
  productSalesHistory: (id: string, from?: string, to?: string) => api(`/stats/product/${id}/sales-history${from && to ? `?from=${from}&to=${to}` : ''}`),
  orderStatusHistory: (id: string) => api(`/stats/order/${id}/status-history`),
  dailySummary: (date: string) => api(`/stats/reports/daily-summary?date=${date}`),
};

// Invoice API
export const invoiceAPI = {
  create: (data: any) => api('/invoices', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: string) => api(`/invoices/${id}`),
  update: (id: string, data: any) => api(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => api(`/invoices/${id}`, { method: 'DELETE' }),
};

// Login API
export const LoginAPI = {
  login: async (email: string, password: string) => {
    const adminsRaw = await adminAPI.getById("all").catch(() => []);
    const employeesRaw = await employeeAPI.getAll().catch(() => []);
    const customersRaw = await customerAPI.getAll().catch(() => []);

    const admins = Array.isArray(adminsRaw) ? adminsRaw : [];
    const employees = Array.isArray(employeesRaw) ? employeesRaw : [];
    const customers = Array.isArray(customersRaw) ? customersRaw : [];

    const allUsers = [
      ...admins.map((u: any) => ({ ...u, role: "admin" })),
      ...employees.map((u: any) => ({ ...u, role: "employee" })),
      ...customers.map((u: any) => ({ ...u, role: "customer" })),
    ];

    const user = allUsers.find((u: any) => u.email === email);
    if (!user) throw new Error("Usuario no encontrado");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error("Contraseña incorrecta");

    // Guardar sesión
    sessionStorage.setItem("user", JSON.stringify(user));

    return user;
  },
};

export const RegisterAPI = {
  registerCustomer: async (data: any) => {
    const user = await customerAPI.create({ ...data });
    const userWithRole = { ...(typeof user === 'object' && user !== null ? user : {}), role: "customer" };
    sessionStorage.setItem("user", JSON.stringify(userWithRole));
    return userWithRole;
  },
};
