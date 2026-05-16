"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { hotelService } from "@/lib/api/hotel"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Hotel, 
  ChevronRight, 
  RefreshCw, 
  Calendar, 
  Users, 
  ArrowLeft,
  Loader2,
  ExternalLink,
  MapPin,
  Clock,
  TrendingUp
} from "lucide-react"
import { format } from "date-fns"

export default function HotelsPage() {
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const router = useRouter()

  const fetchHotels = async (pageNum = 1, append = false) => {
    try {
      if (append) setLoadingMore(true); else setLoading(true);
      
      const data = await hotelService.getHotels(pageNum, 10)
      
      // Since backend now returns { hotels, pagination }
      const newHotels = data.hotels || []
      const pagination = data.pagination || {}
      
      setHotels(prev => append ? [...prev, ...newHotels] : newHotels)
      setHasMore(pageNum < pagination.pages)
      setPage(pageNum)
    } catch (err) {
      console.error("Failed to fetch hotels:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchHotels(1, false)
  }, [])

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      fetchHotels(page + 1, true)
    }
  }

  const filteredHotels = hotels.filter(h => 
    h.username.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            <div className="p-2 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Hotel className="w-8 h-8 text-orange-500" />
            </div>
            Hotels
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Manage and view details of your registered properties.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-4.5 w-4.5" />
            <Input
              placeholder="Filter properties..."
              className="pl-11 bg-white border-gray-200 h-12 rounded-2xl shadow-sm focus:ring-orange-500/10 focus:border-orange-500 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => fetchHotels(1, false)}
            className={`rounded-2xl h-12 w-12 bg-white border-gray-200 shadow-sm hover:bg-gray-50 ${loading ? 'opacity-50' : ''}`}
          >
            <RefreshCw className={`w-4.5 h-4.5 text-gray-500 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white rounded-sm mb-10">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow className="hover:bg-transparent border-gray-100 h-14">
              <TableHead className="w-[120px] font-bold text-gray-400 uppercase text-[10px] tracking-widest pl-8">ID Hash</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Property Name</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Account Tier</TableHead>
              <TableHead className="font-bold text-gray-400 uppercase text-[10px] tracking-widest">Registration</TableHead>
              <TableHead className="text-right font-bold text-gray-400 uppercase text-[10px] tracking-widest pr-8">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse h-20 border-gray-50">
                  <TableCell colSpan={5} className="px-8"><div className="h-4 bg-gray-100 rounded w-full" /></TableCell>
                </TableRow>
              ))
            ) : filteredHotels.length > 0 ? (
              <>
                {filteredHotels.map((hotel) => (
                  <TableRow 
                    key={hotel._id} 
                    onClick={() => router.push(`/hotels/${hotel._id}`)}
                    className="group hover:bg-orange-50/30 transition-all border-gray-50 cursor-pointer h-20"
                  >
                    <TableCell className="font-mono text-[10px] text-gray-400 pl-8">
                      #{hotel._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shadow-inner">
                          {hotel.username.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-800 text-base group-hover:text-orange-600 transition-colors">{hotel.username}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
                        {hotel.role.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500 font-semibold text-sm">
                      {hotel.createdAt ? format(new Date(hotel.createdAt), 'MMM dd, yyyy') : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                
                {hasMore && (
                  <TableRow className="hover:bg-transparent border-none">
                    <TableCell colSpan={5} className="p-8 text-center">
                      <Button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        variant="outline"
                        className="h-12 px-10 rounded-2xl border-orange-200 text-orange-600 hover:bg-orange-50 font-bold transition-all shadow-sm"
                      >
                        {loadingMore ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading More...
                          </div>
                        ) : (
                          "Load More Properties"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-60 text-center text-gray-400">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Hotel className="w-12 h-12 text-gray-100" />
                    <p className="font-bold">No Properties Found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

