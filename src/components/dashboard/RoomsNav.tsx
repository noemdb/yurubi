"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DoorOpen, Tag, List } from "lucide-react";
import { cn } from "@/lib/utils";

export function RoomsNav({ locale }: { locale: string }) {
  const pathname = usePathname();
  const isEs = locale === "es";

  const navItems = [
    {
      name: isEs ? "Inventario Físico" : "Physical Inventory",
      href: `/${locale}/dashboard/habitaciones`,
      icon: DoorOpen,
      active: pathname === `/${locale}/dashboard/habitaciones`
    },
    {
      name: isEs ? "Categorías y Tarifas" : "Categories & Rates",
      href: `/${locale}/dashboard/habitaciones/categorias`,
      icon: Tag,
      active: pathname === `/${locale}/dashboard/habitaciones/categorias`
    },
    {
      name: isEs ? "Amenidades" : "Amenities",
      href: `/${locale}/dashboard/habitaciones/amenidades`,
      icon: List,
      active: pathname === `/${locale}/dashboard/habitaciones/amenidades`
    }
  ];

  return (
    <div className="flex items-center gap-2 bg-gray-100/50 p-1.5 rounded-2xl w-fit border border-gray-100 mb-8">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            item.active 
              ? "bg-white text-brand-blue shadow-sm ring-1 ring-gray-100" 
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          )}
        >
          <item.icon className={cn("w-4 h-4", item.active ? "text-brand-blue" : "text-gray-400")} />
          {item.name}
        </Link>
      ))}
    </div>
  );
}
