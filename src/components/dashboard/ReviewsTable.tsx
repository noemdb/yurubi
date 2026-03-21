// src/components/dashboard/ReviewsTable.tsx
"use client";

import { useState } from "react";
import { 
  Check, 
  X, 
  MessageSquare, 
  Star, 
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { approveReview, rejectReview } from "@/lib/actions/reviews";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  guestName: string;
  email: string | null;
  rating: number;
  comment: string;
  status: string;
  createdAt: Date;
}

export function ReviewsTable({ initialData, locale }: { initialData: Review[], locale: string }) {
  const [filter, setFilter] = useState("PENDING");
  const { toast } = useToast();
  const isEs = locale === "es";

  const handleApprove = async (id: string) => {
    try {
      await approveReview(id);
      toast({ title: isEs ? "Reseña aprobada" : "Review approved", variant: "default" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectReview(id);
      toast({ title: isEs ? "Reseña rechazada" : "Review rejected", variant: "default" });
    } catch (e) {
      toast({ title: "Error", variant: "destructive" });
    }
  };

  const filteredData = initialData.filter((r) => r.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex bg-gray-100 p-1.5 rounded-[1.5rem] w-fit border border-gray-200 shadow-inner">
        {["PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={cn(
              "px-6 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all",
              filter === s 
                ? "bg-white text-brand-blue shadow-md scale-[1.02]" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {s === "PENDING" ? (isEs ? "Pendientes" : "Pending") : 
             s === "APPROVED" ? (isEs ? "Aprobadas" : "Approved") : 
             (isEs ? "Rechazadas" : "Rejected")}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredData.map((review) => (
          <div key={review.id} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col hover:shadow-lg transition-all group overflow-hidden relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue text-lg font-bold">
                {review.guestName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 leading-tight">{review.guestName}</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={cn("w-3 h-3 fill-current", i < review.rating ? "text-amber-400" : "text-gray-100")} />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1 italic">
              "{review.comment}"
            </p>

            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {new Date(review.createdAt).toLocaleDateString(locale)}
              </span>
              
              <div className="flex gap-2">
                {filter === "PENDING" && (
                  <>
                    <Button 
                      size="icon" 
                      onClick={() => handleReject(review.id)}
                      className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl shadow-none transition-all"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="icon" 
                      onClick={() => handleApprove(review.id)}
                      className="bg-green-50 text-green-500 hover:bg-green-500 hover:text-white rounded-xl shadow-none transition-all"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  </>
                )}
                {filter !== "PENDING" && (
                  <Button variant="ghost" size="icon" className="rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                )}
              </div>
            </div>

            <MessageSquare className="absolute -right-6 -top-6 w-24 h-24 text-gray-50 opacity-10 group-hover:scale-110 transition-transform duration-700" />
          </div>
        ))}
        
        {filteredData.length === 0 && (
          <div className="col-span-full py-24 text-center">
            <MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">
              {isEs ? "No hay reseñas en este estado." : "No reviews found in this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
