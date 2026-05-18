"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock, LogIn, ShieldCheck, AlertCircle } from "lucide-react"
import { authService } from "@/lib/api/auth"

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginValues) => {
    try {
      setError(null)
      await authService.login(data)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden font-sans">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-3xl -mr-80 -mt-80" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-100/40 rounded-full blur-3xl -ml-80 -mb-80" />

      <Card className="w-full max-w-md border-gray-200 bg-white text-gray-900 shadow-2xl relative z-10 rounded-3xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-600 to-blue-400 w-full" />
        <CardHeader className="space-y-1 text-center pt-10">
          <CardTitle className="text-4xl font-black tracking-tight text-gray-900">
            Super Admin
          </CardTitle>
          <CardDescription className="text-gray-500 text-lg font-medium">
            System Control Panel
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8 px-10">
          {error && (
            <div className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold text-gray-700 ml-1">
                Admin Username
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <LogIn className="w-4.5 h-4.5" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username"
                  {...register("username")}
                  className={`pl-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 h-14 rounded-2xl transition-all font-medium ${
                    errors.username ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold text-gray-700 ml-1">
                Security Key
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-12 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 h-14 rounded-2xl transition-all font-medium ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-bold">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 bg-gray-900 hover:bg-black text-white font-black rounded-2xl mt-4 shadow-xl transition-all active:scale-[0.98] text-lg tracking-wide"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                "Authorize Access"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="pb-10">
          <p className="text-center w-full text-xs text-gray-400 font-bold uppercase tracking-widest">
            Hotel QR Management System &copy; 2026
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
