import { Wallet, Clock, CheckCircle2 } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { ORDERS } from "../data/mock.js";

export default function Payments({ setScreen, openMenu }) {
  const pending = ORDERS.filter((o) => o.status !== "Delivered");
  const pendingTotal = pending.reduce((s, o) => s + o.value - o.advance, 0);
  const receivedTotal = ORDERS.reduce((s, o) => s + o.advance, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <ScreenHeader title="Payments" setScreen={setScreen} openMenu={openMenu} />
      <h1 className="text-xl font-display font-semibold text-stone-800 mb-4">Payments</h1>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-farm-800 text-white rounded-card p-4">
          <div className="text-xs text-white/70">Received (advances)</div>
          <div className="text-2xl font-bold mt-1">₹{receivedTotal.toLocaleString("en-IN")}</div>
        </div>
        <div className="bg-white border border-stone-200 rounded-card p-4">
          <div className="text-xs text-stone-500">Pending on delivery</div>
          <div className="text-2xl font-bold mt-1 text-stone-800">₹{pendingTotal.toLocaleString("en-IN")}</div>
        </div>
      </div>

      <div className="bg-white border border-stone-200 rounded-card p-4">
        <h2 className="font-semibold text-stone-800 mb-3">Payment History</h2>
        <div className="space-y-3">
          {ORDERS.map((o) => (
            <div key={o.id} className="flex items-center gap-3 text-sm border-b border-stone-100 pb-3 last:border-0 last:pb-0">
              <div className="w-8 h-8 rounded-full bg-farm-800/10 text-farm-800 flex items-center justify-center shrink-0">
                {o.status === "Delivered" ? <CheckCircle2 size={15} /> : <Clock size={15} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-800">{o.buyer}</div>
                <div className="text-xs text-stone-500">{o.item}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="font-mono text-stone-800">₹{o.advance} <span className="text-stone-400">advance</span></div>
                <div className="text-xs text-stone-400">
                  {o.status === "Delivered" ? "Fully settled" : `₹${o.value - o.advance} on delivery`}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
