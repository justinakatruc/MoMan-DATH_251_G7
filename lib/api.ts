import { Transaction } from "@/app/model";

const BASE_API = "http://localhost:3000/api";

export const authAPI = {
  signup: async (userData: {
  fullName: string;
  email: string;
  password: string;
  }) => {
    const response = await fetch(`${BASE_API}/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "signup",
        ...userData,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 400 && result.missing) {
        throw {
          status: 400,
          message: result.message || "Missing required fields",
          missing: result.missing,
        };
      }

      throw {
        status: response.status,
        message: result.message || "Signup failed",
      };
    }

    return result;
  },

  verifyEmail: async (token: string) => {
  const response = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "verify-email",
      token,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: result.message || "Email verification failed",
    };
  }

  return result;
  },

  resendVerify: async (email: string) => {
  const res = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "resend-verify-email",
      email, }),
  });
  
  const result = await res.json();
  
  if (!res.ok) throw new Error(result.message);
  
  return result;
},


login: async (credentials: { email: string; password: string }) => {
  const response = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "login",
      ...credentials,
    }),
  });
  
  return response.json();
},

logout: async () => {
  const response = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "logout",
      token: localStorage.getItem("token"),
    }),
  });
  
  return response.json();
},

forgotPassword: async (email: string) => {
  const response = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "forgot-password",
      email,
    }),
  });
  
  return response.json();
},

resetPassword: async (token: string, password: string) => {
  const response = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "reset-password",
      token,
      password,
    }),
  });
  
  return response.json();
},

authorize: async () => {
  const response = await fetch(`${BASE_API}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      action: "authorize",
      token: localStorage.getItem("token"),
    }),
  });
  
  return response.json();
},
};

export const categoryAPI = {
  getDefaultCategories: async () => {
    const response = await fetch(`${BASE_API}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getDefaultCategories",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },
  
  getUserCategories: async () => {
    const response = await fetch(`${BASE_API}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getUserCategories",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },
  
  addCategory: async (category: {
    type: "expense" | "income";
    name: string;
    icon: string;
    isDefault: boolean;
  }) => {
    const response = await fetch(`${BASE_API}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addCategory",
        token: localStorage.getItem("token"),
        category,
      }),
    });
    return response.json();
  },
  
  removeCategory: async (
    categoryId: string,
    type: "expense" | "income",
    isDefault: boolean = false
  ) => {
    const response = await fetch(`${BASE_API}/categories`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "removeCategory",
        token: localStorage.getItem("token"),
        categoryId,
        type,
        isDefault,
      }),
    });
    return response.json();
  },
};

export const transactionAPI = {
  getAllTransactions: async (authToken?: string) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getAllTransactions",
        token: authToken || localStorage.getItem("token"),
      }),
    });
    return response.json();
  },
  getCategoryTransactions: async (categoryId: string) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getCategoryTransactions",
        token: localStorage.getItem("token"),
        categoryId,
      }),
    });
    return response.json();
  },
  searchTransactions: async (
    category: string | undefined,
    type: string,
    date: string
  ) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "searchTransactions",
        token: localStorage.getItem("token"),
        category,
        type,
        date,
      }),
    });
    return response.json();
  },
  addTransaction: async (transaction: {
    type: "expense" | "income";
    date: string;
    name: string;
    amount: number;
    categoryId: string;
    description?: string;
  }, authToken?: string) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addTransaction",
        token: authToken || localStorage.getItem("token"),
        transaction: transaction,
      }),
    });
    return response.json();
  },
  updateTransaction: async (
    transactionId: string,
    updated: Partial<Transaction>
  ) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateTransaction",
        token: localStorage.getItem("token"),
        transactionId,
        updated,
      }),
    });
    return response.json();
  },
  removeTransaction: async (transactionId: string) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "removeTransaction",
        token: localStorage.getItem("token"),
        transactionId,
      }),
    });
    return response.json();
  },
  removeTransactionBaseOnCategory: async (categoryId: string) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "removeTransactionBaseOnCategory",
        token: localStorage.getItem("token"),
        categoryId,
      }),
    });
    return response.json();
  },
};

export const eventAPI = {
  getEvents: async () => {
    const response = await fetch(`${BASE_API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getEvents",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },
  addEvent: async (event: {
    date: Date;
    title: string;
    time: string;
    recurring: boolean;
  }, authToken?: string) => {
    const response = await fetch(`${BASE_API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addEvent",
        token: authToken || localStorage.getItem("token"),
        event,
      }),
    });
    return response.json();
  },
  updateEvent: async (event: {
    id: string;
    date?: Date;
    title?: string;
    time?: string;
    recurring?: boolean;
  }) => {
    const response = await fetch(`${BASE_API}/events`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateEvent",
        token: localStorage.getItem("token"),
        event,
      }),
    });
    return response.json();
  },
  deleteEvent: async (eventId: string) => {
    const response = await fetch(`${BASE_API}/events`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deleteEvent",
        token: localStorage.getItem("token"),
        eventId,
      }),
    });
    return response.json();
  },
};

export const userAPI = {
  updateProfile: async (updatedData: {
    id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  }) => {
    const response = await fetch(`${BASE_API}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updateUserProfile",
        token: localStorage.getItem("token"),
        updatedData,
      }),
    });
    return response.json();
  },

  updatePassword: async (data: {
    token: string | null;
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await fetch(`${BASE_API}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "updatePassword",
        ...data,
      }),
    });

    return response.json();
  },

  deleteAccount: async (data: { token: string | null; password: string }) => {
    const response = await fetch(`${BASE_API}/users`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deleteAccount",
        ...data,
      }),
    });

    return response.json();
  },

};

export const adminAPI = {
  getUsersDashboard: async () => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getUsersDashboard",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  getTransactionsDashboard: async () => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getTransactionsDashboard",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  getTotalBaseCategories: async () => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getTotalBaseCategories",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  getAllDefaultCategories: async () => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getAllDefaultCategories",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  getAllUsers: async () => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getAllUsers",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  getAllTransactions: async () => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getAllTransactions",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  deleteTransaction: async (transactionId: string) => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deleteTransaction",
        token: localStorage.getItem("token"),
        transactionId,
      }),
    });
    return response.json();
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`${BASE_API}/admin`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "deleteUser",
        token: localStorage.getItem("token"),
        userId,
      }),
    });
    return response.json();
  },
};

export const analysisAPI = {
  getTotalIncomeAndExpenses: async () => {
    const response = await fetch(`${BASE_API}/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getTotalIncomeAndExpenses",
        token: localStorage.getItem("token"),
      }),
    });
    return response.json();
  },

  getStatistic: async (timeFrame: string) => {
    const response = await fetch(`${BASE_API}/analysis`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getStatistics",
        token: localStorage.getItem("token"),
        timeFrame,
      }),
    });
    return response.json();
  },
};
