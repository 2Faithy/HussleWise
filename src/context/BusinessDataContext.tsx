import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { parseSMS } from '../utils/smsParser';
import { login as apiLogin, type LoginResponse } from '../lib/api';
import {
  getSales, createSale, deleteSaleApi, createSalesBulk, markReceiptSentApi,
  getExpenses, createExpense, deleteExpenseApi,
  getInventory, createInventoryItemApi, updateInventoryItemApi, deleteInventoryItemApi,
  getDebts, createDebt, recordDebtPaymentApi, deleteDebtApi,
  getBusinessProfile,
  getStorefrontOrders, confirmStorefrontOrderApi, completeStorefrontOrderApi, declineStorefrontOrderApi,
  getRegistration, submitRegistrationApi,
  getStaff, addStaffApi, updateStaffRoleApi, toggleStaffStatusApi, removeStaffApi,
  type CreateSalePayload, type CreateDebtPayload, type BulkSaleLine, type SubmitRegistrationPayload, type AddStaffPayload,
} from '../lib/api';
import type {
  Sale, Expense, Debt, InventoryItem, BusinessRegistration, RegistrationStatus,
  StorefrontOrder, OfflineEntry, StaffMember, StaffRole, Loan,
} from '../types';

export interface BusinessProfile {
  businessName: string;
  phone: string;
  address: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  storefrontSlug: string;
  storefrontOpen: boolean;
  businessLogo: string;
  email: string;
  category: string;
  businessType: string;
  state: string;
  teamSize: string;
  yearsOperating: string;
  monthlyRevenueRange: string;
  goals: string[];
  onboardingComplete: boolean;
  offersDelivery: boolean;
  about: string;
  notifyLowStock: boolean;
  notifyOverdueDebts: boolean;
  notifyDailySummary: boolean;
  notifyGrowthTips: boolean;
}

const defaultProfile: BusinessProfile = {
  businessName: 'My Business',
  phone: '',
  address: '',
  bankName: '',
  accountNumber: '',
  accountName: '',
  storefrontSlug: 'my-business',
  storefrontOpen: true,
  businessLogo: '',
  email: '',
  category: '',
  businessType: '',
  state: '',
  teamSize: '',
  yearsOperating: '',
  monthlyRevenueRange: '',
  goals: [],
  onboardingComplete: false,
  offersDelivery: false,
  about: '',
  notifyLowStock: true,
  notifyOverdueDebts: true,
  notifyDailySummary: false,
  notifyGrowthTips: true,
};

export function nullsToEmpty<T extends object>(obj: T): BusinessProfile {
  const result = { ...obj } as Record<string, any>;
  for (const key in result) {
    if (result[key] === null) {
      result[key] = '';
    }
  }
  return result as BusinessProfile;
}

interface BusinessDataContextType {
  sales: Sale[];
  expenses: Expense[];
  debts: Debt[];
  inventory: InventoryItem[];
  businessProfile: BusinessProfile;
  updateBusinessProfile: (profile: BusinessProfile) => void;
  receiptsSentIds: string[];
  markReceiptSent: (saleId: string) => Promise<void>;
  registration: BusinessRegistration | null;
  submitRegistration: (data: SubmitRegistrationPayload) => Promise<void>;
  addSale: (sale: Omit<Sale, 'id'>) => Promise<void>;
  addSaleBulk: (items: BulkSaleLine[], paymentMethod: 'cash' | 'transfer' | 'pos') => Promise<void>;
  addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
  addDebt: (debt: CreateDebtPayload) => Promise<void>;
  recordDebtPayment: (id: string, amount: number, paymentMethod: 'cash' | 'transfer' | 'pos') => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => Promise<void>;
  updateInventoryQuantity: (id: string, newQuantity: number) => Promise<void>;
  deleteInventoryItem: (id: string) => Promise<void>;
  deleteSale: (id: string) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  todayTotal: (records: { amount: number; date: string }[]) => number;
  storefrontOrders: StorefrontOrder[];
  confirmStorefrontOrder: (id: string) => Promise<void>;
  completeStorefrontOrder: (id: string, deliveryFee?: number) => Promise<void>;
  declineStorefrontOrder: (id: string) => Promise<void>;
  offlineQueue: OfflineEntry[];
  simulateIncomingSMS: (message: string) => void;
  syncOfflineQueue: () => void;
  clearSyncedEntries: () => void;
  staff: StaffMember[];
  addStaffMember: (staff: AddStaffPayload) => Promise<void>;
  updateStaffRole: (id: string, role: StaffMember['role']) => Promise<void>;
  toggleStaffStatus: (id: string) => Promise<void>;
  removeStaffMember: (id: string) => Promise<void>;
  loans: Loan[];
  applyForLoan: (amount: number, termMonths: number, interestRate: number) => void;
  repayLoan: (id: string, amount: number) => void;
  isAuthenticated: boolean;
  currentUserRole: StaffRole | 'owner' | null;
  authLoading: boolean;
  login: (data: LoginResponse) => void;
  logout: () => void;
  loginWithCredentials: (email: string, password: string) => Promise<LoginResponse>;
}

