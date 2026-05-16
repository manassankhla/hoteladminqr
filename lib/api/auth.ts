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
      
      // Set cookie for middleware (expires in 7 days)
      const expires = new Date()
      expires.setDate(expires.getDate() + 7)
      document.cookie = `admin_token=${data.token}; path=/; expires=${expires.toUTCString()}; SameSite=Lax`
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
      
      // Remove cookie
      document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
      
      window.location.replace("/login")
    }
  },
}

