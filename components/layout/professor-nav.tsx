"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GraduationCap,
  FileText,
  User,
  Bell,
  Menu,
  LogOut,
  Settings,
  Briefcase,
  MessageSquare,
  Home,
  Users,
} from "lucide-react"
import { motion } from "framer-motion"
import { signOut } from "@/app/(auth)/logout/actions"

export function ProfessorNav() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      window.location.replace("/login")
    }
  }

  const professorLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/professor/dashboard", label: "Dashboard", icon: GraduationCap },
    { href: "/professor/positions", label: "Open Positions", icon: Briefcase },
    { href: "/professor/interviews", label: "Interviews", icon: Users },
    { href: "/professor/messages", label: "Messages", icon: MessageSquare },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/professor/dashboard" className="flex items-center gap-2 group">
            <div className="h-10 w-10 group-hover:scale-110 transition-transform">
              <Image 
                src="/logo.png" 
                alt="The Career Bird Logo" 
                width={40} 
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                The Career Bird
              </span>
              <p className="text-xs text-muted-foreground">Professor Portal</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {professorLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {active && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-100 dark:bg-blue-950/50 rounded-lg -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative h-10 w-10">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-600" />
            </Button>

            {/* Profile Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="hidden sm:block">
                <button className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center text-white font-semibold shadow-md outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                  <User className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/professor/settings" className="flex items-center w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault()
                    handleSignOut()
                  }}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  {/* Mobile Header */}
                  <div className="border-b pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="font-semibold">Professor Portal</p>
                        <Link
                          href="/professor/settings"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          View Settings
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Navigation Links */}
                  <nav className="flex-1 space-y-1">
                    {professorLinks.map((link) => {
                      const Icon = link.icon
                      const active = isActive(link.href)
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            active
                              ? "bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{link.label}</span>
                        </Link>
                      )
                    })}

                    <div className="my-4 border-t" />

                    {/* Settings */}
                    <Link
                      href="/professor/settings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span>Settings</span>
                    </Link>
                  </nav>

                  {/* Mobile Footer */}
                  <div className="border-t pt-4 space-y-2">
                    <Button
                      variant="ghost"
                      onClick={handleSignOut}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  )
}
