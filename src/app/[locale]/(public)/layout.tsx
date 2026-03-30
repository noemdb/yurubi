// src/app/[locale]/(public)/layout.tsx
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

import { VisitorTracker } from "@/components/analytics/VisitorTracker";

interface PublicLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function PublicLayout({
  children,
  params,
}: PublicLayoutProps) {
  const { locale } = await params;

  return (
    <div className="flex flex-col min-h-screen">
      <VisitorTracker />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
