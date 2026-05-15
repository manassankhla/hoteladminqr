"use client"

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://hotel-qr-api.vercel.app"

/**
 * Generic API Fetch Wrapper
 */
export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  try {
    // Get token only on client side
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null

    // Headers
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    }

    // Clean URL
    const baseUrl = API_BASE_URL.replace(/\/+$/, "")
    const path = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`

    const url = `${baseUrl}${path}`

    // API Call
    const response = await fetch(url, {
      ...options,
      headers,
    })

    // Unauthorized
    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token")
        window.location.replace("/login")
      }

      throw new Error("Unauthorized access")
    }

    // Check response type
    const contentType = response.headers.get("content-type")

    // If backend returned HTML
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text()

      throw new Error(
        `Expected JSON but received:\n${text}`
      )
    }

    // Parse JSON
    const data = await response.json()

    // Handle API errors
    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      )
    }

    return data
  } catch (error: any) {
    console.error("API FETCH ERROR:", error)

    throw new Error(
      error.message || "Something went wrong"
    )
  }
}
