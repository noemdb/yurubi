"use client";

import { useState, useTransition, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit2, 
  Loader2, 
  Eraser,
  DoorOpen,
  Layers,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  toggleRoomStatus, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} from "@/lib/actions/rooms";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TablePagination } from "@/components/ui/TablePagination";
import { TableSortHeader } from "@/components/ui/TableSortHeader";

export function RoomsTable({ 
  roomTypes, 
  locale 
}: { 
  roomTypes: any[]; 
  locale: string 
}) {
  const { toast } = useToast();
  const isEs = locale === "es";
  const [isPending, startTransition] = useTransition();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Sorting & Pagination state
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" | null }>({
    key: "roomNumber",
    direction: "asc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // CRUD Dialog State
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: "",
    floor: 1,
    roomTypeId: ""
  });

  // Delete Confirmation State
  const [roomToDelete, setRoomToDelete] = useState<any>(null);

  const rooms = useMemo(() => {
    return roomTypes
      .flatMap(type => type.rooms.map((r: any) => ({ ...r, typeName: type.name })));
  }, [roomTypes]);

  const filteredData = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "ALL" || room.roomTypeId === typeFilter;
      const matchesStatus = statusFilter === "ALL" || (statusFilter === "AVAILABLE" ? room.isAvailable : !room.isAvailable);
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [rooms, searchQuery, typeFilter, statusFilter]);

  const sortedData = useMemo(() => {
    if (!sort.key || !sort.direction) return filteredData;

    return [...filteredData].sort((a, b) => {
      let valA: any, valB: any;

      switch(sort.key) {
        case "roomNumber": valA = a.roomNumber; valB = b.roomNumber; break;
        case "floor": valA = a.floor || 1; valB = b.floor || 1; break;
        case "typeName": valA = a.typeName; valB = b.typeName; break;
        case "isAvailable": valA = a.isAvailable ? 1 : 0; valB = b.isAvailable ? 1 : 0; break;
        default: valA = a.roomNumber; valB = b.roomNumber;
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

  const handleToggle = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleRoomStatus(id, currentStatus);
        toast({ title: isEs ? "Estado actualizado" : "Status updated" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleSaveRoom = async () => {
    if (!roomFormData.roomNumber || !roomFormData.roomTypeId) {
      toast({ title: isEs ? "Campos obligatorios" : "Required fields", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        if (editingRoom) {
          await updateRoom(editingRoom.id, roomFormData);
          toast({ title: isEs ? "Habitación actualizada" : "Room updated" });
        } else {
          await createRoom(roomFormData);
          toast({ title: isEs ? "Habitación creada" : "Room created" });
        }
        setIsRoomDialogOpen(false);
        setEditingRoom(null);
        setRoomFormData({ roomNumber: "", floor: 1, roomTypeId: "" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;
    startTransition(async () => {
      try {
        await deleteRoom(roomToDelete.id);
        toast({ title: isEs ? "Habitación eliminada" : "Room deleted" });
        setRoomToDelete(null);
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-4 justify-between bg-white dark:bg-slate-900 px-8 py-5 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none grow">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input 
              placeholder={isEs ? "Número de habitación..." : "Room number..."}
              className="pl-12 h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all shadow-none text-sm font-bold"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px] h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 px-5">
                <SelectValue placeholder={isEs ? "Categoría" : "Category"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none p-2">
                <SelectItem value="ALL" className="text-[10px] font-bold uppercase tracking-widest">{isEs ? "Todas" : "All"}</SelectItem>
                {roomTypes.map(type => (
                  <SelectItem key={type.id} value={type.id} className="text-xs font-bold rounded-lg">{type.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-12 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-slate-900 px-5">
                <SelectValue placeholder={isEs ? "Estado" : "Status"} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-gray-100 dark:border-slate-800 shadow-xl dark:shadow-none p-2">
                <SelectItem value="ALL" className="text-[10px] font-bold uppercase tracking-widest">{isEs ? "Todos" : "All"}</SelectItem>
                <SelectItem value="AVAILABLE" className="text-xs font-bold rounded-lg">{isEs ? "Disponibles" : "Available"}</SelectItem>
                <SelectItem value="OCCUPIED" className="text-xs font-bold rounded-lg">{isEs ? "No Disponibles" : "Not Available"}</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="ghost" 
              size="icon" 
              onClick={clearFilters}
              className="h-12 w-12 rounded-2xl text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-100 dark:border-slate-800"
            >
              <Eraser className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Button 
          className="bg-gray-900 hover:bg-black text-white rounded-2xl h-12 px-8 shadow-xl dark:shadow-none shadow-gray-200 gap-2 font-bold transition-all active:scale-95 shrink-0 uppercase tracking-widest text-xs"
          onClick={() => {
            setEditingRoom(null);
            setRoomFormData({ roomNumber: "", floor: 1, roomTypeId: "" });
            setIsRoomDialogOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          {isEs ? "Agregar Habitación" : "Add Room"}
        </Button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm dark:shadow-none overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 dark:border-slate-700 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] bg-gray-50 dark:bg-slate-800/30">
                <th className="py-3.5 px-6">
                  <TableSortHeader label={isEs ? 'Habitación' : 'Room'} sortKey="roomNumber" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-3.5 px-6 font-bold border-none">
                  <TableSortHeader label={isEs ? 'Piso' : 'Floor'} sortKey="floor" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-3.5 px-6 font-bold border-none">
                  <TableSortHeader label={isEs ? 'Tipo de Categoría' : 'Category Type'} sortKey="typeName" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-3.5 px-6 text-center font-bold border-none">
                  <TableSortHeader label={isEs ? 'Disponibilidad' : 'Availability'} sortKey="isAvailable" currentSort={sort} onSort={handleSort} />
                </th>
                <th className="py-3.5 px-6 text-right font-bold uppercase tracking-[0.2em] border-none">{isEs ? 'Acciones' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
              {paginatedData.map((room) => (
                <tr key={room.id} className="hover:bg-brand-blue/5 dark:hover:bg-slate-800/70 transition-colors group">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shadow-inner transition-all group-hover:rotate-3",
                        room.isAvailable ? "bg-brand-green/10 text-brand-green" : "bg-red-50 dark:bg-red-500/10 text-red-500"
                      )}>
                        {room.roomNumber}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">Habitación {room.roomNumber}</span>
                        <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mt-0.5">{isEs ? 'ID FÍSICO' : 'PHYSICAL ID'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-2">
                       <Layers className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                       <p className="text-xs text-gray-700 dark:text-gray-300 font-bold">{room.floor || 1}º Piso</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 shadow-sm dark:shadow-none">
                      {room.typeName}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                       <Switch 
                        checked={room.isAvailable} 
                        onCheckedChange={() => handleToggle(room.id, room.isAvailable)}
                        className="data-[state=checked]:bg-brand-green scale-90"
                        disabled={isPending}
                      />
                      <div className="w-4">
                         {room.isAvailable ? <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" /> : <XCircle className="w-3.5 h-3.5 text-red-500" />}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-lg h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-brand-blue hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 shadow-none"
                          onClick={() => {
                            setEditingRoom(room);
                            setRoomFormData({
                              roomNumber: room.roomNumber,
                              floor: room.floor || 1,
                              roomTypeId: room.roomTypeId
                            });
                            setIsRoomDialogOpen(true);
                          }}
                          disabled={isPending}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="rounded-lg h-8 w-8 text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-gray-100 dark:hover:border-slate-700 shadow-none"
                          onClick={() => setRoomToDelete(room)}
                          disabled={isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                  </td>
                </tr>
              ))}
              {paginatedData.length === 0 && (
                <tr className="bg-transparent border-none">
                  <td colSpan={5} className="py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                       <div className="w-20 h-20 rounded-[2rem] bg-gray-50 dark:bg-slate-800/50 flex items-center justify-center text-gray-100 shadow-inner">
                          <DoorOpen className="w-10 h-10 border-none" />
                       </div>
                       <p className="text-sm text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em]">
                         {isEs ? "No se encontraron habitaciones" : "No rooms found"}
                       </p>
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

      <Dialog open={isRoomDialogOpen} onOpenChange={(open) => {
        setIsRoomDialogOpen(open);
        if (!open) setEditingRoom(null);
      }}>
        <DialogContent className="rounded-[3rem] max-w-md p-10 border-none shadow-2xl dark:shadow-none">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-serif font-bold text-gray-900 dark:text-gray-100 flex items-center gap-4">
               <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 dark:bg-brand-blue/10 flex items-center justify-center border border-brand-blue/10 dark:border-brand-blue/20">
                  <DoorOpen className="w-6 h-6 text-brand-blue" />
               </div>
              {editingRoom 
                ? (isEs ? "Editar Habitación" : "Edit Room") 
                : (isEs ? "Agregar Habitación" : "Add New Room")}
            </DialogTitle>
            <DialogDescription className="text-sm font-medium text-gray-500 dark:text-gray-400 pt-2">
              {isEs 
                ? "Configura la ubicación física y el tipo para esta habitación." 
                : "Set physical location and type for this room."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-8 py-2">
            <div className="space-y-2.5">
              <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">
                {isEs ? "Número de Habitación" : "Room Number"}
              </Label>
              <Input 
                value={roomFormData.roomNumber}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                placeholder="101, 202-A, etc."
                className="h-14 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold shadow-none text-sm px-5"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">
                  {isEs ? "Piso / Nivel" : "Floor / Level"}
                </Label>
                <Input 
                  type="number"
                  value={roomFormData.floor}
                  onChange={(e) => setRoomFormData({ ...roomFormData, floor: parseInt(e.target.value) || 1 })}
                  className="h-14 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 focus:bg-white transition-all font-bold shadow-none text-sm px-5"
                />
              </div>

              <div className="space-y-2.5">
                <Label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] ml-2">
                  {isEs ? "Tipo / Categoría" : "Room Type"}
                </Label>
                <Select 
                  value={roomFormData.roomTypeId} 
                  onValueChange={(val) => setRoomFormData({ ...roomFormData, roomTypeId: val })}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 font-bold shadow-none text-sm px-5 transition-all focus:bg-white">
                    <SelectValue placeholder={isEs ? "Elegir..." : "Choose..."} />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2 border-gray-100 dark:border-slate-800 shadow-2xl dark:shadow-none">
                    {roomTypes.map(type => (
                      <SelectItem key={type.id} value={type.id} className="rounded-xl text-sm font-bold py-3">{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-12 gap-4 flex-col sm:flex-row">
            <Button 
              variant="ghost" 
              className="rounded-2xl font-bold h-14 flex-1 text-xs uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setIsRoomDialogOpen(false)}
              disabled={isPending}
            >
              {isEs ? "Descartar" : "Discard"}
            </Button>
            <Button 
              className="bg-gray-900 hover:bg-black text-white rounded-2xl h-14 flex-1 font-bold shadow-2xl dark:shadow-none shadow-gray-200 transition-all active:scale-95 text-xs uppercase tracking-widest"
              onClick={handleSaveRoom}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Guardar Cambios" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <DialogContent className="rounded-[3rem] max-w-sm p-12 border-none shadow-2xl dark:shadow-none text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-[1.5rem] flex items-center justify-center mb-8 border border-red-100 shadow-inner">
            <Trash2 className="w-10 h-10" />
          </div>
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900 dark:text-gray-100">
              {isEs ? "¿Eliminar Habitación?" : "Delete Room?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-wider leading-relaxed">
              {isEs 
                ? `Estás a punto de eliminar permanentemente la Habitación ${roomToDelete?.roomNumber}.` 
                : `You are about to permanently delete Room ${roomToDelete?.roomNumber}.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-10">
            <Button 
              variant="destructive" 
              className="h-14 rounded-2xl font-bold text-sm shadow-xl dark:shadow-none shadow-red-100 uppercase tracking-widest active:scale-95"
              onClick={handleDeleteRoom}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Sí, Eliminar" : "Yes, Delete"}
            </Button>
            <Button 
              variant="ghost" 
              className="h-12 rounded-2xl text-gray-400 dark:text-gray-500 font-bold text-xs uppercase tracking-widest"
              onClick={() => setRoomToDelete(null)}
              disabled={isPending}
            >
              {isEs ? "Cancelar" : "Cancel"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
