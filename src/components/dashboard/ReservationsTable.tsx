// src/components/dashboard/ReservationsTable.tsx
"use client";

import { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock 
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/routing";
import { useTransition } from "react";
import { confirmReservation, rejectReservation, cancelReservation } from "@/lib/actions/reservations";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Reservation {
  id: string;
  status: string;
  totalPrice: number | Decimal;
  checkIn: Date;
  checkOut: Date;
  guest: {
    fullName: string;
    email: string;
  };
  roomType: {
    name: string;
  };
}

type Decimal = { toNumber(): number };

export function ReservationsTable({ 
  initialData, 
  locale 
}: { 
  initialData: any[]; 
  locale: string 
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEs = locale === "es";

  const handleAction = (id: string, action: any) => {
    startTransition(async () => {
      try {
        await action(id);
        toast({ title: isEs ? "Reserva actualizada" : "Reservation updated" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const filteredData = initialData.filter((res) => {
    const matchesSearch = res.guest.fullName.toLowerCase().includes(search.toLowerCase()) || 
                         res.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">Confirmada</span>;
      case "PENDING":
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">Pendiente</span>;
      case "REJECTED":
      case "CANCELLED":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">Cancelada</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder={isEs ? "Buscar por nombre o ID..." : "Search by name or ID..."}
            className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all shadow-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
            {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === status 
                    ? "bg-white text-brand-blue shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {status === "ALL" ? (isEs ? "Todos" : "All") : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="py-5 px-8">ID / {isEs ? "Huésped" : "Guest"}</th>
                <th className="py-5 px-4">{isEs ? "Tipo Habitación" : "Room Type"}</th>
                <th className="py-5 px-4">{isEs ? "Estadía" : "Stay"}</th>
                <th className="py-5 px-4">Total</th>
                <th className="py-5 px-4 text-center">Estado</th>
                <th className="py-5 px-8 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredData.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue font-bold text-xs">
                        #{res.id.slice(-4).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 leading-tight">{res.guest.fullName}</p>
                        <p className="text-xs text-gray-400 mt-1">{res.guest.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-sm font-medium text-gray-600">{res.roomType.name}</p>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-sm font-bold text-gray-900">
                      {new Date(res.checkIn).toLocaleDateString(locale, { day: '2-digit', month: 'short' })} - {new Date(res.checkOut).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                      {Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24))} {isEs ? 'Noches' : 'Nights'}
                    </p>
                  </td>
                  <td className="py-6 px-4">
                    <p className="text-md font-bold text-brand-green">
                      {formatPrice(typeof res.totalPrice === 'number' ? res.totalPrice : res.totalPrice.toNumber())}
                    </p>
                  </td>
                  <td className="py-6 px-4 text-center">
                    {isPending ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto text-brand-blue" />
                    ) : (
                      getStatusBadge(res.status)
                    )}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={isPending}>
                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100">
                          <MoreHorizontal className="w-5 h-5 text-gray-400 group-hover:text-brand-blue transition-colors" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px] border-gray-100 shadow-xl">
                        <DropdownMenuItem className="rounded-xl py-3 cursor-pointer focus:bg-brand-blue/5 group" asChild>
                           <Link href={`/dashboard/reservas/${res.id}`} className="flex items-center w-full">
                             <Eye className="w-4 h-4 mr-3 text-gray-400 group-hover:text-brand-blue" />
                             <span className="font-medium">{isEs ? 'Ver Detalles' : 'View Details'}</span>
                           </Link>
                        </DropdownMenuItem>
                        
                        {res.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem 
                              className="rounded-xl py-3 cursor-pointer focus:bg-green-50 group"
                              onClick={() => handleAction(res.id, confirmReservation)}
                            >
                              <CheckCircle className="w-4 h-4 mr-3 text-gray-400 group-hover:text-green-600" />
                              <span className="font-medium text-green-600">{isEs ? 'Confirmar Pago' : 'Confirm Payment'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl py-3 cursor-pointer focus:bg-red-50 group"
                              onClick={() => handleAction(res.id, rejectReservation)}
                            >
                              <XCircle className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600" />
                              <span className="font-medium text-red-600">{isEs ? 'Rechazar Reserva' : 'Reject Booking'}</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {res.status === 'CONFIRMED' && (
                          <DropdownMenuItem 
                            className="rounded-xl py-3 cursor-pointer focus:bg-red-50 group"
                            onClick={() => handleAction(res.id, cancelReservation)}
                          >
                            <XCircle className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-600" />
                            <span className="font-medium text-red-600">{isEs ? 'Cancelar Reserva' : 'Cancel Booking'}</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <Search className="w-12 h-12 text-gray-100" />
                        <p className="text-gray-400 font-medium">
                          {isEs ? "No se encontraron reservas con esos criterios." : "No reservations found with those criteria."}
                        </p>
                      </div>
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
