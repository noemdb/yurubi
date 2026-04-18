// src/app/[locale]/(public)/reservar/page.tsx
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { BookingWizard } from "@/components/booking/BookingWizard";

interface PageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ roomType?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "booking" });
  return { title: `Reservar | Hotel Río Yurubí` };
}

export default async function BookingPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { roomType } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <BookingWizard locale={locale} initialRoomType={roomType} />
      </div>
    </div>
  );
}
