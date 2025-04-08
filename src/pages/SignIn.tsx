
import { SignIn as ClerkSignIn } from "@clerk/clerk-react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { toast } from "@/components/ui/sonner"

const SignIn = () => {
  const { isSignedIn } = useAuth()
  const [recruiterModalOpen, setRecruiterModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Create form for recruiter login
  const form = useForm({
    defaultValues: {
      username: "",
      password: ""
    }
  })

  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />
  }

  // Handle recruiter login
  const handleRecruiterLogin = (values: { username: string; password: string }) => {
    setIsSubmitting(true)
    
    // Check if credentials match the predefined ones
    if (values.username === "testingversion" && values.password === "98765") {
      // Set session in localStorage to simulate auth
      localStorage.setItem("recruiter-session", "true")
      localStorage.setItem("recruiter-login-time", new Date().toISOString())
      
      // Show success toast and redirect
      toast.success("Welcome! You're signed in as a recruiter")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } else {
      toast.error("Invalid recruiter credentials")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8 flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.75 15.25V6.75H15.25V15.25H6.75Z" fill="#8B5CF6" />
          <path fillRule="evenodd" clipRule="evenodd" d="M3 6.75C3 4.67893 4.67893 3 6.75 3H17.25C19.3211 3 21 4.67893 21 6.75V17.25C21 19.3211 19.3211 21 17.25 21H6.75C4.67893 21 3 19.3211 3 17.25V6.75ZM6.75 4.5C5.50736 4.5 4.5 5.50736 4.5 6.75V17.25C4.5 18.4926 5.50736 19.5 6.75 19.5H17.25C18.4926 19.5 19.5 18.4926 19.5 17.25V6.75C19.5 5.50736 18.4926 4.5 17.25 4.5H6.75Z" fill="#8B5CF6" />
        </svg>
        <span className="font-bold text-2xl bg-clip-text text-transparent bg-hero-gradient">Tidylink</span>
      </div>
      
      <div className="w-full max-w-md">
        <ClerkSignIn appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-md rounded-lg border border-gray-200",
            headerTitle: "text-xl font-semibold",
            headerSubtitle: "text-sm text-gray-500",
            socialButtonsBlockButton: "border border-gray-200 hover:bg-gray-50",
            formButtonPrimary: "bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:opacity-90 transition-opacity",
          }
        }} />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Are you a recruiter?</p>
          <Button 
            variant="outline" 
            onClick={() => setRecruiterModalOpen(true)}
            className="mx-auto"
          >
            Sign in as Recruiter
          </Button>
        </div>
      </div>
      
      {/* Recruiter sign-in modal */}
      <Dialog open={recruiterModalOpen} onOpenChange={setRecruiterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-center">Recruiter Sign In</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleRecruiterLogin)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter recruiter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter recruiter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default SignIn
