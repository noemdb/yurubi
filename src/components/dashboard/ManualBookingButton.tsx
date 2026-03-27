"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { BookingSuccessDetails } from "@/components/booking/BookingSuccessDetails";
import { cn } from "@/lib/utils";

export function ManualBookingButton({ locale }: { locale: string }) {
  const [open, setOpen] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const isEs = locale === "es";

  const handleSuccess = (details: any) => {
    setSuccessData(details);
  };

  const closeDialog = () => {
    setOpen(false);
    setTimeout(() => {
      setSuccessData(null);
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) closeDialog();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white rounded-2xl h-14 px-8 shadow-lg dark:shadow-none shadow-brand-blue/20 gap-2 font-bold transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          {isEs ? "Crear Reserva Manual" : "New Manual Booking"}
        </Button>
      </DialogTrigger>
      <DialogContent className={cn(
        "max-w-5xl p-0 overflow-visible border-none bg-transparent shadow-none outline-none",
        successData && "max-w-2xl"
      )}>
        <DialogHeader className="sr-only">
          <DialogTitle>{isEs ? "Nueva Reserva Manual" : "New Manual Booking"}</DialogTitle>
        </DialogHeader>
        
        {/* Custom High-Visibility Close Button */}
        {!successData && (
          <div className="absolute -top-12 right-0 md:-right-12 z-50">
            <Button 
              variant="ghost" 
              onClick={closeDialog}
              className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900/20 hover:bg-white dark:hover:bg-slate-900/40 backdrop-blur-md text-white border border-white dark:border-slate-900/30 shadow-2xl dark:shadow-none transition-all hover:scale-110 active:scale-90"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        )}

        <div className="max-h-[90vh] overflow-y-auto custom-scrollbar rounded-3xl">
          {successData ? (
            <BookingSuccessDetails 
              details={successData} 
              locale={locale} 
              onClose={closeDialog} 
            />
          ) : (
            <BookingWizard 
              locale={locale} 
              onSuccess={handleSuccess} 
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
