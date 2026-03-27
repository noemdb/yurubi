// src/app/[locale]/(admin)/dashboard/configuracion/page.tsx
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/dashboard/SettingsForm";

export default async function ConfiguracionPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  // Fetch all system settings
  const settings = await prisma.systemSetting.findMany();
  
  // Transform to a usable object for the form
  const initialData = {
    contact: settings.find(s => s.key === "contact_info")?.value || {},
    social: settings.find(s => s.key === "social_links")?.value || {},
    services: settings.find(s => s.key === "service_prices")?.value || {},
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEs ? "Configuración General" : "System Settings"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          {isEs 
            ? "Ajusta la información pública del hotel, enlaces a redes sociales y precios de servicios adicionales." 
            : "Adjust public hotel information, social media links, and additional service prices."}
        </p>
      </div>

      <SettingsForm initialData={initialData} locale={locale} />
    </div>
  );
}
