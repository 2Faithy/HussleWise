export const largeBusinessData = {
  metrics: {
    todaySales: 450000,
    todayExpenses: 220000,
    balance: 230000,
    businessHealth: 85,
    weeklyTrend: [280000, 320000, 350000, 380000, 400000, 420000, 450000],
    expenseCategories: [
      { name: "Inventory", value: 50 },
      { name: "Staff", value: 25 },
      { name: "Operations", value: 15 },
      { name: "Marketing", value: 10 }
    ],
    topProducts: [
      { name: "Groceries", sales: 180000 },
      { name: "Electronics", sales: 120000 },
      { name: "Household", sales: 90000 }
    ]
  },
  transactions: [
    { id: 1, type: "Money In", description: "Bulk order", amount: 150000, date: "Today, 12:30 PM" },
    { id: 2, type: "Money Out", description: "Supplier payment", amount: 120000, date: "Today, 11:00 AM" },
    { id: 3, type: "Money In", description: "Retail sales", amount: 90000, date: "Today, 10:15 AM" }
  ]
};