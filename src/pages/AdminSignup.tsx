"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "@/lib/next-router-compat"
import { useAuth } from "@/src/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Droplet, Loader2, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { z } from "zod"

const VERIFICATION_CODE = "NBNA"

const adminSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  verificationCode: z.string().refine((val) => val === VERIFICATION_CODE, {
    message: "Invalid verification code",
  }),
})

const AdminSignup: React.FC = () => {
  const { signUp, user, role } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [verificationCode, setVerificationCode] = useState("")

  useEffect(() => {
    if (user && role) {
      navigate("/dashboard")
    }
  }, [user, role, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const validation = adminSignupSchema.safeParse({
        email,
        password,
        fullName,
        verificationCode,
      })

      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const { error } = await signUp(email, password, fullName, "admin")

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please login instead.",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          })
        }
        setIsLoading(false)
        return
      }

      // Wait for user to be created then add admin role
      const {
        data: { user: newUser },
      } = await supabase.auth.getUser()

      if (newUser) {
        await supabase.from("user_roles").insert({
          user_id: newUser.id,
          role: "admin",
        })

        toast({
          title: "Admin Account Created",
          description: "Welcome! You have been registered as an administrator.",
        })

        navigate("/dashboard")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Droplet className="h-8 w-8 text-primary-foreground" />
          </div>
          <Link to="/">
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">Blood Bond</h1>
            <p className="text-sm text-muted-foreground">Admin Registration</p>
          </div>
          </Link>
        </div>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-heading">Add New Admin</CardTitle>
            <CardDescription>Enter the verification code to register as an administrator</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  type="password"
                  placeholder="Enter code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Admin...
                  </>
                ) : (
                  "Create Admin Account"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Already an admin?{" "}
            <Button variant="link" className="p-0" onClick={() => navigate("/auth")}>
              Go to login
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminSignup
