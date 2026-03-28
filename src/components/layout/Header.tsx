// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/routing";
import { Menu, X, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
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
    // { name: t("contact"), href: "/contacto" },
  ];

  const handleWhatsApp = () => {
    window.open("https://wa.me/584267224991", "_blank");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 group"
            >
              <span className="font-serif text-xl font-bold text-gray-900 dark:text-gray-50 tracking-tight group-hover:text-brand-green transition-colors">
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
                    : "text-gray-600 dark:text-gray-300"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions (Language + Booking CTA) */}
          <div className="hidden lg:flex items-center gap-4">
            <ThemeToggle />
            <LanguageSwitcher />
            <Button 
              className="bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full px-6 gap-2"
              onClick={handleWhatsApp}
            >
              <MessageSquare className="h-4 w-4 fill-white/20" />
              {t("whatsapp")}
            </Button>
            <Button asChild variant="ghost" className="text-gray-500 hidden xl:flex">
              <Link href="/login">{t("login")}</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-4">
            <ThemeToggle />
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
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-950 shadow-lg border-b border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-2">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-3 rounded-md text-base font-medium",
                  pathname === item.href
                    ? "bg-brand-blue/5 text-brand-blue dark:bg-brand-blue/10"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 hover:text-brand-blue dark:hover:text-brand-blue"
                )}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">

                {/* <Link href="/reservar" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("bookNow")}
                </Link> */}
                
              <Button 
                className="w-full bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-full h-12 gap-2"
                onClick={() => {
                  handleWhatsApp();
                  setIsMobileMenuOpen(false);
                }}
              >
                <MessageSquare className="h-4 w-4 fill-white/20" />
                {t("whatsapp")}
              </Button>
              <Button asChild variant="outline" className="w-full rounded-full h-12">
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
