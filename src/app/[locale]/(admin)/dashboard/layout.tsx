// src/app/[locale]/(admin)/dashboard/layout.tsx
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Calendar,
  Settings, 
  Key, 
  Tags, 
  MessageSquare,
  Bed,
  List,
  PlusCircle,
  BarChart2,
  ScrollText,
  LayoutGrid,
  Menu,
  Building
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { redirect } from "@/routing";
import { getTranslations } from "next-intl/server";
import { getRoleHomeUrl } from "@/lib/rbac";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations({ locale, namespace: "dashboard" });

  const isEs = locale === "es";

  if (!session) {
    redirect({ href: "/login", locale });
    return null;
  }

  const role = session.user?.role ?? "RECEPTIONIST";

  // ─── Nav items por rol ────────────────────────────────────────
  const adminNav = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: t("title"), path: "/dashboard" },
    { icon: <BarChart2 className="w-5 h-5" />, label: isEs ? "Reportes" : "Reports", path: "/dashboard/reportes" },
    { icon: <Calendar className="w-5 h-5" />, label: isEs ? "Calendario" : "Calendar", path: "/dashboard/calendario" },
    { icon: <CalendarCheck className="w-5 h-5" />, label: t("reservations"), path: "/dashboard/reservas" },
    { icon: <Users className="w-5 h-5" />, label: isEs ? "Gestión de Usuarios" : "User Management", path: "/dashboard/users" },
    { icon: <Building className="w-5 h-5" />, label: t("guests"), path: "/dashboard/huespedes" },
    { icon: <Key className="w-5 h-5" />, label: t("rooms"), path: "/dashboard/habitaciones" },
    { icon: <Bed className="w-5 h-5" />, label: isEs ? "Categorías" : "Categories & Rates", path: "/dashboard/habitaciones/categorias" },
    { icon: <List className="w-5 h-5" />, label: isEs ? "Amenidades" : "Amenities", path: "/dashboard/habitaciones/amenidades" },
    { icon: <Tags className="w-5 h-5" />, label: t("promotions"), path: "/dashboard/promociones" },
    { icon: <ScrollText className="w-5 h-5" />, label: isEs ? "Bitácora" : "Audit Log", path: "/dashboard/bitacora" },
    { icon: <MessageSquare className="w-5 h-5" />, label: t("reviews"), path: "/dashboard/resenas" },
    { icon: <Settings className="w-5 h-5" />, label: t("settings"), path: "/dashboard/configuracion" },
  ];

  const receptionistNav = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: isEs ? "Inicio" : "Home", path: "/dashboard/recepcionista" },
    { icon: <CalendarCheck className="w-5 h-5" />, label: isEs ? "Reservas" : "Reservations", path: "/dashboard/recepcionista/reservas" },
    { icon: <PlusCircle className="w-5 h-5" />, label: isEs ? "Nueva Reserva" : "New Booking", path: "/dashboard/recepcionista/nueva-reserva" },
    { icon: <Users className="w-5 h-5" />, label: isEs ? "Huéspedes" : "Guests", path: "/dashboard/huespedes" },
    { icon: <LayoutGrid className="w-5 h-5" />, label: isEs ? "Estado Habitaciones" : "Room Status", path: "/dashboard/recepcionista/habitaciones" },
    { icon: <Calendar className="w-5 h-5" />, label: isEs ? "Calendario" : "Calendar", path: "/dashboard/calendario" },
  ];

  const ownerNav = [
    { icon: <BarChart2 className="w-5 h-5" />, label: isEs ? "Reportes" : "Reports", path: "/dashboard/reportes" },
    { icon: <CalendarCheck className="w-5 h-5" />, label: isEs ? "Reservas" : "Reservations", path: "/dashboard/reservas" },
    { icon: <Users className="w-5 h-5" />, label: isEs ? "Huéspedes" : "Guests", path: "/dashboard/huespedes" },
    { icon: <ScrollText className="w-5 h-5" />, label: isEs ? "Bitácora" : "Audit Log", path: "/dashboard/bitacora" },
  ];

  const navItems = role === "RECEPTIONIST" ? receptionistNav
    : role === "OWNER" ? ownerNav
    : adminNav;

  const roleBadge = role === "RECEPTIONIST" ? (isEs ? "Recepcionista" : "Receptionist")
    : role === "OWNER" ? (isEs ? "Propietario" : "Owner")
    : "Admin";

  const handleSignOut = async () => {
    "use server";
    await signOut();
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-800/50 overflow-hidden font-sans">
      <AdminSidebar 
        navItems={navItems}
        roleBadge={roleBadge}
        userName={session.user?.name || "User"}
        userRole={role}
        logoutLabel={t("logout")}
        onSignOut={handleSignOut}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm dark:shadow-none">
           <div className="flex items-center gap-4">
             <button className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg">
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
               <span className="text-xs font-bold text-slate-950 dark:text-slate-50 capitalize">{session.user?.name}</span>
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
