"use client";

import React, { useEffect, useState } from "react";
import { Command } from "cmdk";
import { Search, FileText, User, ArrowRight, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Toggle with Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm transition-all">
      <Command className="w-full max-w-2xl bg-[#0B0F19] border border-white/10 rounded-xl shadow-2xl overflow-hidden font-sans text-white animate-in fade-in zoom-in-95 duration-100">
        
        {/* Search Input */}
        <div className="flex items-center border-b border-white/10 px-4">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <Command.Input 
            placeholder="Type a command or search grants..." 
            className="w-full bg-transparent py-4 text-lg outline-none placeholder:text-gray-600 text-white"
          />
          <div className="flex gap-1">
             <span className="text-xs bg-white/10 px-1.5 py-0.5 rounded text-gray-400">ESC</span>
          </div>
        </div>

        {/* Results List */}
        <Command.List className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
          <Command.Empty className="py-6 text-center text-gray-500 text-sm">
            No results found.
          </Command.Empty>

          <Command.Group heading="Suggested Grants" className="text-xs text-gray-500 font-medium mb-2 px-2 mt-2">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/grants/1'))}>
              <FileText className="w-4 h-4 mr-2 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-sm text-white">Deep Learning for MRI Analysis</span>
                <span className="text-xs text-gray-500">TUM Munich • €1.5M Funding</span>
              </div>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/grants/2'))}>
              <FileText className="w-4 h-4 mr-2 text-cyan-400" />
              <div className="flex flex-col">
                <span className="text-sm text-white">Generative AI for Climate</span>
                <span className="text-xs text-gray-500">Oxford University • £45k/yr</span>
              </div>
            </CommandItem>
          </Command.Group>

          <Command.Separator className="h-[1px] bg-white/10 my-2" />

          <Command.Group heading="Navigation" className="text-xs text-gray-500 font-medium mb-2 px-2">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/student'))}>
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Battle Station
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard/profile'))}>
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </CommandItem>
          </Command.Group>

        </Command.List>
      </Command>
    </div>
  );
}

// Wrapper for Consistent Styling
function CommandItem({ children, onSelect }: { children: React.ReactNode; onSelect: () => void }) {
  return (
    <Command.Item 
      onSelect={onSelect}
      className="flex items-center px-3 py-3 rounded-lg cursor-pointer transition-colors hover:bg-white/5 aria-selected:bg-cyan-500/10 aria-selected:text-cyan-400"
    >
      {children}
    </Command.Item>
  );
}

