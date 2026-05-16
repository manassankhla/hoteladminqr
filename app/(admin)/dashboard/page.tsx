"use client"

import React from "react"
import useSWR from "swr"
import { hotelService } from "@/lib/api/hotel"
import DrawerChart from "@/components/dashboard/charts/page"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const { data: stats, error, isLoading, isValidating, mutate } = useSWR('admin_stats', hotelService.getStats)

  if (error) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Failed to load statistics</h2>
        <p className="text-gray-500 text-center max-w-md">{error.message || "An error occurred while fetching the dashboard data."}</p>
        <Button onClick={() => mutate()} variant="outline">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 h-[calc(100vh-2rem)] overflow-hidden flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Global platform analytics and performance.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => mutate()}
          disabled={isValidating}
          className="rounded-sm h-10 px-6 bg-white border-gray-200 shadow-sm hover:bg-gray-50 font-bold"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 mr-2 ${isValidating ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>

      <div className="space-y-4 shrink-0">
        <h2 className="text-lg font-bold text-gray-900 ml-1">Core Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Total Hotels', description: 'Active properties registered', value: stats?.totalHotels },
            { title: 'Total Bookings', description: 'Reservations processed', value: stats?.totalBookings },
            { title: 'Total Guests', description: 'Customers served', value: stats?.totalGuests }
          ].map((card, i) => (
            <div key={i} className="relative overflow-hidden h-28 rounded-sm border border-gray-200 shadow-sm bg-white p-5 flex flex-col justify-center">
              <p className="text-gray-500 text-[11px] font-bold uppercase tracking-widest mb-1">
                {card.title}
              </p>
              <h1 className="text-2xl font-black text-gray-900 mb-1">
                {isLoading ? "..." : (card.value || 0)}
              </h1>
              <p className="text-gray-400 font-medium text-xs">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 flex-1 min-h-0 flex flex-col">
        <h2 className="text-lg font-bold text-gray-900 ml-1 shrink-0">Graphical Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
          {[
            {
              title: "Revenue Analysis",
              description: "Monthly platform revenue overview",
              value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0",
              unit: "Revenue",
              type: "pie"
            },
            {
              title: "Guest Engagement",
              description: "Total guests reached across all properties",
              value: stats?.totalGuests || 0,
              unit: "Guests",
            }
          ].map((insight, i) => (
            <DrawerChart
              key={i}
              className="h-full w-full min-h-[160px]"
              title={insight.title}
              description={insight.description}
              value={insight.value}
              unit={insight.unit}
              type={insight.type}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

