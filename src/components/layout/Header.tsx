// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/routing";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/utils";
import Image from "next/image";


export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t("home"), href: "/" },
    { name: t("rooms"), href: "/habitaciones" },
    { name: t("restaurant"), href: "/restaurante" },
    { name: t("pool"), href: "/piscina" },
    { name: t("meetingRoom"), href: "/sala-de-reuniones" },
    { name: t("gallery"), href: "/galeria" },
    { name: t("contact"), href: "/contacto" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative w-12 h-12 overflow-hidden rounded-xl border border-gray-700 shadow-2xl">
                <Image 
                  src="/images/logo/logo.jpg" 
                  alt="Hotel Río Yurubí Logo" 
                  fill 
                  className="object-cover"
                  unoptimized
                  sizes="48px"
                />


              </div>

              <span className="font-serif text-xl font-bold text-gray-900 tracking-tight group-hover:text-brand-green transition-colors">
                Hotel Río Yurubí
              </span>
            </Link>
          </div>


          {/* Desktop Nav */}
          <nav className="hidden lg:flex md:gap-x-8 items-center">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-brand-blue",
                  pathname === item.href
                    ? "text-brand-blue font-semibold"
                    : "text-gray-600"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions (Language + Booking CTA) */}
          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher />
            <Button asChild className="bg-brand-green hover:bg-brand-green-600 rounded-full px-6">

              <Link href="/reservar">{t("bookNow")}</Link>
            </Button>
            <Button asChild variant="ghost" className="text-gray-500 hidden xl:flex">
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-brand-blue focus:outline-none"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white shadow-lg border-b border-gray-100 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "bg-brand-blue/5 text-brand-blue"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-blue"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
              <Button asChild className="w-full bg-brand-green hover:bg-brand-green-600">
                <Link href="/reservar" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("bookNow")}
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("login")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
