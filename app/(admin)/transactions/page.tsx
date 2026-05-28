"use client"

import React, { useState } from "react"
import useSWR from "swr"
import { hotelService } from "@/lib/api/hotel"
import {
  AlertCircle,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const LIMIT = 20

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

export default function TransactionsPage() {
  const [page, setPage] = useState(1)

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    ["admin_transactions", page],
    () => hotelService.getTransactions(page, LIMIT),
    { keepPreviousData: true }
  )

  const transactions = data?.transactions || []
  const totalPages   = data?.totalPages   || 1
  const total        = data?.total        || 0

  // Total revenue from current data (all pages from API)
  const pageRevenue = transactions
    .filter((t: any) => t.status === "success")
    .reduce((sum: number, t: any) => sum + (t.amountINR || 0), 0)

  if (error) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-900">Failed to load transactions</h2>
        <p className="text-gray-500 text-center max-w-md">
          {error.message || "An error occurred while fetching transactions."}
        </p>
        <Button onClick={() => mutate()} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Transactions</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">
            All payment history — {total} total records
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => mutate()}
          disabled={isValidating}
          className="h-10 px-6 bg-white border-gray-200 hover:bg-gray-50 font-bold rounded-none"
        >
          <RefreshCw className={`w-4 h-4 text-gray-500 mr-2 ${isValidating ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Records",
            value: total,
            icon: <CreditCard size={18} className="text-orange-500" />,
            bg: "bg-orange-500/5 border-orange-500/20",
          },
          {
            label: "Page Revenue",
            value: `₹${pageRevenue.toLocaleString("en-IN")}`,
            icon: <IndianRupee size={18} className="text-emerald-600" />,
            bg: "bg-emerald-500/5 border-emerald-500/20",
          },
          {
            label: "Successful",
            value: transactions.filter((t: any) => t.status === "success").length,
            icon: <CheckCircle2 size={18} className="text-emerald-600" />,
            bg: "bg-emerald-500/5 border-emerald-500/20",
          },
          {
            label: "Failed",
            value: transactions.filter((t: any) => t.status === "failed").length,
            icon: <XCircle size={18} className="text-red-500" />,
            bg: "bg-red-500/5 border-red-500/20",
          },
        ].map((card, i) => (
          <div
            key={i}
            className={`relative rounded-none border p-4 flex items-center gap-3 shadow-sm ${card.bg}`}
          >
            <div>{card.icon}</div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{card.label}</p>
              <p className="text-xl font-black text-gray-900">{isLoading ? "..." : card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden rounded-none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">#</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Hotel / User</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Transaction ID</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Plan</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Amount</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 font-bold text-gray-500 text-[11px] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-16 text-center text-gray-400 font-medium">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions.map((t: any, i: number) => {
                  const date = t.chargedAt
                    ? new Date(t.chargedAt).toLocaleString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"

                  const rowNum = (page - 1) * LIMIT + i + 1

                  return (
                    <tr
                      key={t._id}
                      className="border-b border-gray-50 hover:bg-orange-50/40 transition-colors"
                    >
                      {/* Row number */}
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{rowNum}</td>

                      {/* Hotel / User */}
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900 truncate max-w-[140px]">{t.userName}</p>
                        {t.referBy && t.referBy !== "—" && (
                          <p className="text-[10px] text-gray-400 mt-0.5">Ref: {t.referBy}</p>
                        )}
                      </td>

                      {/* Transaction ID */}
                      <td className="px-4 py-3">
                        <p className="font-mono text-xs text-gray-700 truncate max-w-[160px]">
                          {t.razorpayPaymentId || "—"}
                        </p>
                        <p className="font-mono text-[10px] text-gray-400 truncate max-w-[160px]">
                          {t.razorpaySubscriptionId || ""}
                        </p>
                      </td>

                      {/* Plan (event name) */}
                      <td className="px-4 py-3">
                        <span className="text-xs text-gray-600 font-medium">
                          {t.event?.replace("subscription.", "").replace(".", " ") || "—"}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-4 py-3">
                        <span
                          className={`font-black text-base ${
                            t.status === "success" ? "text-emerald-600" : "text-gray-400"
                          }`}
                        >
                          {t.amountINR > 0
                            ? `₹${t.amountINR.toLocaleString("en-IN")}`
                            : <span className="text-gray-300 text-sm font-medium">₹0</span>
                          }
                        </span>
                        <p className="text-[10px] text-gray-400">{t.currency}</p>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={t.status} />
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3">
                        <SourceBadge source={t.source} />
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{date}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50">
            <p className="text-xs text-gray-500 font-medium">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="h-8 px-3 rounded-none"
              >
                <ChevronLeft size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || isLoading}
                className="h-8 px-3 rounded-none"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
