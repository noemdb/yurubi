// src/components/dashboard/ReservationsTable.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  CheckCircle, 
  XCircle,
  Calendar as CalendarIcon,
  Eraser
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
import { TablePagination } from "@/components/ui/TablePagination";
import { TableSortHeader } from "@/components/ui/TableSortHeader";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns/format";
import { es, enUS } from "date-fns/locale";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
    id: string;
    name: string;
  };
  roomId: string | null;
  room?: {
    roomNumber: string;
  };
}

type Decimal = { toNumber(): number };

export function ReservationsTable({ 
  initialData, 
  locale,
  readOnly = false,
  initialStatus = "ALL"
}: { 
  initialData: any[]; 
  locale: string;
  readOnly?: boolean;
  initialStatus?: string;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [roomFilter, setRoomFilter] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  // Sorting & Pagination state
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "createdAt",
    direction: "desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const isEs = locale === "es";
  const dateLocale = isEs ? es : enUS;

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

  const categories = useMemo(() => {
    const cats = new Set<string>();
    initialData.forEach(res => cats.add(res.roomType.name));
    return Array.from(cats);
  }, [initialData]);

  const filteredData = useMemo(() => {
    return initialData.filter((res) => {
      const matchesSearch = res.guest.fullName.toLowerCase().includes(search.toLowerCase()) || 
                           res.id.toLowerCase().includes(search.toLowerCase()) ||
                           res.guest.email.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
      const matchesCategory = categoryFilter === "ALL" || res.roomType.name === categoryFilter;
      const matchesRoom = !roomFilter || (res.room?.roomNumber?.toLowerCase().includes(roomFilter.toLowerCase()));
      
      const resDate = new Date(res.checkIn);
      const matchesDateFrom = !dateRange.from || resDate >= dateRange.from;
      const matchesDateTo = !dateRange.to || resDate <= dateRange.to;

      return matchesSearch && matchesStatus && matchesCategory && matchesRoom && matchesDateFrom && matchesDateTo;
    });
  }, [initialData, search, statusFilter, categoryFilter, roomFilter, dateRange]);

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA: any, valB: any;

      switch(sort.key) {
        case "guest": valA = a.guest.fullName; valB = b.guest.fullName; break;
        case "roomType": valA = a.roomType.name; valB = b.roomType.name; break;
        case "stay": valA = new Date(a.checkIn).getTime(); valB = new Date(b.checkIn).getTime(); break;
        case "total": valA = typeof a.totalPrice === 'number' ? a.totalPrice : a.totalPrice.toNumber(); 
                     valB = typeof b.totalPrice === 'number' ? b.totalPrice : b.totalPrice.toNumber(); break;
        case "status": valA = a.status; valB = b.status; break;
        default: valA = a.createdAt; valB = b.createdAt;
      }

      if (valA < valB) return sort.direction === "asc" ? -1 : 1;
      if (valA > valB) return sort.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sort]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    setSort(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase h-fit">Confirmada</span>;
      case "PENDING":
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase h-fit">Pendiente</span>;
      case "REJECTED":
      case "CANCELLED":
        return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase h-fit">Cancelada</span>;
      default:
        return <span className="bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-[10px] font-bold uppercase h-fit">{status}</span>;
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setCategoryFilter("ALL");
    setRoomFilter("");
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <div className="space-y-6">
      {/* Advanced Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder={isEs ? "Búsqueda rápida por nombre, email o ID..." : "Quick search by name, email or ID..."}
              className="pl-12 h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all shadow-none text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            {/* Date Range Picker */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 gap-2 hover:bg-white dark:hover:bg-slate-900">
                  <CalendarIcon className="w-4 h-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd", { locale: dateLocale })} - {" "}
                        {format(dateRange.to, "LLL dd", { locale: dateLocale })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd", { locale: dateLocale })
                    )
                  ) : (
                    <span>{isEs ? "Rango de fechas" : "Date range"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                  numberOfMonths={2}
                  locale={dateLocale}
                />
              </PopoverContent>
            </Popover>

            {/* Category Select */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-11 w-[160px] rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900">
                <SelectValue placeholder={isEs ? "Categoría" : "Category"} />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-lg dark:shadow-none">
                <SelectItem value="ALL" className="text-xs font-bold uppercase tracking-widest">{isEs ? "Todas" : "All"}</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-xs font-medium">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Room Filter */}
            <div className="relative w-[100px]">
              <Input
                placeholder={isEs ? "Hab." : "Room"}
                className="h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-none"
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
              />
            </div>

            {/* Status Tabs */}
            <div className="flex bg-gray-50 dark:bg-slate-800/50 p-1 rounded-xl border border-gray-100 dark:border-slate-800 h-11 items-center">
              {["ALL", "PENDING", "CONFIRMED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase tracking-widest ${
                    statusFilter === status
                      ? "bg-white dark:bg-slate-900 text-brand-blue shadow-sm dark:shadow-none"
                      : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                  }`}
                >
                  {status === "ALL" ? (isEs ? "Todos" : "All") : status}
                </button>
              ))}
            </div>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearFilters}
              className="h-11 w-11 rounded-xl text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50"
              title={isEs ? "Limpiar filtros" : "Clear filters"}
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-50 dark:border-slate-800/50 text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/30">
                <th className="py-4 px-8">
                  <TableSortHeader label="Huésped" sortKey="guest" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-4 px-4">
                  <TableSortHeader label={isEs ? "Categoría" : "Category"} sortKey="roomType" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-4 px-4">
                  <TableSortHeader label="Estadía" sortKey="stay" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-4 px-4">
                  <TableSortHeader label="Total" sortKey="total" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-4 px-4 text-center">
                  <TableSortHeader label="Estado" sortKey="status" currentSort={sort} onSort={handleSort} className="justify-center" />
                </th>
                {!readOnly && <th className="py-4 px-8 text-right text-[10px] font-bold uppercase tracking-widest">{isEs ? "Acciones" : "Actions"}</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginatedData.map((res) => (
                <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center text-brand-blue font-bold text-[10px]">
                        #{res.id.slice(-4).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-tight">{res.guest.fullName}</p>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">{res.guest.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{res.roomType.name}</p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100">
                      {new Date(res.checkIn).toLocaleDateString(locale, { day: '2-digit', month: 'short' })} - {new Date(res.checkOut).toLocaleDateString(locale, { day: '2-digit', month: 'short' })}
                    </p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase mt-0.5">
                      {Math.ceil((new Date(res.checkOut).getTime() - new Date(res.checkIn).getTime()) / (1000 * 60 * 60 * 24))} {isEs ? 'Noches' : 'Nights'}
                    </p>
                  </td>
                  <td className="py-5 px-4">
                    <p className="text-xs font-bold text-brand-green">
                      {formatPrice(typeof res.totalPrice === 'number' ? res.totalPrice : res.totalPrice.toNumber())}
                    </p>
                  </td>
                  <td className="py-5 px-4 text-center">
                    {isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto text-brand-blue" />
                    ) : (
                      getStatusBadge(res.status)
                    )}
                  </td>
                  {!readOnly && (
                  <td className="py-5 px-8 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild disabled={isPending}>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-white dark:hover:bg-slate-900 hover:shadow-sm border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
                          <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-brand-blue transition-colors" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[200px] border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none">
                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer focus:bg-brand-blue/5 group" asChild>
                           <Link href={`/dashboard/reservas/${res.id}`} className="flex items-center w-full">
                             <Eye className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-brand-blue" />
                             <span className="text-sm font-medium">{isEs ? 'Ver Detalles' : 'View Details'}</span>
                           </Link>
                        </DropdownMenuItem>
                        
                        {res.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem 
                              className="rounded-xl py-2 cursor-pointer focus:bg-green-50 group"
                              onClick={() => handleAction(res.id, confirmReservation)}
                            >
                              <CheckCircle className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-green-600" />
                              <span className="text-sm font-medium text-green-600">{isEs ? 'Confirmar Pago' : 'Confirm Payment'}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="rounded-xl py-2 cursor-pointer focus:bg-red-50 group"
                              onClick={() => handleAction(res.id, rejectReservation)}
                            >
                              <XCircle className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-red-600" />
                              <span className="text-sm font-medium text-red-600">{isEs ? 'Rechazar Reserva' : 'Reject Booking'}</span>
                            </DropdownMenuItem>
                          </>
                        )}

                        {res.status === 'CONFIRMED' && (
                          <DropdownMenuItem 
                            className="rounded-xl py-2 cursor-pointer focus:bg-red-50 group"
                            onClick={() => handleAction(res.id, cancelReservation)}
                          >
                            <XCircle className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500 group-hover:text-red-600" />
                            <span className="text-sm font-medium text-red-600">{isEs ? 'Cancelar Reserva' : 'Cancel Booking'}</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                  )}
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={readOnly ? 5 : 6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Filter className="w-10 h-10 text-gray-100" />
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                        {isEs ? "No se encontraron reservas." : "No reservations found."}
                      </p>
                      <Button variant="link" size="sm" onClick={clearFilters} className="text-brand-blue font-bold uppercase text-[10px]">
                        {isEs ? "Limpiar filtros" : "Clear filters"}
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <TablePagination 
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={sortedData.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }}
          locale={locale}
        />
      </div>
    </div>
  );
}
