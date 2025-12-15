"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, User, Settings, LogOut, GraduationCap } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useState } from "react"

interface HeaderProps {
  user?: {
    email?: string
    user_metadata?: {
      first_name?: string
      last_name?: string
      avatar_url?: string
    }
  }
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [notificationCount, setNotificationCount] = useState(2)

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  const firstName = user?.user_metadata?.first_name || ""
  const lastName = user?.user_metadata?.last_name || ""
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U"

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" fillOpacity="0.3" />
                <path
                  d="M2 17L12 22L22 17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 12L12 17L22 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-base sm:text-xl font-bold">The Career Bird</span>
          </Link>

          <nav className="hidden items-center gap-4 sm:gap-6 lg:flex">
            <Link
              href="/scholarships"
              className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
                isActive("/scholarships") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Scholarships
            </Link>
            <Link
              href="/applications"
              className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
                isActive("/applications") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Applications
            </Link>
            <Link
              href="/universities"
              className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
                isActive("/universities") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Universities
            </Link>
            <Link
              href="/professors"
              className={`text-xs sm:text-sm font-medium transition-colors hover:text-primary ${
                isActive("/professors") ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              Professors
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" size="icon" className="relative h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
            {notificationCount > 0 && (
              <span className="absolute right-0.5 top-0.5 sm:right-1 sm:top-1 flex h-3 w-3 sm:h-4 sm:w-4 items-center justify-center rounded-full bg-destructive text-[8px] sm:text-[10px] font-medium text-destructive-foreground">
                {notificationCount}
              </span>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} alt={firstName} />
                  <AvatarFallback className="text-xs sm:text-sm">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-xs sm:text-sm font-medium leading-none">
                  {firstName} {lastName}
                </p>
                <p className="text-[10px] sm:text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile/edit" className="flex w-full cursor-pointer items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/applications" className="flex w-full cursor-pointer items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>My Applications</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex w-full cursor-pointer items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