const BusinessDataContext = createContext<BusinessDataContextType | undefined>(undefined);

const today = new Date().toISOString().split('T')[0];

export function BusinessDataProvider({ children }: { children: ReactNode }) {
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(defaultProfile);
  const [registration, setRegistration] = useState<BusinessRegistration | null>(null);
  const [storefrontOrders, setStorefrontOrders] = useState<StorefrontOrder[]>([]);
  const [offlineQueue, setOfflineQueue] = useState<OfflineEntry[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<StaffRole | 'owner' | null>(null);

  const receiptsSentIds = sales.filter((s) => s.receiptSent).map((s) => s.id);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      const savedRole = localStorage.getItem('userRole');
      setCurrentUserRole((savedRole as StaffRole | 'owner') || 'owner');
    }
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || authLoading) return;
    (async () => {
      try {
        const [salesData, expensesData, inventoryData, debtsData, profileData, ordersData, registrationData, staffData] = await Promise.all([
          getSales(),
          getExpenses(),
          getInventory(),
          getDebts(),
          getBusinessProfile(),
          getStorefrontOrders(),
          getRegistration(),
          getStaff(),
        ]);
        setSales(
          salesData.map((s) => ({
            ...s,
            date: s.date.split('T')[0],
            quantity: s.quantity ?? undefined,
            discount: s.discount ?? undefined,
            inventoryItemId: s.inventoryItemId ?? undefined,
          }))
        );
        setExpenses(
          expensesData.map((e) => ({ ...e, date: e.date.split('T')[0], description: e.description ?? '' }))
        );
        setInventory(inventoryData);
        setDebts(
          debtsData.map((d) => ({
            ...d,
            dateGiven: d.dateGiven.split('T')[0],
            dueDate: d.dueDate.split('T')[0],
            phone: d.phone ?? undefined,
            quantity: d.quantity ?? undefined,
            discount: d.discount ?? undefined,
            inventoryItemId: d.inventoryItemId ?? undefined,
            status: d.status as Debt['status'],
            items: d.items ?? undefined,
          }))
        );
        setBusinessProfile((prev) => ({
          ...prev,
          ...nullsToEmpty(profileData),
        }));
        setStorefrontOrders(
          ordersData.map((o) => ({
            ...o,
            deliveryMethod: o.deliveryMethod as StorefrontOrder['deliveryMethod'],
            paymentMethod: o.paymentMethod as StorefrontOrder['paymentMethod'],
            status: o.status as StorefrontOrder['status'],
            date: o.date.split('T')[0],
          }))
        );
        setRegistration(
          registrationData
            ? {
                ...registrationData,
                status: registrationData.status as RegistrationStatus,
                submittedDate: registrationData.submittedDate.split('T')[0],
                estimatedCompletionDate: registrationData.estimatedCompletionDate.split('T')[0],
              }
            : null
        );
        setStaff(
          staffData.map((s) => ({
            ...s,
            phone: s.phone ?? undefined,
            role: s.role as StaffRole,
            status: s.status as StaffMember['status'],
            dateAdded: s.dateAdded.split('T')[0],
          }))
        );
      } catch (err) {
        console.error('Failed to load sales/expenses/inventory/debts/profile/orders/registration/staff:', err);
      }
    })();
  }, [isAuthenticated, authLoading]);

  const login = (data: LoginResponse) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('userRole', data.userType === 'owner' ? 'owner' : data.role || 'cashier');
    setBusinessProfile((prev) => ({
      ...prev,
      businessName: data.business.businessName,
      email: data.business.email,
      onboardingComplete: data.business.onboardingComplete,
    }));
    setCurrentUserRole(data.userType === 'owner' ? 'owner' : (data.role as StaffRole) || 'cashier');
    setIsAuthenticated(true);
  };

  const loginWithCredentials = async (email: string, password: string) => {
    const data = await apiLogin({ email, password });
    login(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setCurrentUserRole(null);
    setSales([]);
    setExpenses([]);
    setInventory([]);
    setDebts([]);
    setStorefrontOrders([]);
    setRegistration(null);
    setStaff([]);
  };

  const addSale = async (sale: Omit<Sale, 'id'>) => {
    try {
      const payload: CreateSalePayload = {
        paymentMethod: sale.paymentMethod,
        category: sale.category,
        date: sale.date,
        ...(sale.inventoryItemId
          ? { inventoryItemId: sale.inventoryItemId, quantity: sale.quantity, discount: sale.discount }
          : { item: sale.item, amount: sale.amount, discount: sale.discount }),
      };

      const created = await createSale(payload);
      const formattedCreated: Sale = {
        ...created,
        date: created.date.split('T')[0],
        quantity: created.quantity ?? undefined,
        discount: created.discount ?? undefined,
        inventoryItemId: created.inventoryItemId ?? undefined,
      };

      setSales((prev) => [formattedCreated, ...prev]);

      if (formattedCreated.inventoryItemId && formattedCreated.quantity) {
        setInventory((prev) =>
          prev.map((i) =>
            i.id === formattedCreated.inventoryItemId ? { ...i, quantity: i.quantity - formattedCreated.quantity! } : i
          )
        );
      }
    } catch (err) {
      console.error('Add sale failed:', err);
    }
  };

  const addSaleBulk = async (items: BulkSaleLine[], paymentMethod: 'cash' | 'transfer' | 'pos') => {
    try {
      const created = await createSalesBulk({
        items,
        paymentMethod,
        date: new Date().toISOString().split('T')[0],
      });

      const formattedCreated: Sale[] = created.map((s) => ({
        ...s,
        date: s.date.split('T')[0],
        quantity: s.quantity ?? undefined,
        discount: s.discount ?? undefined,
        inventoryItemId: s.inventoryItemId ?? undefined,
      }));

      setSales((prev) => [...formattedCreated, ...prev]);

      setInventory((prev) => {
        let updated = [...prev];
        for (const sale of formattedCreated) {
          if (sale.inventoryItemId && sale.quantity) {
            updated = updated.map((i) =>
              i.id === sale.inventoryItemId ? { ...i, quantity: i.quantity - sale.quantity! } : i
            );
          }
        }
        return updated;
      });
    } catch (err) {
      console.error('Bulk sale failed:', err);
      throw err;
    }
  };

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    try {
      const created = await createExpense(expense);
      setExpenses((prev) => [
        { ...created, date: created.date.split('T')[0], description: created.description ?? '' },
        ...prev,
      ]);
    } catch (err) {
      console.error('Add expense failed:', err);
    }
  };

  const addDebt = async (payload: CreateDebtPayload) => {
    try {
      const { debt, sale } = await createDebt(payload);
      setDebts((prev) => [
        {
          ...debt,
          dateGiven: debt.dateGiven.split('T')[0],
          dueDate: debt.dueDate.split('T')[0],
          phone: debt.phone ?? undefined,
          quantity: debt.quantity ?? undefined,
          discount: debt.discount ?? undefined,
          inventoryItemId: debt.inventoryItemId ?? undefined,
          status: debt.status as Debt['status'],
          items: debt.items ?? undefined,
        },
        ...prev,
      ]);
      if (sale) {
        setSales((prev) => [
          {
            ...sale,
            date: sale.date.split('T')[0],
            quantity: sale.quantity ?? undefined,
            discount: sale.discount ?? undefined,
            inventoryItemId: sale.inventoryItemId ?? undefined,
          },
          ...prev,
        ]);
      }
      if (debt.items && debt.items.length > 0) {
        setInventory((prev) => {
          let updated = [...prev];
          for (const line of debt.items!) {
            if (line.inventoryItemId && line.quantity) {
              updated = updated.map((i) =>
                i.id === line.inventoryItemId ? { ...i, quantity: i.quantity - line.quantity! } : i
              );
            }
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Add debt failed:', err);
    }
  };

  const recordDebtPayment = async (id: string, amount: number, paymentMethod: 'cash' | 'transfer' | 'pos') => {
    try {
      const { debt, sale } = await recordDebtPaymentApi(id, amount, paymentMethod);
      setDebts((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...debt,
                dateGiven: debt.dateGiven.split('T')[0],
                dueDate: debt.dueDate.split('T')[0],
                phone: debt.phone ?? undefined,
                quantity: debt.quantity ?? undefined,
                discount: debt.discount ?? undefined,
                inventoryItemId: debt.inventoryItemId ?? undefined,
                status: debt.status as Debt['status'],
                items: debt.items ?? undefined,
              }
            : d
        )
      );
      if (sale) {
        setSales((prev) => [
          {
            ...sale,
            date: sale.date.split('T')[0],
            quantity: sale.quantity ?? undefined,
            discount: sale.discount ?? undefined,
            inventoryItemId: sale.inventoryItemId ?? undefined,
          },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error('Record debt payment failed:', err);
    }
  };

  const deleteDebt = async (id: string) => {
    try {
      const debtBeingDeleted = debts.find((d) => d.id === id);
      await deleteDebtApi(id);
      setDebts((prev) => prev.filter((d) => d.id !== id));

      if (debtBeingDeleted?.items && debtBeingDeleted.items.length > 0) {
        setInventory((prev) => {
          let updated = [...prev];
          for (const line of debtBeingDeleted.items!) {
            if (line.inventoryItemId && line.quantity) {
              updated = updated.map((i) =>
                i.id === line.inventoryItemId ? { ...i, quantity: i.quantity + line.quantity! } : i
              );
            }
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Delete debt failed:', err);
    }
  };

  const addInventoryItem = async (item: Omit<InventoryItem, 'id'>) => {
    try {
      const created = await createInventoryItemApi(item);
      setInventory((prev) => [created, ...prev]);
    } catch (err) {
      console.error('Add inventory item failed:', err);
    }
  };

  const updateInventoryQuantity = async (id: string, newQuantity: number) => {
    try {
      const updated = await updateInventoryItemApi(id, { quantity: newQuantity });
      setInventory((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch (err) {
      console.error('Update inventory quantity failed:', err);
    }
  };

  const deleteInventoryItem = async (id: string) => {
    try {
      await deleteInventoryItemApi(id);
      setInventory((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error('Delete inventory item failed:', err);
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const saleBeingDeleted = sales.find((s) => s.id === id);
      await deleteSaleApi(id);
      setSales((prev) => prev.filter((s) => s.id !== id));

      if (saleBeingDeleted?.inventoryItemId && saleBeingDeleted.quantity) {
        setInventory((prev) =>
          prev.map((i) =>
            i.id === saleBeingDeleted.inventoryItemId
              ? { ...i, quantity: i.quantity + saleBeingDeleted.quantity! }
              : i
          )
        );
      }
    } catch (err) {
      console.error('Delete sale failed:', err);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await deleteExpenseApi(id);
      setExpenses((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Delete expense failed:', err);
    }
  };

  const todayTotal = (records: { amount: number; date: string }[]) => {
    return records
      .filter((r) => r.date === today)
      .reduce((sum, r) => sum + r.amount, 0);
  };

  const updateBusinessProfile = (profile: BusinessProfile) => {
    setBusinessProfile(profile);
  };

  const markReceiptSent = async (saleId: string) => {
    try {
      await markReceiptSentApi(saleId);
      setSales((prev) => prev.map((s) => (s.id === saleId ? { ...s, receiptSent: true } : s)));
    } catch (err) {
      console.error('Mark receipt sent failed:', err);
    }
  };

  const submitRegistration = async (payload: SubmitRegistrationPayload) => {
    try {
      const created = await submitRegistrationApi(payload);
      setRegistration({
        ...created,
        status: created.status as RegistrationStatus,
        submittedDate: created.submittedDate.split('T')[0],
        estimatedCompletionDate: created.estimatedCompletionDate.split('T')[0],
      });
    } catch (err) {
      console.error('Submit registration failed:', err);
      throw err;
    }
  };

  const confirmStorefrontOrder = async (id: string) => {
    try {
      const updated = await confirmStorefrontOrderApi(id);
      setStorefrontOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? { ...o, status: updated.status as StorefrontOrder['status'], paymentConfirmed: updated.paymentConfirmed }
            : o
        )
      );
      const freshSales = await getSales();
      setSales(
        freshSales.map((s) => ({
          ...s,
          date: s.date.split('T')[0],
          quantity: s.quantity ?? undefined,
          discount: s.discount ?? undefined,
          inventoryItemId: s.inventoryItemId ?? undefined,
          debtId: s.debtId ?? undefined,
        }))
      );
    } catch (err) {
      console.error('Confirm order failed:', err);
    }
  };

  const completeStorefrontOrder = async (id: string, deliveryFee?: number) => {
    try {
      const updated = await completeStorefrontOrderApi(id, deliveryFee);
      setStorefrontOrders((prev) =>
        prev.map((o) =>
          o.id === id
            ? {
                ...o,
                status: updated.status as StorefrontOrder['status'],
                paymentConfirmed: updated.paymentConfirmed,
                deliveryFee: updated.deliveryFee,
              }
            : o
        )
      );
      const freshSales = await getSales();
      setSales(
        freshSales.map((s) => ({
          ...s,
          date: s.date.split('T')[0],
          quantity: s.quantity ?? undefined,
          discount: s.discount ?? undefined,
          inventoryItemId: s.inventoryItemId ?? undefined,
          debtId: s.debtId ?? undefined,
        }))
      );
    } catch (err) {
      console.error('Complete order failed:', err);
    }
  };

  const declineStorefrontOrder = async (id: string) => {
    try {
      const updated = await declineStorefrontOrderApi(id);
      setStorefrontOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: updated.status as StorefrontOrder['status'] } : o))
      );
      const freshInventory = await getInventory();
      setInventory(freshInventory);
    } catch (err) {
      console.error('Decline order failed:', err);
    }
  };

  const simulateIncomingSMS = (message: string) => {
    const parsed = parseSMS(message);
    setOfflineQueue((prev) => [
      {
        ...parsed,
        id: `sms${Date.now()}`,
        status: parsed.type === 'unknown' ? 'error' : 'queued',
        timestamp: new Date().toLocaleString('en-NG'),
      },
      ...prev,
    ]);
  };

  const syncOfflineQueue = () => {
    setOfflineQueue((prev) =>
      prev.map((entry) => {
        if (entry.status !== 'queued') return entry;

        if (entry.type === 'sale' && entry.amount) {
          addSale({
            item: entry.description || 'Sale via SMS',
            amount: entry.amount,
            paymentMethod: 'cash',
            category: 'Product Sales',
            date: new Date().toISOString().split('T')[0],
          });
        } else if (entry.type === 'expense' && entry.amount) {
          addExpense({
            type: entry.description || 'Expense via SMS',
            amount: entry.amount,
            recurring: false,
            date: new Date().toISOString().split('T')[0],
          });
        }

        return { ...entry, status: 'synced' as const };
      })
    );
  };

  const clearSyncedEntries = () => {
    setOfflineQueue((prev) => prev.filter((e) => e.status !== 'synced'));
  };

  const addStaffMember = async (member: AddStaffPayload) => {
    try {
      const created = await addStaffApi(member);
      setStaff((prev) => [
        {
          ...created,
          phone: created.phone ?? undefined,
          role: created.role as StaffRole,
          status: created.status as StaffMember['status'],
          dateAdded: created.dateAdded.split('T')[0],
        },
        ...prev,
      ]);
    } catch (err) {
      console.error('Add staff failed:', err);
      throw err;
    }
  };

  const updateStaffRole = async (id: string, role: StaffMember['role']) => {
    try {
      await updateStaffRoleApi(id, role);
      setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, role } : s)));
    } catch (err) {
      console.error('Update staff role failed:', err);
    }
  };

  const toggleStaffStatus = async (id: string) => {
    try {
      const updated = await toggleStaffStatusApi(id);
      setStaff((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: updated.status as StaffMember['status'] } : s))
      );
    } catch (err) {
      console.error('Toggle staff status failed:', err);
    }
  };

  const removeStaffMember = async (id: string) => {
    try {
      await removeStaffApi(id);
      setStaff((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Remove staff failed:', err);
    }
  };

  const applyForLoan = (amount: number, termMonths: number, interestRate: number) => {
    const totalRepayable = Math.round(amount * (1 + (interestRate / 100) * (termMonths / 12)));
    const monthlyRepayment = Math.round(totalRepayable / termMonths);
    const nextDue = new Date();
    nextDue.setMonth(nextDue.getMonth() + 1);

    setLoans((prev) => [
      {
        id: `ln${Date.now()}`,
        amount,
        interestRate,
        termMonths,
        monthlyRepayment,
        totalRepayable,
        amountRepaid: 0,
        status: 'active',
        disbursedDate: new Date().toISOString().split('T')[0],
        nextDueDate: nextDue.toISOString().split('T')[0],
      },
      ...prev,
    ]);
  };

  const repayLoan = (id: string, amount: number) => {
    setLoans((prev) =>
      prev.map((loan) => {
        if (loan.id !== id) return loan;
        const newRepaid = loan.amountRepaid + amount;
        const isComplete = newRepaid >= loan.totalRepayable;
        const nextDue = new Date(loan.nextDueDate);
        nextDue.setMonth(nextDue.getMonth() + 1);

        return {
          ...loan,
          amountRepaid: newRepaid,
          status: isComplete ? 'completed' : 'active',
          nextDueDate: isComplete ? loan.nextDueDate : nextDue.toISOString().split('T')[0],
        };
      })
    );
  };

  return (
    <BusinessDataContext.Provider
      value={{
        sales, expenses, debts, inventory,
        businessProfile, updateBusinessProfile,
        receiptsSentIds, markReceiptSent,
        registration, submitRegistration,
        storefrontOrders, confirmStorefrontOrder, declineStorefrontOrder, completeStorefrontOrder,
        offlineQueue, simulateIncomingSMS, syncOfflineQueue, clearSyncedEntries,
        staff, addStaffMember, updateStaffRole, toggleStaffStatus, removeStaffMember,
        loans, applyForLoan, repayLoan,
        addSale, addExpense, addSaleBulk,
        addDebt, recordDebtPayment, deleteDebt,
        addInventoryItem, updateInventoryQuantity, deleteInventoryItem,
        deleteSale, deleteExpense,
        todayTotal, isAuthenticated, currentUserRole, authLoading, login, logout, loginWithCredentials,
      }}
    >
      {children}
    </BusinessDataContext.Provider>
  );
}

export function useBusinessData() {
  const context = useContext(BusinessDataContext);
  if (!context) {
    throw new Error('useBusinessData must be used within a BusinessDataProvider');
  }
  return context;
}