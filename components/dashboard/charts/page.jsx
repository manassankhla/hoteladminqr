"use client"

import * as React from "react"
import Image from "next/image"
import { 
  Area, 
  AreaChart, 
  Bar,
  BarChart,
  ResponsiveContainer, 
  Tooltip, 
  XAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

// Mock trend data based on the real value
const generateChartData = (baseValue, type) => {
  const numericValue = typeof baseValue === 'string' 
    ? parseFloat(baseValue.replace(/[₹, %]/g, '')) 
    : baseValue;

  if (type === "pie") {
    if (!numericValue) return [{ name: "No Data", value: 1, color: "#e5e7eb" }];
    return [
      { name: "Confirmed", value: numericValue * 0.7, color: "#f97316" },
      { name: "Pending", value: numericValue * 0.2, color: "#fb923c" },
      { name: "Advance", value: numericValue * 0.1, color: "#fdba74" },
    ]
  }

  // Only show the current month
  const currentMonth = new Date().toLocaleString('default', { month: 'short' });
  return [{
    name: currentMonth,
    value: numericValue || 0,
  }]
}

export default function DrawerChart({ className, title, description, value, unit, type = "area", image }) {
  const chartData = React.useMemo(() => generateChartData(value || 0, type), [value, type])

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className={`relative overflow-hidden p-0 border border-orange-500/20 rounded-none shadow-sm ${className} group h-full w-full cursor-pointer bg-white`}
        >
          {image && (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105 z-0"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}
          {/* Solid Orange Tint Overlay */}
          <div className={`absolute inset-0 z-10 transition-colors pointer-events-none ${image ? 'bg-orange-500/70' : 'bg-orange-600'} group-hover:bg-orange-600/80`} />

          {/* CONTENT */}
          <div className="flex h-full w-full flex-col justify-center p-8 text-left items-start relative z-20">
            <p className="text-white/90 text-sm font-bold uppercase tracking-widest mb-2 drop-shadow-sm">
              {title}
            </p>
            <h1 className="text-5xl font-black text-white mb-2 tracking-tighter drop-shadow-sm">
              {value || 0}
            </h1>
            <p className="text-white/90 font-medium line-clamp-2 text-sm whitespace-normal drop-shadow-sm">
              {description}
            </p>
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white border-none !rounded-none h-auto max-h-[90vh] overflow-hidden">
        <div className="mx-auto w-full max-w-xl">
          <DrawerHeader className="pt-4 pb-0">
            <div className="flex flex-col items-center">
               <div className="w-10 h-1 bg-gray-100 rounded-full mb-3" />
               <DrawerTitle className="text-xl font-black text-center mb-0 tracking-tight">{title}</DrawerTitle>
               <DrawerDescription className="text-center text-xs font-medium text-gray-400">{description}</DrawerDescription>
            </div>
          </DrawerHeader>
          
          <div className="px-6 py-4">
            <div className="flex flex-col items-center justify-center space-y-0 mb-4">
              <div className="text-5xl font-black tracking-tighter text-gray-900 leading-none">
                {value || 0}
              </div>
              <div className="text-[9px] text-orange-500 font-black uppercase tracking-[0.2em] mt-1">
                Real-time {unit || "Metrics"}
              </div>
            </div>

            <div className="h-[200px] w-full bg-orange-500/5 rounded-none p-3 border border-orange-500/20 backdrop-blur-md shadow-inner">
              <ResponsiveContainer width="100%" height="100%">
                {type === "pie" ? (
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={800}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px' }}
                    />
                  </PieChart>
                ) : (
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" strokeOpacity={0.4} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 700}}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 'bold', fontSize: '10px' }}
                      cursor={{ fill: 'transparent' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#f97316" 
                      radius={[4, 4, 0, 0]}
                      barSize={60}
                      animationDuration={800}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          <DrawerFooter className="pb-6 pt-0 px-6">
            <DrawerClose asChild>
              <Button className="h-10 rounded-none bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-95">
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}




