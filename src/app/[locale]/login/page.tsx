// src/app/[locale]/login/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 font-serif">
            Hotel Río Yurubí
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Panel de Gestión</p>
        </div>
        {/* LoginForm se implementa en Fase 3 */}
        <p className="text-center text-gray-400 text-sm">
          Formulario de login — Fase 3
        </p>
      </div>
    </main>
  );
}
