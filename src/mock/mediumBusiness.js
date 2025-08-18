export const mediumBusinessData = {
  metrics: {
    todaySales: 185000,
    todayExpenses: 75000,
    balance: 110000,
    businessHealth: 78,
    weeklyTrend: [80000, 95000, 110000, 125000, 140000, 160000, 185000],
    expenseCategories: [
      { name: "Inventory", value: 45 },
      { name: "Salaries", value: 30 },
      { name: "Rent", value: 15 },
      { name: "Utilities", value: 10 }
    ],
    topProducts: [
      { name: "Smartphones", sales: 80000 },
      { name: "Accessories", sales: 45000 },
      { name: "Laptops", sales: 30000 }
    ]
  },
  transactions: [
    { id: 1, type: "Money In", description: "Phone sales", amount: 65000, date: "Today, 11:45 AM" },
    { id: 2, type: "Money Out", description: "Supplier payment", amount: 45000, date: "Today, 10:00 AM" },
    { id: 3, type: "Money In", description: "Accessories sale", amount: 35000, date: "Today, 9:30 AM" }
  ]
};