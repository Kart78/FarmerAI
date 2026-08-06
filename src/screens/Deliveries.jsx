import { Phone, MapPin, Star, Truck } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { DELIVERY } from "../data/mock.js";

export default function Deliveries({ setScreen, openMenu }) {
  return (
    <div className="max-w-2xl mx-auto">
      <ScreenHeader title="Deliveries" setScreen={setScreen} openMenu={openMenu} />
      <h1 className="text-xl font-display font-semibold text-stone-800 mb-4">Deliveries — Live Map</h1>

      <div
        className="relative h-64 sm:h-80 rounded-card border border-stone-200 overflow-hidden mb-4"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg,#eef2ee,#eef2ee 24px,#e4e9e4 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,#e4e9e4 25px)",
        }}
      >
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M 15 22 C 40 30, 45 55, 68 65"
            fill="none"
            stroke="#15803d"
            strokeWidth="1.2"
            strokeDasharray="3 2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="absolute left-[12%] top-[15%] flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-farm-700 border-2 border-white shadow" />
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded shadow font-medium">Your Farm</span>
        </div>

        <div className="absolute left-[38%] top-[42%] w-7 h-7 rounded-full bg-farm-900 text-white flex items-center justify-center shadow-md">
          <Truck size={14} />
        </div>

        <div className="absolute left-[63%] top-[60%] flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded shadow font-medium">Buyer Location</span>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-card p-4 flex items-center justify-between gap-4">
        <div>
          <div className="font-semibold text-stone-800">Truck #{DELIVERY.truck}</div>
          <div className="flex items-center gap-3 text-sm text-stone-500 mt-1">
            <span className="flex items-center gap-1"><Star size={13} className="text-amber-500" />{DELIVERY.rating}</span>
            <span>{DELIVERY.driver}</span>
            <span>ETA {DELIVERY.eta}</span>
          </div>
        </div>
        <button className="w-11 h-11 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0">
          <Phone size={17} />
        </button>
      </div>

      <button onClick={() => setScreen && setScreen("deliveries")} className="text-sm text-farm-700 mt-3">
        View All Deliveries →
      </button>
    </div>
  );
}
