// src/components/dashboard/GuestsTable.tsx
"use client";

import { useState } from "react";
import { Search, MoreHorizontal, User, Mail, Phone, IdCard } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Guest {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  idDocument: string | null;
  origin: string | null;
  createdAt: Date;
}

export function GuestsTable({ 
  initialData, 
  locale 
}: { 
  initialData: Guest[]; 
  locale: string 
}) {
  const [search, setSearch] = useState("");
  const isEs = locale === "es";

  const filteredData = initialData.filter((guest) => 
    guest.fullName.toLowerCase().includes(search.toLowerCase()) || 
    guest.email.toLowerCase().includes(search.toLowerCase()) ||
    (guest.idDocument && guest.idDocument.includes(search))
  );

  return (
    <div className="space-y-6">
      <div className="flex bg-white p-4 rounded-3xl border border-gray-100 shadow-sm grow">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder={isEs ? "Buscar por nombre, email o documento..." : "Search by name, email or document..."}
            className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="py-5 px-8">Huésped</th>
                <th className="py-5 px-4">Contacto</th>
                <th className="py-5 px-4">{isEs ? "Documento" : "ID / Passport"}</th>
                <th className="py-5 px-4">{isEs ? "Procedencia" : "Origin"}</th>
                <th className="py-5 px-4">{isEs ? "Registrado" : "Joined"}</th>
                <th className="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-green/5 flex items-center justify-center text-brand-green">
                        <User className="w-5 h-5" />
                      </div>
                      <p className="font-bold text-gray-900">{guest.fullName}</p>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {guest.email}
                      </div>
                      {guest.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3 h-3 text-gray-400" />
                          {guest.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <IdCard className="w-4 h-4 text-gray-300" />
                      {guest.idDocument || "—"}
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-sm font-medium text-gray-600">{guest.origin || "—"}</p>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-sm text-gray-500">{new Date(guest.createdAt).toLocaleDateString(locale)}</p>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-xl border border-transparent hover:border-gray-100">
                          <MoreHorizontal className="w-5 h-5 text-gray-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] border-gray-100 shadow-xl">
                        <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">{isEs ? 'Ver Reservas' : 'View Stays'}</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">{isEs ? 'Editar Perfil' : 'Edit Profile'}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center text-gray-400">
                    {isEs ? "No se encontraron huéspedes." : "No guests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
