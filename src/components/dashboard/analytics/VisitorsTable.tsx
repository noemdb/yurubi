"use client";

import { useState, useMemo } from "react";
import { 
  Search, 
  MapPin, 
  Laptop, 
  Smartphone, 
  Filter, 
  Eraser, 
  ExternalLink,
  Clock,
  Eye,
  Calendar as CalendarIcon
} from "lucide-react";
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

interface VisitorSession {
  id: string;
  country: string | null;
  city: string | null;
  device: string | null;
  browser: string | null;
  os: string | null;
  referrer: string | null;
  isOrganic: boolean;
  pagesViewed: number;
  duration: number;
  firstSeen: Date;
}

export function VisitorsTable({ 
  initialData, 
  locale 
}: { 
  initialData: VisitorSession[]; 
  locale: string 
}) {
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  
  // Sorting & Pagination state
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "firstSeen",
    direction: "desc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const isEs = locale === "es";

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const filteredData = useMemo(() => {
    return initialData.filter((session) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = 
        (session.country && session.country.toLowerCase().includes(searchLower)) || 
        (session.city && session.city.toLowerCase().includes(searchLower)) ||
        (session.referrer && session.referrer.toLowerCase().includes(searchLower));
      
      const matchesDevice = deviceFilter === "ALL" || session.device === deviceFilter;
      
      let matchesType = true;
      if (typeFilter === "ORGANIC") matchesType = session.isOrganic;
      if (typeFilter === "DIRECT") matchesType = !session.referrer;
      if (typeFilter === "REFERRAL") matchesType = !session.isOrganic && !!session.referrer;
      
      return matchesSearch && matchesDevice && matchesType;
    });
  }, [initialData, search, deviceFilter, typeFilter]);

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA: any, valB: any;

      switch(sort.key) {
        case "location": valA = a.country || ""; valB = b.country || ""; break;
        case "device": valA = a.device || ""; valB = b.device || ""; break;
        case "pages": valA = a.pagesViewed; valB = b.pagesViewed; break;
        case "duration": valA = a.duration; valB = b.duration; break;
        case "firstSeen": valA = new Date(a.firstSeen).getTime(); valB = new Date(b.firstSeen).getTime(); break;
        default: valA = a.firstSeen; valB = b.firstSeen;
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
    setDeviceFilter("ALL");
    setTypeFilter("ALL");
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none grow flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
          <Input 
            placeholder={isEs ? "Buscar por país, ciudad o referrer..." : "Search by country, city or referrer..."}
            className="pl-12 h-11 rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all shadow-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select value={deviceFilter} onValueChange={setDeviceFilter}>
            <SelectTrigger className="h-11 w-[140px] rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 gap-2">
              <SelectValue placeholder={isEs ? "Dispositivo" : "Device"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-lg dark:shadow-none">
              <SelectItem value="ALL" className="text-xs font-bold uppercase tracking-widest">{isEs ? "Todos" : "All"}</SelectItem>
              <SelectItem value="desktop" className="text-xs font-medium">Desktop</SelectItem>
              <SelectItem value="mobile" className="text-xs font-medium">Mobile</SelectItem>
              <SelectItem value="tablet" className="text-xs font-medium">Tablet</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="h-11 w-[140px] rounded-xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 px-4 text-xs font-bold text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 gap-2">
              <SelectValue placeholder={isEs ? "Tráfico" : "Traffic"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-slate-800 shadow-lg dark:shadow-none">
              <SelectItem value="ALL" className="text-xs font-bold uppercase tracking-widest">{isEs ? "Todos" : "All"}</SelectItem>
              <SelectItem value="ORGANIC" className="text-xs font-medium">{isEs ? "Orgánico" : "Organic"}</SelectItem>
              <SelectItem value="DIRECT" className="text-xs font-medium">{isEs ? "Directo" : "Direct"}</SelectItem>
              <SelectItem value="REFERRAL" className="text-xs font-medium">{isEs ? "Referido" : "Referral"}</SelectItem>
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

      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden flex flex-col min-h-[400px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/30">
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Fecha / Hora" : "Date / Time"} sortKey="firstSeen" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Ubicación" : "Location"} sortKey="location" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  <TableSortHeader label={isEs ? "Dispositivo" : "Device"} sortKey="device" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Fuente</th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
                  <TableSortHeader label={isEs ? "Páginas" : "Pages"} sortKey="pages" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="px-6 py-3.5 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-right">
                  <TableSortHeader label={isEs ? "Tiempo" : "Duration"} sortKey="duration" currentSort={sort} onSort={handleSort} />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {paginatedData.map((session) => (
                <tr key={session.id} className="hover:bg-brand-blue/5 dark:hover:bg-slate-800/70 transition-colors group">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-900 dark:text-gray-100">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                      {new Date(session.firstSeen).toLocaleString(locale, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                      <MapPin className="w-3.5 h-3.5 text-brand-blue" />
                      {session.country ? `${session.city || '?'}, ${session.country}` : "Desconocido"}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {session.device === 'mobile' ? <Smartphone className="w-3.5 h-3.5 text-purple-500" /> 
                      : <Laptop className="w-3.5 h-3.5 text-gray-400" />}
                      {session.device || "desktop"}
                      <span className="text-gray-400 text-[10px]">({session.browser || "?"})</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      {session.isOrganic ? (
                        <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Orgánico</span>
                      ) : session.referrer ? (
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <ExternalLink className="w-3 h-3" /> {new URL(session.referrer).hostname.replace('www.', '')}
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Directo</span>
                      )}
                    </p>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-brand-blue font-bold">
                      <Eye className="w-3.5 h-3.5" />
                      {session.pagesViewed}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-gray-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDuration(session.duration)}
                    </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Filter className="w-10 h-10 text-gray-100 mx-auto mb-2" />
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">
                        {isEs ? "No se encontraron sesiones analíticas." : "No analytic sessions found."}
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
