"use client";

import { useState, useEffect } from "react";
import { Menu, Users } from "lucide-react";
import { AdminSidebar } from "./AdminSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { cn } from "@/lib/utils";
import { usePathname } from "@/routing";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: any[];
  roleBadge: string;
  userName: string;
  userRole: string;
  logoutLabel: string;
  onSignOut: () => void;
  isEs: boolean;
  locale: string;
}

export function DashboardShell({
  children,
  navItems,
  roleBadge,
  userName,
  userRole,
  logoutLabel,
  onSignOut,
  isEs,
  locale
}: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on path change (navigation)
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-800/50 overflow-hidden font-sans">
      <AdminSidebar 
        navItems={navItems}
        roleBadge={roleBadge}
        userName={userName}
        userRole={userRole}
        logoutLabel={logoutLabel}
        onSignOut={onSignOut}
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm dark:shadow-none">
           <div className="flex items-center gap-4">
             <button 
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg"
             >
               <Menu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
             </button>
             <h2 className="text-lg font-serif font-bold text-gray-900 dark:text-gray-100 lg:hidden">Río Yurubí</h2>
             <div className="hidden lg:flex items-center gap-3">
                <div className="h-8 w-1 bg-brand-blue rounded-full mr-1" />
                <div>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] leading-none mb-1">
                    {isEs ? "Panel de Gestión" : "Management Panel"}
                  </p>
                  <p className="text-sm font-bold text-slate-950 dark:text-slate-50 leading-none">
                    {new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())}
                  </p>
                </div>
             </div>
           </div>
           
           <div className="flex items-center gap-6">
             <ThemeToggle />
             <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-bold text-slate-950 dark:text-slate-50 capitalize">{userName}</span>
               <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">{roleBadge}</span>
             </div>
             <div className="w-10 h-10 rounded-2xl bg-brand-blue/10 dark:bg-brand-blue/20 flex items-center justify-center text-brand-blue border border-brand-blue/5 dark:border-brand-blue/10 shadow-sm dark:shadow-none">
               <Users className="w-5 h-5" />
             </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
