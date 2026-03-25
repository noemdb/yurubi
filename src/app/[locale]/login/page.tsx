// src/app/[locale]/login/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Iniciar Sesión | Hotel Río Yurubí",
  description: "Acceso al panel de gestión del Hotel Río Yurubí.",
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function LoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("auth");

  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white">
      {/* Decorative Column (Left) */}
      <div className="relative hidden lg:flex flex-col items-center justify-center bg-[#0a2a1b] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/IMG-20260316-WA0024.jpg"
            alt="Hotel Río Yurubí"
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a2a1b]/90 via-[#0a2a1b]/70 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 text-center px-12">
          <div className="mb-8 inline-block">
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl">
              <Image
                src="/images/logo/logo.jpg"
                alt="Logo Hotel Río Yurubí"
                width={120}
                height={120}
                className="rounded-xl shadow-lg"
                unoptimized
              />
            </div>
          </div>
          <h1 className="text-4xl font-serif font-bold text-white mb-4 tracking-tight">
            Hotel Río Yurubí
          </h1>
          <p className="text-white/80 text-lg font-light max-w-sm mx-auto leading-relaxed">
            Tu refugio natural en el corazón de Yaracuy. Panel de gestión administrativa.
          </p>
        </div>

        {/* Bottom design element */}
        <div className="absolute bottom-12 left-12 right-12 z-10">
          <div className="flex items-center gap-4 text-white/40 text-xs uppercase tracking-[0.2em] font-medium">
            <span className="h-[1px] flex-1 bg-white/20" />
            <span>Panel de Gestión v2.0</span>
            <span className="h-[1px] flex-1 bg-white/20" />
          </div>
        </div>
      </div>

      {/* Login Column (Right) */}
      <div className="flex flex-col items-center justify-center p-8 md:p-12 lg:p-20">
        <div className="w-full max-w-md">
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="lg:hidden text-center mb-12">
            <div className="mb-4 inline-block">
              <Image
                src="/images/logo/logo.jpg"
                alt="Logo Hotel Río Yurubí"
                width={80}
                height={80}
                className="rounded-xl shadow-md border border-gray-100"
                unoptimized
              />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">
              Hotel Río Yurubí
            </h1>
          </div>

          {/* Form Header */}
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              {t("loginTitle")}
            </h2>
            <p className="text-gray-500 font-light">
              {t("loginSubtitle")}
            </p>
          </div>

          <LoginForm locale={locale} />

          {/* Footer */}
          <div className="mt-12 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Hotel Río Yurubí. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </main>
  );
}
