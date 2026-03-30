// src/app/[locale]/(public)/nosotros/page.tsx
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { AboutSection } from "@/components/sections/AboutSection";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { 
    title: `${t("title")} | Hotel Río Yurubí`, 
    description: t("description") 
  };
}

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="min-h-screen">
      <AboutSection locale={locale} />
    </main>
  );
}
