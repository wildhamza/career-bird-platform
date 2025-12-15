"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MessagesSearchProps {
  onSearchChange: (query: string) => void
}

export function MessagesSearch({ onSearchChange }: MessagesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearchChange(query)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <Input
        placeholder="Search conversations..."
        className="pl-9 w-full rounded-full border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:bg-white dark:focus:bg-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        value={searchQuery}
        onChange={handleChange}
      />
    </div>
  )
}
