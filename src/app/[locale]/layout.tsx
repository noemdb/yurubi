// src/app/[locale]/layout.tsx
// Next.js 16: params es async — siempre await antes de usar (ADR-008)
import type { Metadata } from "next";
import { carlito } from "@/app/fonts";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Hotel Río Yurubí | San Felipe, Yaracuy",
    template: "%s | Hotel Río Yurubí",
  },
  description:
    "Hotel frente al Parque Nacional Yurubí. Habitaciones cómodas, restaurante, piscina y sala de reuniones en San Felipe, Yaracuy, Venezuela.",
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale); // Next.js 15+ Requirement
  
  const messages = await getMessages();

  return (
    <html 
      lang={locale} 
      className={carlito.variable} 
      suppressHydrationWarning
    >
      <body suppressHydrationWarning className="font-sans antialiased bg-white dark:bg-gray-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
