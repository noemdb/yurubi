"use client";

import { useState, useEffect } from "react";
import { 
  Hotel, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck 
} from "lucide-react";
import { Link } from "@/routing";
import { cn } from "@/lib/utils";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface AdminSidebarProps {
  navItems: NavItem[];
  roleBadge: string;
  userName: string;
  userRole: string;
  logoutLabel: string;
  onSignOut: () => void;
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ 
  navItems, 
  roleBadge, 
  userName, 
  userRole,
  logoutLabel,
  onSignOut,
  isMobileOpen,
  onClose 
}: AdminSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Load collapse state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved !== null) {
      setIsCollapsed(saved === "true");
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        className={cn(
          "fixed lg:static inset-y-0 left-0 flex flex-col bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-700 shadow-2xl lg:shadow-sm dark:shadow-none transition-all duration-300 z-[100]",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isCollapsed ? "lg:w-[60px]" : "w-64"
        )}
      >
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={toggleSidebar}
          className="hidden lg:block absolute -right-3 top-20 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-full p-1 shadow-md dark:shadow-none hover:bg-gray-50 dark:hover:bg-slate-800/50 z-50 text-gray-500 dark:text-gray-400"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>

      {/* Logo Section */}
      <div className={cn(
        "p-4 flex items-center gap-3 border-b border-gray-50 dark:border-slate-800/50",
        isCollapsed ? "justify-center" : "px-6 py-5"
      )}>
        <div className="bg-brand-blue p-2 rounded-xl shrink-0">
          <Hotel className="w-5 h-5 text-white" />
        </div>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-serif font-bold text-brand-blue leading-none truncate">Río Yurubí</h1>
            <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-1 truncate">{roleBadge}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex items-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-brand-blue/5 hover:text-brand-blue transition-all group font-medium",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-4 py-2"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <span className="shrink-0 group-hover:scale-110 transition-transform">{item.icon}</span>
            {!isCollapsed && <span className="truncate text-sm">{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Role badge (only for non-admin) - Condensed version */}
      {!isCollapsed && userRole !== "ADMIN" && (
        <div className="px-3 pb-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-brand-blue" />
            <span className="text-[10px] font-bold text-brand-blue uppercase">{roleBadge}</span>
          </div>
        </div>
      )}

      {/* Footer / User Profile */}
      <div className={cn(
        "p-4 border-t border-gray-100 dark:border-slate-800 mt-auto",
        isCollapsed ? "items-center" : "px-5"
      )}>
        {/* {!isCollapsed ? (
          <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-lg bg-brand-green flex items-center justify-center text-white font-bold uppercase text-xs shrink-0">
               {userName.charAt(0) || "U"}
             </div>
             <div className="overflow-hidden">
               <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{userName}</p>
               <p className="text-[9px] text-gray-500 dark:text-gray-400 uppercase font-bold">{roleBadge}</p>
             </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-brand-green flex items-center justify-center text-white font-bold uppercase text-xs mx-auto mb-3">
             {userName.charAt(0) || "U"}
          </div>
        )} */}
        
        <form action={onSignOut}>
          <button 
            type="submit"
            className={cn(
              "w-full flex items-center rounded-xl transition-colors font-bold text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10",
              isCollapsed ? "justify-center p-2.5" : "gap-3 px-4 py-2"
            )}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span>{logoutLabel}</span>}
          </button>
        </form>
      </div>
      </aside>
    </>
  );
}
