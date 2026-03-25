"use client";

import { useState, useTransition } from "react";
import { 
  CalendarPlus, 
  DoorOpen, 
  Tag, 
  UserPlus, 
  Loader2,
  Hotel,
  Save,
  X,
  CreditCard,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createManualReservation } from "@/lib/actions/reservations";
import { createRoom } from "@/lib/actions/rooms";
import { createPromotion } from "@/lib/actions/promotions";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";

interface QuickActionsProps {
  roomTypes: any[];
  locale: string;
}

export function QuickActions({ roomTypes, locale }: QuickActionsProps) {
  const { toast } = useToast();
  const isEs = locale === "es";
  const [isPending, startTransition] = useTransition();
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  // Reservation Form State
  const [reservationData, setReservationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    idDocument: "",
    roomTypeId: "",
    checkIn: "",
    checkOut: "",
    numberOfGuests: 1,
    totalPrice: 0
  });

  // Room Form State
  const [roomData, setRoomData] = useState({
    roomNumber: "",
    floor: 1,
    roomTypeId: ""
  });

  // Promotion Form State
  const [promotionData, setPromotionData] = useState({
    title: "",
    description: "",
    code: "",
    discountType: "PERCENT" as "PERCENT" | "FIXED",
    value: 0,
    startDate: "",
    endDate: ""
  });

  const handleCreateReservation = async () => {
    if (!reservationData.fullName || !reservationData.email || !reservationData.idDocument || !reservationData.roomTypeId || !reservationData.checkIn || !reservationData.checkOut) {
      toast({ title: isEs ? "Faltan datos obligatorios" : "Required data missing", variant: "destructive" });
      return;
    }

    const checkIn = new Date(reservationData.checkIn);
    const checkOut = new Date(reservationData.checkOut);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        toast({ title: isEs ? "Fechas inválidas" : "Invalid dates", variant: "destructive" });
        return;
    }

    if (checkOut <= checkIn) {
        toast({ title: isEs ? "La fecha de salida debe ser posterior a la de entrada" : "Check-out must be after check-in", variant: "destructive" });
        return;
    }

    startTransition(async () => {
      try {
        const selectedType = roomTypes.find(t => t.id === reservationData.roomTypeId);
        const price = selectedType ? selectedType.basePrice : 0;
        
        await createManualReservation({
          ...reservationData,
          checkIn,
          checkOut,
          totalPrice: reservationData.totalPrice || price
        });
        
        toast({ title: isEs ? "Reserva creada" : "Reservation created" });
        setActiveDialog(null);
        setReservationData({
            fullName: "", email: "", phone: "", idDocument: "", 
            roomTypeId: "", checkIn: "", checkOut: "", 
            numberOfGuests: 1, totalPrice: 0
        });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleCreateRoom = async () => {
    if (!roomData.roomNumber || !roomData.roomTypeId) {
      toast({ title: isEs ? "Faltan datos" : "Missing data", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        await createRoom(roomData);
        toast({ title: isEs ? "Habitación creada" : "Room created" });
        setActiveDialog(null);
        setRoomData({ roomNumber: "", floor: 1, roomTypeId: "" });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const handleCreatePromotion = async () => {
    if (!promotionData.title || !promotionData.code || !promotionData.value || !promotionData.startDate || !promotionData.endDate) {
      toast({ title: isEs ? "Faltan datos obligatorios" : "Required fields missing", variant: "destructive" });
      return;
    }

    const startDate = new Date(promotionData.startDate);
    const endDate = new Date(promotionData.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        toast({ title: isEs ? "Fechas inválidas" : "Invalid dates", variant: "destructive" });
        return;
    }

    if (endDate <= startDate) {
        toast({ title: isEs ? "La fecha de fin debe ser posterior a la de inicio" : "End date must be after start date", variant: "destructive" });
        return;
    }

    startTransition(async () => {
      try {
        await createPromotion({
            ...promotionData,
            startDate,
            endDate
        });
        toast({ title: isEs ? "Promoción creada" : "Promotion created" });
        setActiveDialog(null);
        setPromotionData({
            title: "", description: "", code: "", 
            discountType: "PERCENT", value: 0, 
            startDate: "", endDate: ""
        });
      } catch (e) {
        toast({ title: "Error", variant: "destructive" });
      }
    });
  };

  const actions = [
    { 
      id: "reservation", 
      icon: <CalendarPlus className="w-5 h-5" />, 
      label: isEs ? "Nueva Reserva" : "New Booking",
      desc: isEs ? "Registrar una estancia manualmente" : "Manually register a stay"
    },
    { 
      id: "room", 
      icon: <DoorOpen className="w-5 h-5" />, 
      label: isEs ? "Nueva Habitación" : "New Room",
      desc: isEs ? "Añadir habitación física al inventario" : "Add physical room to inventory"
    },
    { 
      id: "promotion", 
      icon: <Tag className="w-5 h-5" />, 
      label: isEs ? "Crear Promoción" : "Create Promo",
      desc: isEs ? "Lanzar oferta especial" : "Launch a special offer"
    }
  ];

  return (
    <div className="bg-brand-blue rounded-[2rem] p-8 text-white relative overflow-hidden shadow-lg shadow-brand-blue/20">
      <h3 className="text-xl font-serif font-bold mb-6 relative z-10">{isEs ? "Acceso Rápido" : "Quick Actions"}</h3>
      
      <div className="grid grid-cols-1 gap-3 relative z-10">
        {actions.map((action) => (
          <button 
            key={action.id}
            onClick={() => setActiveDialog(action.id)}
            className="flex flex-col items-center justify-center p-4 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 transition-all group text-left w-full"
          >
            <div className="flex items-center gap-3 w-full">
               <div className="p-2 bg-white/10 rounded-xl group-hover:scale-110 transition-transform">
                 {action.icon}
               </div>
               <div>
                 <p className="text-sm font-bold">{action.label}</p>
                 <p className="text-[10px] opacity-60 font-medium">{action.desc}</p>
               </div>
            </div>
          </button>
        ))}
      </div>

      <Hotel className="absolute -right-8 -bottom-8 w-40 h-40 opacity-10 rotate-12" />

      {/* --- DIALOGS --- */}

      {/* 1. Nueva Reserva */}
      <Dialog open={activeDialog === "reservation"} onOpenChange={(open) => !open && setActiveDialog(null)}>
        <DialogContent className="max-w-4xl rounded-[2.5rem] p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-2">
              <CalendarPlus className="w-8 h-8 text-brand-blue" />
              {isEs ? "Nueva Reserva Manual" : "New Manual Booking"}
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-medium text-lg">
              {isEs ? "Ingresa los detalles del huésped y su estancia." : "Enter guest and stay details."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-4">
             {/* Datos del Huésped */}
             <div className="space-y-6">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
                    {isEs ? "Información del Huésped" : "Guest Information"}
                </h4>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>{isEs ? "Nombre Completo" : "Full Name"}</Label>
                        <Input value={reservationData.fullName} onChange={e => setReservationData({...reservationData, fullName: e.target.value})} className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{isEs ? "Documento ID" : "ID Document"}</Label>
                            <Input value={reservationData.idDocument} onChange={e => setReservationData({...reservationData, idDocument: e.target.value})} className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                        </div>
                        <div className="space-y-2">
                            <Label>{isEs ? "Teléfono" : "Phone"}</Label>
                            <Input value={reservationData.phone} onChange={e => setReservationData({...reservationData, phone: e.target.value})} className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Email</Label>
                        <Input type="email" value={reservationData.email} onChange={e => setReservationData({...reservationData, email: e.target.value})} className="rounded-xl bg-gray-50 border-gray-100 h-12" />
                    </div>
                </div>
             </div>

             {/* Datos de la Estancia */}
             <div className="space-y-6">
                <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest border-b border-gray-100 pb-2">
                    {isEs ? "Detalles de Estancia" : "Stay Details"}
                </h4>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>{isEs ? "Tipo de Habitación" : "Room Type"}</Label>
                        <Select value={reservationData.roomTypeId} onValueChange={v => setReservationData({...reservationData, roomTypeId: v})}>
                            <SelectTrigger className="rounded-xl bg-gray-50 border-gray-100 h-12 font-bold">
                                <SelectValue placeholder={isEs ? "Seleccionar tipo..." : "Select type..."} />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {roomTypes.map(t => (
                                    <SelectItem key={t.id} value={t.id}>{t.name} - {formatPrice(t.basePrice)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Check-in</Label>
                            <Input type="date" value={reservationData.checkIn} onChange={e => setReservationData({...reservationData, checkIn: e.target.value})} className="rounded-xl bg-gray-50 border-gray-100 h-12 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label>Check-out</Label>
                            <Input type="date" value={reservationData.checkOut} onChange={e => setReservationData({...reservationData, checkOut: e.target.value})} className="rounded-xl bg-gray-50 border-gray-100 h-12 font-bold" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{isEs ? "Huéspedes" : "Guests"}</Label>
                            <Input type="number" min={1} value={reservationData.numberOfGuests} onChange={e => setReservationData({...reservationData, numberOfGuests: parseInt(e.target.value)})} className="rounded-xl bg-gray-50 border-gray-100 h-12 font-bold" />
                        </div>
                        <div className="space-y-2">
                            <Label>{isEs ? "Monto Total" : "Total Amount"}</Label>
                            <Input type="number" value={reservationData.totalPrice} onChange={e => setReservationData({...reservationData, totalPrice: parseFloat(e.target.value)})} className="rounded-xl bg-gray-100 border-gray-100 h-12 font-bold text-brand-green" />
                        </div>
                    </div>
                </div>
             </div>
          </div>

          <DialogFooter className="mt-12 gap-4">
             <Button variant="ghost" onClick={() => setActiveDialog(null)} className="h-14 rounded-2xl font-bold px-8" disabled={isPending}>
               {isEs ? "Cancelar" : "Cancel"}
             </Button>
             <Button onClick={handleCreateReservation} className="h-14 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold px-12 shadow-xl shadow-brand-blue/20" disabled={isPending}>
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                {isEs ? "Confirmar Reserva" : "Confirm Booking"}
             </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2. Nueva Habitación */}
      <Dialog open={activeDialog === "room"} onOpenChange={(open) => !open && setActiveDialog(null)}>
         <DialogContent className="max-w-md rounded-[2.5rem] p-10 border-none shadow-2xl">
            <DialogHeader className="mb-8">
               <DialogTitle className="text-2xl font-serif font-bold flex items-center gap-2">
                 <DoorOpen className="w-6 h-6 text-brand-green" />
                 {isEs ? "Nueva Habitación Física" : "New Physical Room"}
               </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
                <div className="space-y-2">
                    <Label>{isEs ? "Número de Habitación" : "Room Number"}</Label>
                    <Input value={roomData.roomNumber} onChange={e => setRoomData({...roomData, roomNumber: e.target.value})} placeholder="301, 402, etc." className="rounded-xl h-12 bg-gray-50 font-bold" />
                </div>
                <div className="space-y-2">
                    <Label>{isEs ? "Piso" : "Floor"}</Label>
                    <Input type="number" value={roomData.floor} onChange={e => setRoomData({...roomData, floor: parseInt(e.target.value)})} className="rounded-xl h-12 bg-gray-50 font-bold" />
                </div>
                <div className="space-y-2">
                    <Label>{isEs ? "Tipo / Categoría" : "Room Type"}</Label>
                    <Select value={roomData.roomTypeId} onValueChange={v => setRoomData({...roomData, roomTypeId: v})}>
                        <SelectTrigger className="rounded-xl h-12 bg-gray-50 font-bold">
                            <SelectValue placeholder={isEs ? "Seleccionar..." : "Select..."} />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            {roomTypes.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter className="mt-10">
                <Button onClick={handleCreateRoom} className="w-full h-14 bg-brand-green hover:bg-brand-green/90 text-white rounded-2xl font-bold shadow-xl shadow-brand-green/20" disabled={isPending}>
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                    {isEs ? "Guardar Habitación" : "Save Room"}
                </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

      {/* 3. Nueva Promoción */}
      <Dialog open={activeDialog === "promotion"} onOpenChange={(open) => !open && setActiveDialog(null)}>
         <DialogContent className="max-w-2xl rounded-[2.5rem] p-10 border-none shadow-2xl overflow-y-auto max-h-[90vh]">
            <DialogHeader className="mb-8">
               <DialogTitle className="text-2xl font-serif font-bold flex items-center gap-2 text-gray-900">
                 <Tag className="w-6 h-6 text-brand-blue" />
                 {isEs ? "Crear Nueva Promoción" : "Create New Promotion"}
               </DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full space-y-2">
                    <Label>{isEs ? "Título de la Oferta" : "Offer Title"}</Label>
                    <Input value={promotionData.title} onChange={e => setPromotionData({...promotionData, title: e.target.value})} className="rounded-xl h-12 bg-gray-50 font-bold" />
                </div>
                <div className="space-y-2">
                    <Label>{isEs ? "Código de Cupón" : "Coupon Code"}</Label>
                    <Input value={promotionData.code} onChange={e => setPromotionData({...promotionData, code: e.target.value.toUpperCase()})} placeholder="VERANO2026" className="rounded-xl h-12 bg-gray-50 font-bold" />
                </div>
                <div className="space-y-2">
                    <Label>{isEs ? "Monto de Descuento" : "Discount Value"}</Label>
                    <div className="flex gap-2">
                        <Input type="number" value={promotionData.value} onChange={e => setPromotionData({...promotionData, value: parseFloat(e.target.value)})} className="rounded-xl h-12 bg-gray-100 flex-1 font-bold" />
                        <Select value={promotionData.discountType} onValueChange={(v:any) => setPromotionData({...promotionData, discountType: v})}>
                            <SelectTrigger className="w-24 rounded-xl h-12 font-bold">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PERCENT">%</SelectItem>
                                <SelectItem value="FIXED">$</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>{isEs ? "Fecha Inicio" : "Start Date"}</Label>
                    <Input type="date" value={promotionData.startDate} onChange={e => setPromotionData({...promotionData, startDate: e.target.value})} className="rounded-xl h-12 bg-gray-50" />
                </div>
                <div className="space-y-2">
                    <Label>{isEs ? "Fecha Fin" : "End Date"}</Label>
                    <Input type="date" value={promotionData.endDate} onChange={e => setPromotionData({...promotionData, endDate: e.target.value})} className="rounded-xl h-12 bg-gray-50" />
                </div>
                <div className="col-span-full space-y-2">
                    <Label>{isEs ? "Descripción (Opcional)" : "Description (Optional)"}</Label>
                    <Textarea value={promotionData.description} onChange={e => setPromotionData({...promotionData, description: e.target.value})} className="rounded-xl bg-gray-50 min-h-[100px]" />
                </div>
            </div>
            <DialogFooter className="mt-10">
                <Button onClick={handleCreatePromotion} className="w-full h-14 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl font-bold shadow-xl shadow-brand-blue/20" disabled={isPending}>
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-3" />}
                    {isEs ? "Lanzar Promoción" : "Launch Promotion"}
                </Button>
            </DialogFooter>
         </DialogContent>
      </Dialog>

    </div>
  );
}
