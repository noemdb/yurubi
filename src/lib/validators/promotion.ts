// src/lib/validators/promotion.ts
import { z } from "zod";

export const promotionSchema = z
  .object({
    title: z.string().min(3).max(100),
    titleEn: z.string().max(100).optional(),
    description: z.string().min(10).max(2000),
    descriptionEn: z.string().max(2000).optional(),
    discountType: z.enum(["PERCENT", "FIXED"]),
    value: z.number().positive(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    conditions: z.string().max(1000).optional(),
    conditionsEn: z.string().max(1000).optional(),
    imageUrl: z.string().url().optional(),
    isActive: z.boolean().default(true),
    applicableRoomIds: z
      .array(z.string().cuid())
      .min(1, "Selecciona al menos un tipo"),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "Fecha fin debe ser después de fecha inicio",
    path: ["endDate"],
  });

export type PromotionInput = z.infer<typeof promotionSchema>;
