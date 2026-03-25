// src/app/[locale]/(admin)/dashboard/layout.tsx
import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Users, 
  Calendar,
  Settings, 
  LogOut, 
  Key, 
  Tags, 
  MessageSquare,
  Hotel,
  Bed,
  List,
  PlusCircle,
  BarChart2,
  ScrollText,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { Link, redirect } from "@/routing";
import { getTranslations } from "next-intl/server";
import { getRoleHomeUrl } from "@/lib/rbac";

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
    { icon: <Calendar className="w-5 h-5" />, label: isEs ? "Calendario" : "Calendar", path: "/dashboard/calendario" },
    { icon: <CalendarCheck className="w-5 h-5" />, label: t("reservations"), path: "/dashboard/reservas" },
    { icon: <Users className="w-5 h-5" />, label: t("guests"), path: "/dashboard/huespedes" },
    { icon: <Key className="w-5 h-5" />, label: t("rooms"), path: "/dashboard/habitaciones" },
    { icon: <Bed className="w-5 h-5" />, label: isEs ? "Categorías" : "Categories & Rates", path: "/dashboard/habitaciones/categorias" },
    { icon: <List className="w-5 h-5" />, label: isEs ? "Amenidades" : "Amenities", path: "/dashboard/habitaciones/amenidades" },
    { icon: <Tags className="w-5 h-5" />, label: t("promotions"), path: "/dashboard/promociones" },
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

  const roleHome = getRoleHomeUrl(role, locale);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-8 flex items-center gap-3 border-b border-gray-50">
          <div className="bg-brand-blue p-2 rounded-xl">
            <Hotel className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-brand-blue leading-none">Río Yurubí</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{roleBadge}</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className="flex items-center gap-4 px-4 py-3 rounded-2xl text-gray-500 hover:bg-brand-blue/5 hover:text-brand-blue transition-all group font-medium"
            >
              <span className="group-hover:scale-110 transition-transform">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Role badge - only for non-admin */}
        {role !== "ADMIN" && (
          <div className="px-4 pb-2">
            <div className="flex items-center gap-2 px-4 py-2 bg-brand-blue/5 rounded-2xl">
              <ShieldCheck className="w-4 h-4 text-brand-blue" />
              <span className="text-xs font-bold text-brand-blue">{roleBadge}</span>
            </div>
          </div>
        )}

        <div className="p-6 mt-auto border-t border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-brand-green flex items-center justify-center text-white font-bold uppercase">
               {session.user?.name?.charAt(0) || "U"}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-bold text-gray-900 truncate">{session.user?.name}</p>
               <p className="text-[10px] text-gray-500 uppercase font-bold">{roleBadge}</p>
             </div>
          </div>
          
          <form action={async () => { "use server"; await signOut(); }}>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors font-bold text-sm">
              <LogOut className="w-5 h-5" />
              {t("logout")}
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-8 flex items-center justify-between sticky top-0 z-20">
           <h2 className="text-xl font-serif font-bold text-gray-900 md:hidden">Río Yurubí</h2>
           <div className="flex-1" />
           {/* Notificaciones, idioma, etc. en el futuro */}
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}
