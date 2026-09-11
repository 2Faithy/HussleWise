const API_BASE_URL = 'http://localhost:4000/api';

interface ApiError {
  error: string;
  code?: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Access token expired — try one silent refresh, then retry the
  // original request exactly once. Skip this for the auth endpoints
  // themselves, so a bad login attempt doesn't trigger a refresh loop.
  if (res.status === 401 && !isRetry && !path.startsWith('/auth/')) {
    try {
      await refreshAccessToken();
      return request<T>(path, options, true);
    } catch {
      window.location.href = '/login';
      throw new ApiRequestError('Session expired. Please log in again.', undefined, 401);
    }
  }

  const data = await res.json();

  if (!res.ok) {
    const err = data as ApiError;
    throw new ApiRequestError(err.error || 'Something went wrong.', err.code, res.status);
  }

  return data as T;
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // Dedupe concurrent 401s — if five requests fail at once, only fire
  // one refresh call, and let all five wait on the same promise.
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available.');

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Session expired. Please log in again.');
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    return data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export class ApiRequestError extends Error {
  code?: string;
  status: number;

  constructor(message: string, code: string | undefined, status: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.code = code;
    this.status = status;
  }
}

// ---- Auth endpoints ----

export interface SignUpPayload {
  businessName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  userType: 'owner' | 'staff';
  role?: string;
  staffName?: string;
  business: {
    id: string;
    businessName: string;
    fullName: string;
    email: string;
    onboardingComplete: boolean;
  };
}

export function signUp(payload: SignUpPayload) {
  return request<{ message: string; businessId: string; email: string }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function verifyEmail(email: string, code: string) {
  return request<{ message: string }>('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  });
}

export function resendVerification(email: string) {
  return request<{ message: string }>('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function login(payload: LoginPayload) {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function forgotPassword(email: string) {
  return request<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(email: string, code: string, newPassword: string) {
  return request<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email, code, newPassword }),
  });
}

// ---- Business profile endpoints ----

export interface BusinessProfileResponse {
  id: string;
  businessName: string;
  fullName: string;
  email: string;
  phone: string | null;
  address: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  businessLogo: string | null;
  category: string | null;
  businessType: string | null;
  state: string | null;
  teamSize: string | null;
  yearsOperating: string | null;
  monthlyRevenueRange: string | null;
  goals: string[];
  storefrontSlug: string;
  storefrontOpen: boolean;
  onboardingComplete: boolean;
  offersDelivery: boolean;
  about: string | null;
  notifyLowStock: boolean;
  notifyOverdueDebts: boolean;
  notifyDailySummary: boolean;
  notifyGrowthTips: boolean;
}

export function getBusinessProfile() {
  return request<BusinessProfileResponse>('/business-profile');
}

export function deleteAccountApi() {
  return request<{ message: string }>('/business-profile', { method: 'DELETE' });
}

export function updateBusinessProfileApi(data: Partial<BusinessProfileResponse>) {
  return request<BusinessProfileResponse>('/business-profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// ---- Sales & Expenses endpoints ----

export interface SaleRecord {
  id: string;
  amount: number;
  item: string;
  paymentMethod: 'cash' | 'transfer' | 'pos';
  category: string;
  date: string;
  quantity?: number | null;
  discount?: number;
  inventoryItemId?: string | null;
  receiptSent?: boolean;
  debtId?: string | null;
}

export interface CreateSalePayload {
  paymentMethod: 'cash' | 'transfer' | 'pos';
  category: string;
  date: string;
  // Custom sale path
  item?: string;
  amount?: number;
  // Inventory-linked sale path
  inventoryItemId?: string;
  quantity?: number;
  discount?: number;
}

export interface BulkSaleLine {
  inventoryItemId?: string;
  quantity?: number;
  discount?: number;
  item?: string;
  amount?: number;
  category?: string;
}

export interface CreateBulkSalePayload {
  items: BulkSaleLine[];
  paymentMethod: 'cash' | 'transfer' | 'pos';
  date: string;
}

export function createSalesBulk(payload: CreateBulkSalePayload) {
  return request<SaleRecord[]>('/sales/bulk', { method: 'POST', body: JSON.stringify(payload) });
}

export function getSales() {
  return request<SaleRecord[]>('/sales');
}
export function createSale(payload: CreateSalePayload) {
  return request<SaleRecord>('/sales', { method: 'POST', body: JSON.stringify(payload) });
}
export function deleteSaleApi(id: string) {
  return request<{ message: string }>(`/sales/${id}`, { method: 'DELETE' });
}

export function markReceiptSentApi(id: string) {
  return request<SaleRecord>(`/sales/${id}/receipt-sent`, { method: 'PATCH' });
}

export interface ExpenseRecord {
  id: string;
  amount: number;
  type: string;
  description?: string | null;
  recurring: boolean;
  date: string;
}

export function getExpenses() {
  return request<ExpenseRecord[]>('/expenses');
}
export function createExpense(payload: Omit<ExpenseRecord, 'id'>) {
  return request<ExpenseRecord>('/expenses', { method: 'POST', body: JSON.stringify(payload) });
}
export function deleteExpenseApi(id: string) {
  return request<{ message: string }>(`/expenses/${id}`, { method: 'DELETE' });
}

// ---- Inventory endpoints ----

export interface InventoryItemRecord {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold: number;
}

export function getInventory() {
  return request<InventoryItemRecord[]>('/inventory');
}
export function createInventoryItemApi(payload: Omit<InventoryItemRecord, 'id'>) {
  return request<InventoryItemRecord>('/inventory', { method: 'POST', body: JSON.stringify(payload) });
}
export function updateInventoryItemApi(id: string, payload: Partial<Omit<InventoryItemRecord, 'id'>>) {
  return request<InventoryItemRecord>(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(payload) });
}
export function deleteInventoryItemApi(id: string) {
  return request<{ message: string }>(`/inventory/${id}`, { method: 'DELETE' });
}

// ---- Debts endpoints ----

export interface DebtLineItem {
  inventoryItemId?: string | null;
  name: string;
  quantity?: number | null;
  unitPrice?: number | null;
  discount: number;
  amount: number;
}

export interface DebtRecord {
  id: string;
  customerName: string;
  phone?: string | null;
  item: string;
  amount: number;
  amountPaid: number;
  dateGiven: string;
  dueDate: string;
  status: string;
  quantity?: number | null;
  discount?: number;
  inventoryItemId?: string | null;
  items?: DebtLineItem[] | null;
}

export interface DebtLinePayload {
  inventoryItemId?: string;
  quantity?: number;
  discount?: number;
  item?: string;
  amount?: number;
}

export interface CreateDebtPayload {
  customerName: string;
  phone?: string;
  dueDate: string;
  items: DebtLinePayload[];
  amountPaid?: number;
  paymentMethod?: 'cash' | 'transfer' | 'pos';
}

export interface DebtPaymentResponse {
  debt: DebtRecord;
  sale: SaleRecord | null;
}

export function getDebts() {
  return request<DebtRecord[]>('/debts');
}
export function createDebt(payload: CreateDebtPayload) {
  return request<DebtPaymentResponse>('/debts', { method: 'POST', body: JSON.stringify(payload) });
}
export function recordDebtPaymentApi(id: string, amount: number, paymentMethod: 'cash' | 'transfer' | 'pos') {
  return request<DebtPaymentResponse>(`/debts/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ amount, paymentMethod }),
  });
}
export function deleteDebtApi(id: string) {
  return request<{ message: string }>(`/debts/${id}`, { method: 'DELETE' });
}

// ---- Public storefront endpoints (no auth) ----

export interface PublicStoreProduct {
  id: string;
  name: string;
  sellingPrice: number;
  quantity: number;
  unit: string;
}

export interface PublicStoreBusiness {
  businessName: string;
  phone?: string | null;
  address?: string | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  businessLogo?: string | null;
  storefrontOpen: boolean;
  storefrontSlug: string;
  offersDelivery: boolean;
}

export interface PublicStoreResponse {
  business: PublicStoreBusiness;
  products: PublicStoreProduct[];
}

export interface PlacePublicOrderPayload {
  items: { itemId: string; quantity: number }[];
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string;
  paymentMethod: 'transfer' | 'pay_on_pickup';
  paymentProof?: string;
}

async function publicRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new ApiRequestError((data as ApiError).error || 'Something went wrong.', undefined, res.status);
  }
  return data as T;
}

export function getPublicStore(slug: string) {
  return publicRequest<PublicStoreResponse>(`/public/store/${slug}`);
}

export function placePublicOrder(slug: string, payload: PlacePublicOrderPayload) {
  return publicRequest<{ message: string; orderId: string }>(`/public/store/${slug}/orders`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

// ---- Storefront orders (business-side, authenticated) ----

export interface StorefrontOrderRecord {
  id: string;
  items: { itemId: string; name: string; price: number; quantity: number }[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryMethod: string;
  deliveryAddress?: string | null;
  paymentMethod: string;
  paymentProof?: string | null;
  paymentConfirmed: boolean;
  deliveryFee?: number | null;
  status: string;
  date: string;
}

export function getStorefrontOrders() {
  return request<StorefrontOrderRecord[]>('/storefront-orders');
}
export function confirmStorefrontOrderApi(id: string) {
  return request<StorefrontOrderRecord>(`/storefront-orders/${id}/confirm`, { method: 'PATCH' });
}
export function completeStorefrontOrderApi(id: string, deliveryFee?: number) {
  return request<StorefrontOrderRecord>(`/storefront-orders/${id}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ deliveryFee }),
  });
}
export function declineStorefrontOrderApi(id: string) {
  return request<StorefrontOrderRecord>(`/storefront-orders/${id}/decline`, { method: 'PATCH' });
}

