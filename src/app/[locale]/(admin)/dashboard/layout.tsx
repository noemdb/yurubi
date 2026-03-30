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
  Building,
  BookOpen,
  Activity
} from "lucide-react";
import { auth, signOut } from "@/auth";
import { redirect } from "@/routing";
import { getTranslations } from "next-intl/server";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { DashboardShell } from "@/components/layout/DashboardShell";

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
    { icon: <Activity className="w-5 h-5" />, label: isEs ? "Visitantes" : "Visitors", path: "/dashboard/visitantes" },
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
    { icon: <BookOpen className="w-5 h-5" />, label: isEs ? "Manual de Usuario" : "User Manual", path: "/dashboard/admin/manual" },
  ];

  const receptionistNav = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: isEs ? "Inicio" : "Home", path: "/dashboard/recepcionista" },
    { icon: <CalendarCheck className="w-5 h-5" />, label: isEs ? "Reservas" : "Reservations", path: "/dashboard/recepcionista/reservas" },
    { icon: <PlusCircle className="w-5 h-5" />, label: isEs ? "Nueva Reserva" : "New Booking", path: "/dashboard/recepcionista/nueva-reserva" },
    { icon: <Users className="w-5 h-5" />, label: isEs ? "Huéspedes" : "Guests", path: "/dashboard/huespedes" },
    { icon: <LayoutGrid className="w-5 h-5" />, label: isEs ? "Estado Habitaciones" : "Room Status", path: "/dashboard/recepcionista/habitaciones" },
    { icon: <Calendar className="w-5 h-5" />, label: isEs ? "Calendario" : "Calendar", path: "/dashboard/calendario" },
    { icon: <BookOpen className="w-5 h-5" />, label: isEs ? "Manual de Usuario" : "User Manual", path: "/dashboard/recepcionista/manual" },
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
    <DashboardShell
      navItems={navItems}
      roleBadge={roleBadge}
      userName={session.user?.name || "User"}
      userRole={role}
      logoutLabel={t("logout")}
      onSignOut={handleSignOut}
      isEs={isEs}
      locale={locale}
    >
      {children}
    </DashboardShell>
  );
}
