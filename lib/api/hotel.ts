import { apiFetch } from "./client"

/**
 * Hotel and Admin related API calls
 */
export const hotelService = {
  // Dashboard global stats
  getStats: async () => {
    return await apiFetch("/api/admin/stats")
  },

  // All hotels list with pagination
  getHotels: async (page = 1, limit = 10) => {
    return await apiFetch(`/api/admin/hotels?page=${page}&limit=${limit}`)
  },


  // Single hotel detailed stats
  getHotelStats: async (id: string) => {
    return await apiFetch(`/api/admin/hotels/${id}/stats`)
  },

  // Create new hotel
  createHotel: async (hotelData: any) => {
    return await apiFetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(hotelData),
    })
  },

  // All transactions / recharge history
  getTransactions: async (page = 1, limit = 20) => {
    return await apiFetch(`/api/admin/transactions?page=${page}&limit=${limit}`)
  },

  // Transactions for a specific hotel (by userId)
  getHotelTransactions: async (userId: string) => {
    return await apiFetch(`/api/admin/transactions?userId=${userId}&limit=50`)
  },
}
