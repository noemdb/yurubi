"use client";

import { useState, useTransition } from "react";
import { 
  Bed, 
  DoorOpen, 
  Edit3, 
  Save, 
  X, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Loader2
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
import { cn, formatPrice } from "@/lib/utils";
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

  const rooms = roomTypes
    .flatMap(type => type.rooms.map((r: any) => ({ ...r, typeName: type.name })))
    .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "ALL" || room.roomTypeId === typeFilter;
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="space-y-12">
      {/* Search & Global Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input 
              placeholder={isEs ? "Buscar número habitación..." : "Search room number..."}
              className="pl-12 h-12 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white transition-all shadow-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full md:w-[200px] h-12 rounded-2xl border-gray-100 bg-gray-50 font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <SelectValue placeholder={isEs ? "Todos los tipos" : "All types"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-2xl p-2">
              <SelectItem value="ALL" className="rounded-xl">{isEs ? "Todos los tipos" : "All types"}</SelectItem>
              {roomTypes.map(type => (
                <SelectItem key={type.id} value={type.id} className="rounded-xl">{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-12 px-6 shadow-lg shadow-brand-blue/20 gap-2 font-bold"
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


      {/* Physical Rooms List */}
      <section className="space-y-6">
        <h3 className="text-xl font-serif font-bold text-gray-900 flex items-center gap-2">
          <DoorOpen className="w-5 h-5 text-brand-green" />
          {isEs ? "Inventario de Habitaciones Físicas" : "Physical Rooms Inventory"}
        </h3>
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                  <th className="py-5 px-8">Nro. {isEs ? 'Habitación' : 'Room'}</th>
                  <th className="py-5 px-4">{isEs ? 'Piso' : 'Floor'}</th>
                  <th className="py-5 px-4">{isEs ? 'Tipo' : 'Type'}</th>
                  <th className="py-5 px-4 text-center">{isEs ? 'Disponible' : 'Available'}</th>
                  <th className="py-5 px-8 text-right">{isEs ? 'Acciones' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-6 px-8">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs",
                          room.isAvailable ? "bg-brand-green/5 text-brand-green" : "bg-red-50 text-red-500"
                        )}>
                          {room.roomNumber}
                        </div>
                        <span className="font-bold text-gray-900 leading-none">Habitación {room.roomNumber}</span>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <p className="text-sm text-gray-500 font-medium">{isEs ? 'Piso' : 'Floor'} {room.floor || 1}</p>
                    </td>
                    <td className="py-6 px-4">
                      <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {room.typeName}
                      </span>
                    </td>
                    <td className="py-6 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Switch 
                          checked={room.isAvailable} 
                          onCheckedChange={() => handleToggle(room.id, room.isAvailable)}
                          className="data-[state=checked]:bg-brand-green"
                          disabled={isPending}
                        />
                      </div>
                    </td>
                    <td className="py-6 px-8 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="rounded-xl h-10 w-10 text-gray-400 hover:text-brand-blue"
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
                           className="rounded-xl h-10 w-10 text-gray-400 hover:text-red-500"
                           onClick={() => setRoomToDelete(room)}
                           disabled={isPending}
                         >
                           <Trash2 className="w-4 h-4" />
                         </Button>
                       </div>
                    </td>
                  </tr>
                ))}
                {filteredRooms.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-gray-400 font-medium">
                      {isEs ? "No se encontraron habitaciones." : "No rooms found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add / Edit Room Dialog */}
      <Dialog open={isRoomDialogOpen} onOpenChange={(open) => {
        setIsRoomDialogOpen(open);
        if (!open) setEditingRoom(null);
      }}>
        <DialogContent className="rounded-[2rem] max-w-md p-8 border-none shadow-2xl">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl font-serif font-bold text-gray-900">
              {editingRoom 
                ? (isEs ? "Editar Habitación" : "Edit Room") 
                : (isEs ? "Agregar Habitación" : "Add New Room")}
            </DialogTitle>
            <DialogDescription>
              {isEs 
                ? "Completa los detalles de la habitación física." 
                : "Enter the details for the physical room."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                {isEs ? "Número de Habitación" : "Room Number"}
              </Label>
              <Input 
                value={roomFormData.roomNumber}
                onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                placeholder="101, 202-A, etc."
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                {isEs ? "Piso" : "Floor"}
              </Label>
              <Input 
                type="number"
                value={roomFormData.floor}
                onChange={(e) => setRoomFormData({ ...roomFormData, floor: parseInt(e.target.value) || 1 })}
                className="h-12 rounded-xl border-gray-100 bg-gray-50 focus:bg-white transition-all font-bold shadow-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                {isEs ? "Tipo / Categoría" : "Room Type"}
              </Label>
              <Select 
                value={roomFormData.roomTypeId} 
                onValueChange={(val) => setRoomFormData({ ...roomFormData, roomTypeId: val })}
              >
                <SelectTrigger className="h-12 rounded-xl border-gray-100 bg-gray-50 font-bold shadow-none">
                  <SelectValue placeholder={isEs ? "Seleccionar tipo..." : "Select type..."} />
                </SelectTrigger>
                <SelectContent className="rounded-xl p-2 border-gray-100">
                  {roomTypes.map(type => (
                    <SelectItem key={type.id} value={type.id} className="rounded-lg">{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter className="mt-8 gap-3 sm:gap-0">
            <Button 
              variant="ghost" 
              className="rounded-xl font-bold h-12 px-6"
              onClick={() => setIsRoomDialogOpen(false)}
              disabled={isPending}
            >
              {isEs ? "Cancelar" : "Cancel"}
            </Button>
            <Button 
              className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-brand-blue/20 transition-all active:scale-95"
              onClick={handleSaveRoom}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEs ? "Guardar Cambios" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!roomToDelete} onOpenChange={(open) => !open && setRoomToDelete(null)}>
        <DialogContent className="rounded-[2.5rem] max-w-sm p-10 border-none shadow-2xl text-center">
          <div className="mx-auto w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
            <Trash2 className="w-10 h-10" />
          </div>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900">
              {isEs ? "¿Estás seguro?" : "Are you sure?"}
            </DialogTitle>
            <DialogDescription className="text-center text-gray-500 leading-relaxed font-medium">
              {isEs 
                ? `Estás a punto de eliminar la Habitación ${roomToDelete?.roomNumber}. Esta acción no se puede deshacer.` 
                : `You are about to delete Room ${roomToDelete?.roomNumber}. This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-10">
            <Button 
              variant="destructive" 
              className="h-14 rounded-2xl font-bold text-lg shadow-lg shadow-red-200"
              onClick={handleDeleteRoom}
              disabled={isPending}
            >
              {isPending && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
              {isEs ? "Sí, Eliminar" : "Yes, Delete"}
            </Button>
            <Button 
              variant="ghost" 
              className="h-12 rounded-xl text-gray-400 font-bold"
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
