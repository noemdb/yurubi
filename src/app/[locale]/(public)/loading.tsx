// src/app/[locale]/(public)/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 text-brand-blue">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="font-serif text-lg font-medium animate-pulse">Cargando...</p>
      </div>
    </div>
  );
}
