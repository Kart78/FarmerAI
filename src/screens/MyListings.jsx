import { useState } from "react";
import { Eye, MessageSquare, ShieldCheck } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import VegPhoto from "../components/VegPhoto.jsx";
import { LISTINGS } from "../data/mock.js";

const TABS = ["All", "Live", "Draft", "Sold Out"];

const countFor = (t) => (t === "All" ? LISTINGS.length : LISTINGS.filter((l) => l.status === t).length);

export default function MyListings({ setScreen, openMenu }) {
  const [tab, setTab] = useState("All");
  const list = tab === "All" ? LISTINGS : LISTINGS.filter((l) => l.status === tab);

  return (
    <div className="max-w-2xl mx-auto">
      <ScreenHeader title="My Listings" setScreen={setScreen} openMenu={openMenu} />
      <div className="flex items-center justify-between mb-4 gap-3">
        <h1 className="text-xl font-display font-semibold text-stone-800">My Listings</h1>
        <button
          onClick={() => setScreen("add-produce")}
          className="bg-farm-800 text-white text-sm font-semibold px-4 py-2 rounded-lg shrink-0"
        >
          + Add Produce
        </button>
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
              tab === t ? "bg-farm-800 text-white border-farm-800" : "border-stone-300 text-stone-600"
            }`}
          >
            {t} ({countFor(t)})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((l) => (
          <div key={l.id} className="bg-white border border-stone-200 rounded-card p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <VegPhoto src={l.photo} alt={l.name} color={l.color} size={52} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-stone-800">{l.name}</span>
                <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
                  {l.status}
                </span>
              </div>
              <div className="text-sm text-stone-500 font-mono">
                {l.qty} {l.unit} · ₹{l.price}/{l.unit}
              </div>
              <div className="text-xs text-stone-400">Harvested {l.harvested}</div>
              <div className="flex items-center gap-1 text-xs text-farm-700 mt-1">
                <ShieldCheck size={12} /> GPS Verified
              </div>
            </div>
            <div className="text-right text-xs text-stone-400 shrink-0 space-y-1">
              <div className="flex items-center gap-1 justify-end"><Eye size={12} /> {l.views}</div>
              <div className="flex items-center gap-1 justify-end"><MessageSquare size={12} /> {l.orders}</div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setScreen("add-produce")}
        className="w-full mt-4 flex items-center justify-center gap-2 bg-farm-800 text-white text-sm font-semibold py-2.5 rounded-lg"
      >
        + Add Produce
      </button>
    </div>
  );
}
