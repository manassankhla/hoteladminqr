"use client"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { User, Lock, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react"
import { hotelService } from "@/lib/api/hotel"

const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type SignupValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupValues) => {
    try {
      setError(null)
      setSuccess(false)
      await hotelService.createHotel(data)
      setSuccess(true)
      reset()
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Subtle Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-3xl -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-3xl -ml-64 -mb-64" />

      <Card className="w-full max-w-md border-gray-200 bg-white text-gray-900 shadow-xl relative z-10 rounded-2xl overflow-hidden">
        <div className="h-2 bg-orange-500 w-full" />
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
              <User className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-gray-900">
            Register Hotel
          </CardTitle>
          <CardDescription className="text-gray-500 text-base">
            Create a new hotel admin account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 px-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-red-600 text-sm animate-in fade-in zoom-in-95">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 flex items-center gap-3 text-green-600 text-sm animate-in fade-in zoom-in-95">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Account created successfully!
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-semibold text-gray-700 ml-1">
                Hotel Username
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="hotel_grand"
                  {...register("username")}
                  className={`pl-11 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 h-12 rounded-xl transition-all ${
                    errors.username ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {errors.username && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.username.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700 ml-1">
                Initial Password
              </Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <Lock className="w-4 h-4" />
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={`pl-11 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 h-12 rounded-xl transition-all ${
                    errors.password ? "border-red-500/50" : ""
                  }`}
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{errors.password.message}</p>}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl mt-4 shadow-lg shadow-orange-200 transition-all active:scale-[0.98] group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  Add Hotel Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pb-10">
          <p className="text-center text-sm text-gray-400 font-medium">
            Automatically assigned <span className="text-orange-500">hotel_admin</span> role.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}