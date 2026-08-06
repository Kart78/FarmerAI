import { useState } from "react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { ORDERS } from "../data/mock.js";

const TABS = ["New", "Accepted", "In Transit", "Delivered"];
const STATUS_TONE = {
  New: "bg-amber-100 text-amber-700",
  Accepted: "bg-blue-100 text-blue-700",
  "In Transit": "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function Orders({ setScreen, openMenu }) {
  const [tab, setTab] = useState("New");
  const [orders, setOrders] = useState(ORDERS);

  const accept = (id) => setOrders(orders.map((o) => (o.id === id ? { ...o, status: "Accepted" } : o)));
  const list = orders.filter((o) => o.status === tab);

  return (
    <div className="max-w-2xl mx-auto">
      <ScreenHeader title="Orders" setScreen={setScreen} openMenu={openMenu} />
      <h1 className="text-xl font-display font-semibold text-stone-800 mb-4">Orders</h1>
      <div className="flex gap-2 mb-4 overflow-x-auto -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap ${
              tab === t ? "bg-farm-800 text-white border-farm-800" : "border-stone-300 text-stone-600"
            }`}
          >
            {t} ({orders.filter((o) => o.status === t).length})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {list.length === 0 && <p className="text-sm text-stone-400">No orders here right now.</p>}
        {list.map((o) => (
          <div key={o.id} className="bg-white border border-stone-200 rounded-card p-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-farm-800/10 text-farm-800 flex items-center justify-center font-semibold text-xs shrink-0">
                {o.buyer[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-stone-800 truncate">{o.buyer}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${STATUS_TONE[o.status]}`}>
                    {o.status}
                  </span>
                </div>
                <div className="text-sm text-stone-500">{o.item}</div>
                <div className="text-xs text-stone-400 mt-1">
                  Order Value ₹{o.value.toLocaleString("en-IN")} · Advance (20%) ₹{o.advance}
                </div>
              </div>
            </div>
            {o.status === "New" && (
              <button
                onClick={() => accept(o.id)}
                className="w-full mt-3 bg-farm-800 text-white text-sm font-semibold py-2 rounded-lg"
              >
                Accept
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
