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
