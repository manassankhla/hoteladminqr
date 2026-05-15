import { apiFetch } from "./client"

/**
 * Authentication related API calls
 */
export const authService = {
  // Login
  login: async (credentials: any) => {
    const data = await apiFetch("/api/signin", {
      method: "POST",
      body: JSON.stringify(credentials),
    })

    // Save token
    if (data?.token && typeof window !== "undefined") {
      localStorage.setItem("admin_token", data.token)
    }

    return data
  },

  // Signup
  signup: async (userData: any) => {
    return await apiFetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })
  },

  // Logout
  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token")
      window.location.replace("/login")
    }
  },
}
