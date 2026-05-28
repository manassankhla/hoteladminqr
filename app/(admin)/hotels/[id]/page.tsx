"use client"

import React from "react"
import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { hotelService } from "@/lib/api/hotel"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { 
  Hotel, 
  Calendar, 
  Users, 
  ArrowLeft,
  MapPin,
  Clock,
  TrendingUp,
  AlertCircle,
  CreditCard,
  CheckCircle2,
  XCircle,
  IndianRupee,
  CalendarDays
} from "lucide-react"
import { format } from "date-fns"

import { Skeleton } from "@/components/ui/skeleton"

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
    success: {
      color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      icon: <CheckCircle2 size={12} />,
      label: "Success",
    },
    failed: {
      color: "bg-red-50 text-red-700 border border-red-200",
      icon: <XCircle size={12} />,
      label: "Failed",
    },
    cancelled: {
      color: "bg-gray-100 text-gray-600 border border-gray-200",
      icon: <Clock size={12} />,
      label: "Cancelled",
    },
  }
  const s = map[status] || map.cancelled
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.color}`}>
      {s.icon}
      {s.label}
    </span>
  )
}

function SourceBadge({ source }: { source: string }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
        source === "webhook"
          ? "bg-blue-50 text-blue-700 border border-blue-200"
          : "bg-orange-50 text-orange-700 border border-orange-200"
      }`}
    >
      {source === "webhook" ? "Auto" : "Manual"}
    </span>
  )
}

