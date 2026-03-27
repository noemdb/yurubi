// src/app/[locale]/(admin)/dashboard/resenas/page.tsx
import { prisma } from "@/lib/prisma";
import { ReviewsTable } from "@/components/dashboard/ReviewsTable";

export default async function ResenasAdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isEs = locale === "es";

  // Fetch all reviews
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 mb-2">
          {isEs ? "Moderación de Reseñas" : "Reviews Moderation"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          {isEs 
            ? "Gestiona los testimonios de tus huéspedes. Solo las reseñas aprobadas serán visibles en la página principal." 
            : "Manage guest testimonials. Only approved reviews will be visible on the home page."}
        </p>
      </div>

      <ReviewsTable initialData={reviews} locale={locale} />
    </div>
  );
}
