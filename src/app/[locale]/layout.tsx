// src/app/[locale]/layout.tsx
// Next.js 16: params es async — siempre await antes de usar (ADR-008)
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import "../globals.css";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
});


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
    <html lang={locale} className={`${onest.variable}`}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
