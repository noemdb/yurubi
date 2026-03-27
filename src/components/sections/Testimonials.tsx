// src/components/sections/Testimonials.tsx
import { Star } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export async function Testimonials({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "reviews" });

  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Si no hay reviews aprobadas, ocultar la sección
  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-brand-blue-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-section-title mb-4">
            {t("title")}
          </h2>
          <p className="text-section-subtitle">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white p-8 rounded-2xl shadow-sm border border-brand-blue-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-review-quote mb-6 line-clamp-4 relative">
                <span className="text-4xl text-brand-blue-200 absolute -top-4 -left-2 select-none">
                  "
                </span>
                {review.comment}
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-brand-green-100 rounded-full flex items-center justify-center text-brand-green-700 font-bold font-serif">
                  {review.guestName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-review-author">{review.guestName}</h4>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