// ---- Business registration endpoints ----

export interface RegistrationRecord {
  id: string;
  businessName: string;
  businessType: string;
  ownerFullName: string;
  ownerNIN: string;
  documentsConfirmed: boolean;
  paymentProof: string | null;
  paymentConfirmed: boolean;
  status: string;
  submittedDate: string;
  estimatedCompletionDate: string;
}

export interface SubmitRegistrationPayload {
  businessName: string;
  businessType: string;
  ownerFullName: string;
  ownerNIN: string;
  documentsConfirmed: boolean;
  paymentProof: string;
}

export function getRegistration() {
  return request<RegistrationRecord | null>('/registration');
}
export function submitRegistrationApi(payload: SubmitRegistrationPayload) {
  return request<RegistrationRecord>('/registration', { method: 'POST', body: JSON.stringify(payload) });
}

// ---- AI Assistant (vision) endpoint ----

export interface PhotoAnalysisResult {
  name: string;
  quantity: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
}

export function analyzeProductPhotoApi(imageDataUrl: string, mimeType: string) {
  return request<PhotoAnalysisResult>('/assistant/vision', {
    method: 'POST',
    body: JSON.stringify({ image: imageDataUrl, mimeType }),
  });
}

// ---- Staff endpoints (owner-side, authenticated) ----

export interface StaffRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
  dateAdded: string;
}

export interface AddStaffPayload {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export function getStaff() {
  return request<StaffRecord[]>('/staff');
}
export function addStaffApi(payload: AddStaffPayload) {
  return request<StaffRecord>('/staff', { method: 'POST', body: JSON.stringify(payload) });
}
export function updateStaffRoleApi(id: string, role: string) {
  return request<StaffRecord>(`/staff/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) });
}
export function toggleStaffStatusApi(id: string) {
  return request<StaffRecord>(`/staff/${id}/status`, { method: 'PATCH' });
}
export function removeStaffApi(id: string) {
  return request<{ message: string }>(`/staff/${id}`, { method: 'DELETE' });
}

// ---- Staff invite acceptance (public, no auth) ----

export function acceptStaffInvite(token: string, password: string) {
  return publicRequest<{ message: string }>('/staff-auth/accept-invite', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}