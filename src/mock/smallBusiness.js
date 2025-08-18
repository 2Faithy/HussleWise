export const smallBusinessData = {
  metrics: {
    todaySales: 45000,
    todayExpenses: 18000,
    balance: 27000,
    businessHealth: 68,
    weeklyTrend: [12000, 15000, 18000, 22000, 25000, 30000, 45000],
    expenseCategories: [
      { name: "Inventory", value: 60 },
      { name: "Transport", value: 20 },
      { name: "Misc", value: 20 }
    ],
    topProducts: [
      { name: "Tomatoes", sales: 15000 },
      { name: "Pepper", sales: 10000 },
      { name: "Onions", sales: 8000 }
    ]
  },
  transactions: [
    { id: 1, type: "Money In", description: "Tomatoes sale", amount: 15000, date: "Today, 10:30 AM" },
    { id: 2, type: "Money Out", description: "Market supplies", amount: 8000, date: "Today, 8:45 AM" },
    { id: 3, type: "Money In", description: "Pepper sale", amount: 10000, date: "Yesterday, 4:15 PM" }
  ]
};