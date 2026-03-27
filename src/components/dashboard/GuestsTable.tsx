// src/components/dashboard/GuestsTable.tsx
"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  MoreHorizontal, 
  User, 
  Mail, 
  Phone, 
  IdCard,
  Filter,
  Eraser,
  MapPin,
  Calendar as CalendarIcon
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/ui/TablePagination";
import { TableSortHeader } from "@/components/ui/TableSortHeader";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  const [originFilter, setOriginFilter] = useState("ALL");
  
  // Sorting & Pagination state
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "createdAt",
    direction: "desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isEs = locale === "es";

  const origins = useMemo(() => {
    const orgs = new Set<string>();
    initialData.forEach(g => { if (g.origin) orgs.add(g.origin); });
    return Array.from(orgs);
  }, [initialData]);

  const filteredData = useMemo(() => {
    return initialData.filter((guest) => {
      const matchesSearch = guest.fullName.toLowerCase().includes(search.toLowerCase()) || 
                           guest.email.toLowerCase().includes(search.toLowerCase()) ||
                           (guest.idDocument && guest.idDocument.includes(search));
      
      const matchesOrigin = originFilter === "ALL" || guest.origin === originFilter;
      
      return matchesSearch && matchesOrigin;
    });
  }, [initialData, search, originFilter]);

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA: any, valB: any;

      switch(sort.key) {
        case "fullName": valA = a.fullName; valB = b.fullName; break;
        case "email": valA = a.email; valB = b.email; break;
        case "origin": valA = a.origin || ""; valB = b.origin || ""; break;
        case "createdAt": valA = new Date(a.createdAt).getTime(); valB = new Date(b.createdAt).getTime(); break;
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

  const clearFilters = () => {
    setSearch("");
    setOriginFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none grow flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input 
            placeholder={isEs ? "Buscar por nombre, email o documento..." : "Search by name, email or document..."}
            className="pl-12 h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all shadow-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={originFilter} onValueChange={setOriginFilter}>
            <SelectTrigger className="h-11 w-[180px] rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <SelectValue placeholder={isEs ? "Procedencia" : "Origin"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-lg dark:shadow-none">
              <SelectItem value="ALL" className="text-xs font-bold uppercase tracking-widest">{isEs ? "Todas" : "All"}</SelectItem>
              {origins.map(origin => (
                <SelectItem key={origin} value={origin} className="text-xs font-medium">{origin}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={clearFilters}
            className="h-11 w-11 rounded-xl text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50"
          >
            <Eraser className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30">
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Huésped" : "Guest"} sortKey="fullName" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Email" : "Email"} sortKey="email" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{isEs ? "Documento" : "ID / Passport"}</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Procedencia" : "Origin"} sortKey="origin" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Registrado" : "Joined"} sortKey="createdAt" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">{isEs ? "Acciones" : "Actions"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {paginatedData.map((guest) => (
                <tr key={guest.id} className="hover:bg-brand-blue/5 dark:hover:bg-slate-800/70 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green">
                        <User className="w-4 h-4 text-brand-green" />
                      </div>
                      <p className="text-xs font-bold text-gray-900 dark:text-gray-100">{guest.fullName}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Mail className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      {guest.email}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                      <IdCard className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      {guest.idDocument || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{guest.origin || "—"}</p>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      {new Date(guest.createdAt).toLocaleDateString(locale)}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-slate-800">
                          <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-brand-blue transition-colors" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px] border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none">
                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer text-sm font-medium focus:bg-gray-50 dark:focus:bg-slate-800">{isEs ? 'Ver Reservas' : 'View Stays'}</DropdownMenuItem>
                        <DropdownMenuItem className="rounded-xl py-2 cursor-pointer text-sm font-medium focus:bg-gray-50 dark:focus:bg-slate-800">{isEs ? 'Editar Perfil' : 'Edit Profile'}</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Filter className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                        {isEs ? "No se encontraron huéspedes." : "No guests found."}
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
