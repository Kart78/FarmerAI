import { Users } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { ORDERS } from "../data/mock.js";

function buildCustomers() {
  const map = {};
  ORDERS.forEach((o) => {
    if (!map[o.buyer]) map[o.buyer] = { name: o.buyer, orders: 0, spent: 0 };
    map[o.buyer].orders += 1;
    map[o.buyer].spent += o.value;
  });
  return Object.values(map).sort((a, b) => b.spent - a.spent);
}

export default function Customers({ setScreen, openMenu }) {
  const customers = buildCustomers();

  return (
    <div className="max-w-2xl mx-auto">
      <ScreenHeader title="Customers" setScreen={setScreen} openMenu={openMenu} />
      <h1 className="text-xl font-display font-semibold text-stone-800 mb-4">Customers</h1>

      <div className="bg-white border border-stone-200 rounded-card p-4">
        <div className="space-y-3">
          {customers.map((c) => (
            <div key={c.name} className="flex items-center gap-3 text-sm border-b border-stone-100 pb-3 last:border-0 last:pb-0">
              <div className="w-9 h-9 rounded-full bg-farm-800/10 text-farm-800 flex items-center justify-center font-semibold text-xs shrink-0">
                {c.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-stone-800">{c.name}</div>
                <div className="text-xs text-stone-500">{c.orders} order{c.orders > 1 ? "s" : ""}</div>
              </div>
              <div className="font-mono text-stone-800 shrink-0">₹{c.spent.toLocaleString("en-IN")}</div>
            </div>
          ))}
          {customers.length === 0 && (
            <p className="text-sm text-stone-400 flex items-center gap-2"><Users size={14} /> No customers yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
