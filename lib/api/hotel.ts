import { apiFetch } from "./client"

/**
 * Hotel and Admin related API calls
 */
export const hotelService = {
  // Dashboard global stats
  getStats: async () => {
    return await apiFetch("/api/admin/stats")
  },

  // All hotels list
  getHotels: async () => {
    return await apiFetch("/api/admin/hotels")
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
}
