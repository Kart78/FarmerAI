import { Sprout, ListChecks, Sparkles, MapPin, Zap, Menu, Sun } from "lucide-react";
import { FARMER } from "../data/mock.js";

const BADGES = [
  { icon: ListChecks, label: "5 Steps" },
  { icon: Sparkles, label: "AI Suggested Price" },
  { icon: MapPin, label: "GPS Verified Farm" },
  { icon: Zap, label: "Instant Payments" },
];

export default function TopBar({ onMenuClick }) {
  return (
    <header className="bg-farm-800 text-white px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-3">
      <div className="flex items-center gap-2 shrink-0">
        <button onClick={onMenuClick} className="md:hidden p-1.5 -ml-1 rounded-lg hover:bg-white/10">
          <Menu size={18} />
        </button>
        <Sprout className="text-amber-300" size={22} />
        <div>
          <div className="font-display font-bold leading-tight">FarmerAI</div>
          <div className="text-[11px] text-white/70 -mt-0.5 hidden sm:block">Agri Marketplace</div>
        </div>
      </div>

      <div className="hidden lg:block text-center">
        <div className="font-display font-semibold">Good Morning, {FARMER.name}</div>
        <div className="text-xs text-white/70">Let's sell today's harvest.</div>
      </div>

      <div className="hidden xl:flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-sm">
          <Sun size={16} className="text-amber-300" />
          <span className="font-semibold">32°C</span>
          <span className="text-white/70 text-xs">Sunny</span>
        </div>
        <div className="w-px h-6 bg-white/15" />
        {BADGES.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 text-xs text-white/85">
            <Icon size={14} className="text-amber-300" />
            {label}
          </div>
        ))}
      </div>
    </header>
  );
}
