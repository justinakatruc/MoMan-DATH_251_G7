import { Transaction } from "@/app/model";

const BASE_API = "http://localhost:3000/api";

export const authAPI = {
  signup: async (userData: {
    firstName: string;
    lastName: string;
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

    return response.json();
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

  removeCategory: async (categoryId: string, type: "expense" | "income") => {
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
      }),
    });
    return response.json();
  },
};

export const transactionAPI = {
  getAllTransactions: async () => {
    const response = await fetch(`${BASE_API}/transactions`, {
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
  addTransaction: async (transaction: {
    type: "expense" | "income";
    date: string;
    name: string;
    amount: number;
    categoryId: string;
    description?: string;
  }) => {
    const response = await fetch(`${BASE_API}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addTransaction",
        token: localStorage.getItem("token"),
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
  }) => {
    const response = await fetch(`${BASE_API}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "addEvent",
        token: localStorage.getItem("token"),
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
  updateUserProfile: async (updatedData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
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
};