export default function HotelDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  
  const { data: hotelStats, error, isLoading } = useSWR(
    id ? `hotel_stats_${id}` : null, 
    () => hotelService.getHotelStats(id as string)
  )

  const { data: transactionData, isLoading: isTxLoading } = useSWR(
    id ? `hotel_tx_${id}` : null,
    () => hotelService.getHotelTransactions(id as string)
  )

  const transactions = transactionData?.transactions || []
  const hotelInfo = hotelStats?.hotelInfo

  if (isLoading) {
    return (
      <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-start gap-5">
            <Skeleton className="h-10 w-10 rounded-sm" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-sm" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="lg:col-span-2 h-[400px] rounded-sm" />
          <Skeleton className="h-[400px] rounded-sm" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold text-gray-900">Failed to load hotel details</h1>
        <p className="text-gray-500">{error.message || "An error occurred."}</p>
        <Button onClick={() => router.push('/hotels')}>Back to List</Button>
      </div>
    )
  }

  if (!hotelInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">Hotel Not Found</h1>
        <Button onClick={() => router.push('/hotels')}>Back to List</Button>
      </div>
    )
  }

  const { overview = {}, inventory = {}, trends = {} } = hotelStats || {}

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-start gap-5">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.push('/hotels')}
            className="rounded-sm h-10 w-10 bg-white shadow-sm border-gray-200"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="px-2 py-0.5 rounded-sm bg-orange-100 text-orange-600 text-[9px] font-black uppercase tracking-wider">
                {hotelInfo?.role?.replace('_', ' ') || 'Hotel Partner'}
              </span>
              <span className="text-gray-400 text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded-sm">ID: {hotelInfo?._id}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight text-gray-900">{hotelInfo?.username}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-500 text-sm font-medium">
              <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-gray-400" /> Main Property</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-gray-400" /> Joined {hotelInfo?.createdAt ? format(new Date(hotelInfo.createdAt), 'MMM yyyy') : 'Recently'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: `₹${overview.totalRevenue?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Total Guests', value: overview.totalGuests || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Bookings', value: overview.totalBookings || 0, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Inventory', value: `${inventory.totalRooms || 0} Rooms`, icon: Hotel, color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-sm flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-sm bg-white rounded-sm overflow-hidden">
              <CardHeader className="p-8 pb-0">
                <CardTitle className="text-2xl font-black">Financial Overview</CardTitle>
                <CardDescription>Breakdown of payments and receivables</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-6 bg-red-50 rounded-sm border border-red-100/50">
                    <p className="text-red-400 text-xs font-bold uppercase mb-1">Total Pending</p>
                    <p className="text-3xl font-black text-red-600">₹{overview.totalPending?.toLocaleString() || 0}</p>
                  </div>
                  <div className="p-6 bg-blue-50 rounded-sm border border-blue-100/50">
                    <p className="text-blue-400 text-xs font-bold uppercase mb-1">Advance Received</p>
                    <p className="text-3xl font-black text-blue-600">₹{overview.totalAdvance?.toLocaleString() || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-white rounded-sm overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl font-black">Monthly Performance</CardTitle>
                <CardDescription>Last 6 months activity</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="space-y-4">
                  {trends.monthly?.length > 0 ? trends.monthly.map((m: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-5 bg-gray-50 rounded-sm group hover:bg-orange-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-sm flex items-center justify-center font-black text-orange-500 shadow-sm border border-gray-100">
                          {m._id?.month}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">{format(new Date(m._id.year, m._id.month - 1), 'MMMM yyyy')}</p>
                          <p className="text-xs text-gray-400 font-bold uppercase">{m.bookings} Bookings • {m.guests} Guests</p>
                        </div>
                      </div>
                      <p className="text-xl font-black text-gray-900">₹{m.revenue?.toLocaleString() || 0}</p>
                    </div>
                  )) : (
                    <p className="text-center py-10 text-gray-400 font-medium italic">No historical trend data available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-sm bg-gray-900 text-white rounded-sm overflow-hidden">
              <CardHeader className="p-8">
                <CardTitle className="text-xl font-black">Booking Distribution</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8 space-y-6">
                {[
                  { label: 'Confirmed', value: overview.confirmedBookings || 0, color: 'bg-green-500' },
                  { label: 'Quotations', value: overview.quotationsCount || 0, color: 'bg-blue-500' },
                  { label: 'Cancelled', value: overview.cancelledBookings || 0, color: 'bg-red-500' },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm font-bold">
                      <span className="text-gray-400">{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${item.color}`} 
                        style={{ width: `${(item.value / (overview.totalBookings || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <h4 className="font-black text-gray-900 mb-6 text-xl">Property Scale</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-gray-50 rounded-sm border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Rooms</p>
                  <p className="text-2xl font-black text-gray-900">{inventory.totalRooms || 0}</p>
                </div>
                <div className="p-5 bg-gray-50 rounded-sm border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Categories</p>
                  <p className="text-2xl font-black text-gray-900">{inventory.totalCategories || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription & Transaction History Section */}
        <div className="space-y-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-gray-900">Subscription & Payments</h3>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-sm text-xs font-bold uppercase tracking-wider ${
                hotelInfo?.subscriptionStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 
                hotelInfo?.subscriptionStatus === 'trial' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
              }`}>
                {hotelInfo?.subscriptionStatus || 'Unknown'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CreditCard className="text-orange-500 w-5 h-5" />
                <p className="text-sm font-bold text-gray-500">Plan Status</p>
              </div>
              <p className="text-lg font-black text-gray-900 capitalize">{hotelInfo?.subscriptionStatus || "—"}</p>
              {hotelInfo?.razorpaySubscriptionId && (
                <p className="text-xs text-gray-400 font-mono mt-1">{hotelInfo.razorpaySubscriptionId}</p>
              )}
            </div>
            
            <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <CalendarDays className="text-blue-500 w-5 h-5" />
                <p className="text-sm font-bold text-gray-500">Start Date</p>
              </div>
              <p className="text-lg font-black text-gray-900">
                {hotelInfo?.subscriptionStartDate 
                  ? format(new Date(hotelInfo.subscriptionStartDate), "dd MMM yyyy") 
                  : "—"}
              </p>
            </div>

            <div className="bg-white p-5 rounded-sm border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-red-500 w-5 h-5" />
                <p className="text-sm font-bold text-gray-500">Trial / Expiry</p>
              </div>
              <p className="text-lg font-black text-gray-900">
                {hotelInfo?.trialEndDate 
                  ? format(new Date(hotelInfo.trialEndDate), "dd MMM yyyy") 
                  : "—"}
              </p>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Transaction ID</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Plan / Event</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Source</th>
                    <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isTxLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <tr key={i} className="border-b border-gray-50">
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400 font-medium">
                        No transactions found for this hotel.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t: any) => (
                      <tr key={t._id} className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-mono text-xs text-gray-700 truncate max-w-[160px]">
                            {t.razorpayPaymentId || "—"}
                          </p>
                          <p className="font-mono text-[10px] text-gray-400 truncate max-w-[160px]">
                            {t.razorpaySubscriptionId || ""}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs text-gray-600 font-medium">
                            {t.event?.replace("subscription.", "").replace(".", " ") || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-black text-base ${t.status === "success" ? "text-emerald-600" : "text-gray-400"}`}>
                            {t.amountINR > 0 ? `₹${t.amountINR.toLocaleString("en-IN")}` : <span className="text-gray-300 text-sm font-medium">₹0</span>}
                          </span>
                          <p className="text-[10px] text-gray-400">{t.currency}</p>
                        </td>
                        <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                        <td className="px-4 py-3"><SourceBadge source={t.source} /></td>
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {t.chargedAt ? new Date(t.chargedAt).toLocaleString("en-IN", {
                            day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                          }) : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
