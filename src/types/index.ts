export interface Sale {
  id: string;
  amount: number;
  item: string;
  paymentMethod: 'cash' | 'transfer' | 'pos';
  category: string;
  customerId?: string;
  date: string;
  quantity?: number;
  discount?: number;
  inventoryItemId?: string | null;
  receiptSent?: boolean;
  debtId?: string | null;
}

export interface Expense {
  id: string;
  amount: number;
  type: string;
  description?: string;
  recurring: boolean;
  date: string;
}

export interface DebtLineItem {
  inventoryItemId?: string | null;
  name: string;
  quantity?: number | null;
  unitPrice?: number | null;
  discount: number;
  amount: number;
}

export interface Debt {
  id: string;
  customerName: string;
  phone?: string;
  item: string;
  amount: number;
  amountPaid: number;
  dateGiven: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  quantity?: number;
  discount?: number;
  inventoryItemId?: string | null;
  items?: DebtLineItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string; // e.g. "baskets", "bags", "pieces"
  costPrice: number;
  sellingPrice: number;
  lowStockThreshold: number;
}

export type RegistrationStatus = 'not_started' | 'submitted' | 'in_review' | 'filed' | 'approved';

export interface BusinessRegistration {
  id?: string;
  businessName: string;
  businessType: string;
  ownerFullName: string;
  ownerNIN: string;
  documentsConfirmed: boolean;
  paymentProof?: string | null;
  paymentConfirmed?: boolean;
  status: RegistrationStatus;
  submittedDate: string;
  estimatedCompletionDate: string;
}

export interface StorefrontOrder {
  id: string;
  items: { itemId: string; name: string; price: number; quantity: number }[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryAddress?: string | null;
  paymentMethod: 'transfer' | 'pay_on_pickup';
  paymentProof?: string | null;
  paymentConfirmed: boolean;
  deliveryFee?: number | null;
  status: 'pending' | 'confirmed' | 'completed' | 'declined';
  date: string;
}

export interface OfflineEntry {
  id: string;
  rawMessage: string;
  type: 'sale' | 'expense' | 'unknown';
  amount?: number;
  description?: string;
  status: 'queued' | 'synced' | 'error';
  timestamp: string;
}

export type StaffRole = 'admin' | 'manager' | 'cashier';

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: StaffRole;
  status: 'active' | 'pending' | 'suspended';
  dateAdded: string;
}

// Route paths each role can access — drives both the sidebar and route guarding.
export const ROLE_PAGE_ACCESS: Record<StaffRole, string[]> = {
  admin: [
    '/app', '/app/assistant', '/app/sales', '/app/debts', '/app/inventory',
    '/app/storefront', '/app/receipts', '/app/get-paid', '/app/growth',
    '/app/registration', '/app/offline-sync', '/app/loans', '/app/staff', '/app/settings',
  ],
  manager: [
    '/app', '/app/assistant', '/app/sales', '/app/debts', '/app/inventory',
    '/app/storefront', '/app/receipts', '/app/get-paid', '/app/growth', '/app/offline-sync',
  ],
  cashier: [
    '/app', '/app/sales', '/app/debts', '/app/inventory', '/app/receipts', '/app/get-paid',
  ],
};

// Human-readable list shown in the Staff permissions viewer.
export const ROLE_PERMISSIONS: Record<StaffRole, string[]> = {
  admin: [
    'View Dashboard', 'AI Assistant', 'Manage Sales & Expenses', 'Manage Debts', 'Manage Inventory',
    'Manage Storefront', 'Generate Receipts', 'View Get Paid', 'Growth Tools', 'Business Registration',
    'Offline Sync', 'Funding', 'Manage Staff', 'Manage Settings',
  ],
  manager: [
    'View Dashboard', 'AI Assistant', 'Manage Sales & Expenses', 'Manage Debts', 'Manage Inventory',
    'Manage Storefront', 'Generate Receipts', 'View Get Paid', 'Growth Tools', 'Offline Sync',
  ],
  cashier: [
    'View Dashboard', 'Manage Sales & Expenses', 'Manage Debts', 'Manage Inventory', 'Generate Receipts', 'View Get Paid',
  ],
};

export interface Loan {
  id: string;
  amount: number;
  interestRate: number; // annual %
  termMonths: number;
  monthlyRepayment: number;
  totalRepayable: number;
  amountRepaid: number;
  status: 'active' | 'completed';
  disbursedDate: string;
  nextDueDate: string;
}

export interface LoanTier {
  minScore: number;
  maxAmount: number;
  interestRate: number;
  label: string;
}

export const LOAN_TIERS: LoanTier[] = [
  { minScore: 80, maxAmount: 200000, interestRate: 12, label: 'Gold' },
  { minScore: 60, maxAmount: 100000, interestRate: 16, label: 'Silver' },
  { minScore: 40, maxAmount: 50000, interestRate: 20, label: 'Bronze' },
];