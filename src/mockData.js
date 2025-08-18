export const mockUsers = [
  {
    id: 1,
    name: "Mama Nkechi",
    email: "mama@example.com",
    password: "tomatoes123",
    business: "Nkechi Tomatoes",
    type: "food",
    transactions: [
      { id: 1, type: "Money In", amount: 15000, description: "Bulk tomatoes (Cash)", date: "Today 9:30 AM" },
      { id: 2, type: "Money Out", amount: 5000, description: "Market supplies", date: "Today 7:00 AM" }
    ],
    metrics: {
      todaySales: 15000,
      todayExpenses: 9000,
      balance: 6000,
      bestSellingItem: "Tomatoes",
      customerCount: 42,
      businessHealth: 78,
      weeklyTrend: [12000, 15000, 8000, 18000, 20000, 25000, 10000], // Last 7 days
      expenseCategories: [
        { name: "Supplies", value: 45 },
        { name: "Transport", value: 25 },
        { name: "Rent", value: 30 }
      ]
    }
  },
  {
    id: 2,
    name: "Emeka Electronics",
    email: "emeka@example.com",
    password: "electronics123",
    business: "Emeka Electronics",
    type: "electronics",
    transactions: [
      { id: 1, type: "Money In", amount: 45000, description: "TV sale (POS)", date: "Today 11:20 AM" },
      { id: 2, type: "Money Out", amount: 30000, description: "New stock purchase", date: "Today 10:00 AM" }
    ],
    metrics: {
      todaySales: 45000,
      todayExpenses: 35000,
      balance: 10000,
      bestSellingItem: "Phone Accessories",
      customerCount: 18,
      businessHealth: 65,
      weeklyTrend: [30000, 25000, 40000, 35000, 45000, 20000, 15000],
      expenseCategories: [
        { name: "Inventory", value: 60 },
        { name: "Repairs", value: 20 },
        { name: "Shop Rent", value: 20 }
      ]
    }
  }
];

// Get user data by email
export const getUserData = (email) => {
  return mockUsers.find(user => user.email === email);
};

// Simulate API login
export const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers.find(
        user => user.email === email && user.password === password
      );
      if (user) {
        // Remove password before returning
        const { password: _, ...userData } = user; 
        resolve(userData);
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};