// src/app/[locale]/(public)/contacto/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { Location } from "@/components/sections/Location";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="pt-8">
        <Contact />
      </div>
      <Location />
    </div>
  );
}
