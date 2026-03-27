"use client";

import { 
  Search, 
  Check,
  Bath,
  Tv2,
  AirVent,
  Wine,
  Waves,
  CigaretteOff,
  Cigarette,
  Mountain,
  Map,
  Table,
  Heater,
  Refrigerator,
  Microwave,
  Fan,
  Key,
  Car,
  Dog,
  Baby,
  Dumbbell,
  Smartphone,
  Box,
  Wifi,
  Coffee,
  Utensils,
  Zap,
  Shield,
  Gamepad2,
  Music,
  Lamp
} from "lucide-react";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const ICONS = [
  { name: "wifi", icon: Wifi },
  { name: "tv", icon: Tv2 },
  { name: "ac", icon: AirVent },
  { name: "coffee", icon: Coffee },
  { name: "fridge", icon: Refrigerator },
  { name: "pool", icon: Waves },
  { name: "kitchen", icon: Utensils },
  { name: "power", icon: Zap },
  { name: "safe", icon: Shield },
  { name: "game", icon: Gamepad2 },
  { name: "music", icon: Music },
  { name: "light", icon: Lamp },
  { name: "microwave", icon: Microwave },
  { name: "fan", icon: Fan },
  { name: "key", icon: Key },
  { name: "parking", icon: Car },
  { name: "pet", icon: Dog },
  { name: "baby", icon: Baby },
  { name: "gym", icon: Dumbbell },
  { name: "mobile", icon: Smartphone },
  { name: "bath", icon: Bath },
  { name: "wine", icon: Wine },
  { name: "nosmoking", icon: CigaretteOff },
  { name: "smoking", icon: Cigarette },
  { name: "view", icon: Mountain },
  { name: "area", icon: Map },
  { name: "desk", icon: Table },
  { name: "heater", icon: Heater },
];

export function IconSelector({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (val: string) => void;
}) {
  const [search, setSearch] = useState("");

  const filteredIcons = useMemo(() => {
    return ICONS.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <Input 
          placeholder="Buscar ícono..." 
          className="pl-9 h-10 rounded-xl border-gray-100 bg-gray-50 text-xs shadow-none focus:bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-5 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredIcons.map(({ name, icon: Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border transition-all hover:scale-105 active:scale-95",
              value === name 
                ? "bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20" 
                : "bg-white border-gray-100 text-gray-400 hover:border-brand-blue/30 hover:bg-gray-50"
            )}
            title={name}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[8px] font-bold uppercase mt-1 truncate w-full text-center">
              {name}
            </span>
            {value === name && (
              <div className="absolute top-1 right-1">
                <Check className="w-2 h-2" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Helper para renderizar el ícono basado en el string name
export function AmenityIcon({ name, className }: { name: string, className?: string }) {
  const item = ICONS.find(i => i.name === name);
  const Icon = item ? item.icon : Box;
  return <Icon className={className} />;
}
