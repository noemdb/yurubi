// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, locale = "es"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale === "es" ? "es-VE" : "en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatPrice(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculateReservationPrice(
  basePrice: number,
  checkIn: Date,
  checkOut: Date
): { nights: number; total: number } {
  const ms = checkOut.getTime() - checkIn.getTime();
  const nights = Math.ceil(ms / (1000 * 60 * 60 * 24));
  return { nights, total: basePrice * nights };
}

export function truncateId(id: string): string {
  return id.slice(-8).toUpperCase();
}
