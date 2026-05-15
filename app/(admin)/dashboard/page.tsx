"use client"

import React, { useEffect, useState } from "react"
import { hotelService } from "@/lib/api/hotel"
import DrawerChart from "@/components/dashboard/charts/page"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      const data = await hotelService.getStats()
      setStats(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="p-6 md:p-10 space-y-10 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2 font-medium">Global platform analytics and performance.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={fetchStats}
          className="rounded-sm h-12 px-6 bg-white border-gray-200 shadow-sm hover:bg-gray-50 font-bold"
        >
          <RefreshCw className={`w-4.5 h-4.5 text-gray-500 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Sync Data
        </Button>
      </div>

      

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 ml-1">Core Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: 'Total Hotels', description: 'Active properties registered', value: stats?.totalHotels, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', shadow: 'shadow-blue-100/20' },
            { title: 'Total Bookings', description: 'Reservations processed', value: stats?.totalBookings, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800', shadow: 'shadow-green-100/20' },
            { title: 'Total Guests', description: 'Customers served', value: stats?.totalGuests, image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&q=80&w=800', shadow: 'shadow-purple-100/20' }
          ].map((card, i) => (
            <div key={i} className={`relative overflow-hidden h-32 rounded-sm border ${card.shadow} group shadow-xl`}>
              {/* BACKGROUND IMAGE */}
              <img
                src={card.image}
                alt={card.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* OVERLAY */}
              <div className="absolute inset-0 bg-orange-500/70" />
              {/* CONTENT */}
              <div className="relative z-10 flex h-full w-full flex-col justify-center p-8 text-left">
                <p className="text-white/70 text-sm font-bold uppercase tracking-widest mb-1">
                  {card.title}
                </p>
                <h1 className="text-2xl font-black text-white">
                  {loading && !stats ? "..." : (card.value || 0)}
                </h1>
                <p className="text-white/80 font-medium">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900 ml-1">Graphical Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              title: "Revenue Analysis",
              description: "Monthly platform revenue overview",
              value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : "₹0",
              unit: "Revenue",
              image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
              type: "pie"
            },
            {
              title: "Guest Engagement",
              description: "Total guests reached across all properties",
              value: stats?.totalGuests || 0,
              unit: "Guests",
              image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800"
            }
          ].map((insight, i) => (
            <DrawerChart
              key={i}
              className="h-64 shadow-xl shadow-orange-100/20"
              title={insight.title}
              description={insight.description}
              value={insight.value}
              unit={insight.unit}
              image={insight.image}
              type={insight.type}
            />
          ))}
        </div>
      </div>
    </div>

  )
}
