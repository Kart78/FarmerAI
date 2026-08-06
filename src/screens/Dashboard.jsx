import { TrendingUp, Package, Wallet, Sprout, MapPin, Truck, CheckCircle2, Phone, Star, CloudRain, TrendingDown } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import VegPhoto from "../components/VegPhoto.jsx";
import SellingWorkflow from "../components/SellingWorkflow.jsx";
import { ORDERS, LISTINGS, DELIVERY, INSIGHTS, FARMER } from "../data/mock.js";

function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="bg-white border border-stone-200 rounded-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-500">{label}</span>
        {Icon && <Icon size={15} className="text-farm-700" />}
      </div>
      <div className="text-2xl font-bold text-stone-800 mt-1">{value}</div>
      <div className="text-xs text-farm-700 mt-0.5">{sub}</div>
    </div>
  );
}

const STATUS_META = {
  New: { label: "New", icon: Package, color: "text-amber-600" },
  Accepted: { label: "Accepted", icon: CheckCircle2, color: "text-blue-600" },
  "In Transit": { label: "In Transit", icon: Truck, color: "text-blue-600" },
  Delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-600" },
};

const iconFor = (veg) => (veg === "Rain" ? CloudRain : veg === "Onion" ? TrendingDown : Sprout);

export default function Dashboard({ setScreen, openMenu }) {
  return (
    <div className="max-w-[1600px] mx-auto space-y-8">
      <ScreenHeader title="Dashboard" setScreen={setScreen} openMenu={openMenu} />

      <div className="lg:hidden">
        <h1 className="text-xl font-display font-semibold text-stone-800">
          Good Morning, {FARMER.name} 👋
        </h1>
        <p className="text-sm text-stone-500">Let's sell today's harvest.</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Today's Revenue" value="₹12,450" sub="↑ 14% vs yesterday" icon={TrendingUp} />
        <StatCard label="Today's Orders" value="32" sub="↑ 8 new" icon={Package} />
        <StatCard label="Available Stock" value="1,250 Kg" sub="Across 6 items" icon={Sprout} />
        <StatCard label="Pending Payment" value="₹8,200" sub="2 payments pending" icon={Wallet} />
      </div>

      {/* Wide layout: 3 columns on large screens so sections sit side-by-side instead of stacking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* COLUMN 1 — Daily Selling Workflow (primary task, embedded directly) */}
        <section className="lg:col-span-1">
          <h2 className="font-display text-lg text-stone-800 mb-1">Sell Today's Harvest</h2>
          <p className="text-sm text-stone-500 mb-4">List an item in under 30 seconds.</p>
          <SellingWorkflow onPublished={() => setScreen("products")} />
        </section>

        {/* COLUMN 2 — My Listings + Orders */}
        <section className="lg:col-span-1 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-stone-800">My Listings</h2>
              <button onClick={() => setScreen("products")} className="text-sm text-farm-700 font-medium">
                View All Listings →
              </button>
            </div>
            <div className="space-y-3">
              {LISTINGS.map((l) => (
                <div key={l.id} className="bg-white border border-stone-200 rounded-card p-3 flex items-center gap-3">
                  <VegPhoto src={l.photo} alt={l.name} color={l.color} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-800 text-sm">{l.name}</span>
                      <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">{l.status}</span>
                    </div>
                    <div className="text-xs text-stone-500 font-mono">{l.qty} {l.unit} · ₹{l.price}/{l.unit} · Harvested {l.harvested}</div>
                  </div>
                  <div className="text-xs text-stone-400 shrink-0">{l.orders} orders</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-stone-800">Orders</h2>
              <button onClick={() => setScreen("orders")} className="text-sm text-farm-700 font-medium">
                View All Orders →
              </button>
            </div>
            <div className="bg-white border border-stone-200 rounded-card p-4">
              <div className="space-y-3">
                {ORDERS.slice(0, 5).map((o) => {
                  const meta = STATUS_META[o.status] || STATUS_META.New;
                  const Icon = meta.icon;
                  return (
                    <div key={o.id} className="flex items-center gap-3 text-sm border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                      <div className="w-9 h-9 rounded-full bg-farm-800/10 text-farm-800 flex items-center justify-center font-semibold text-xs shrink-0">
                        {o.buyer[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-800 truncate">{o.buyer}</div>
                        <div className="text-stone-500">₹{o.value.toLocaleString("en-IN")} · {o.item} · Advance ₹{o.advance}</div>
                      </div>
                      <div className={`flex items-center gap-1 text-xs shrink-0 ${meta.color}`}>
                        <Icon size={13} /> {meta.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* COLUMN 3 — Deliveries + AI Assistant */}
        <section className="lg:col-span-1 space-y-8">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-stone-800">Deliveries</h2>
              <button onClick={() => setScreen("deliveries")} className="text-sm text-farm-700 font-medium">
                Open Full Map →
              </button>
            </div>
            <div
              className="relative h-48 rounded-card border border-stone-200 overflow-hidden mb-3"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg,#eef2ee,#eef2ee 24px,#e4e9e4 25px),repeating-linear-gradient(90deg,transparent,transparent 24px,#e4e9e4 25px)",
              }}
            >
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 15 22 C 40 30, 45 55, 68 65" fill="none" stroke="#357a38" strokeWidth="1.2" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
              </svg>
              <div className="absolute left-[12%] top-[15%] w-3 h-3 rounded-full bg-farm-700 border-2 border-white shadow" />
              <div className="absolute left-[38%] top-[42%] w-7 h-7 rounded-full bg-farm-900 text-white flex items-center justify-center shadow-md">
                <Truck size={14} />
              </div>
              <div className="absolute left-[63%] top-[60%] w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
            </div>
            <div className="bg-white border border-stone-200 rounded-card p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-stone-800 text-sm">Truck #{DELIVERY.truck}</div>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1"><Star size={12} className="text-amber-500" />{DELIVERY.rating}</span>
                  <span>{DELIVERY.driver}</span>
                  <span>ETA {DELIVERY.eta}</span>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-farm-800 text-white flex items-center justify-center shrink-0">
                <Phone size={15} />
              </button>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-stone-800 mb-3">AI Assistant</h2>
            <div className="space-y-2 mb-3">
              {INSIGHTS.map((i) => {
                const Icon = iconFor(i.veg);
                return (
                  <div key={i.text} className="bg-white border border-stone-200 rounded-card p-3 flex gap-3">
                    <Icon size={18} className="text-farm-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-stone-700">{i.text}</p>
                      {i.extra && <p className="text-xs text-farm-700 font-semibold mt-0.5">{i.extra}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 border border-stone-300 text-stone-600 rounded-lg py-2 text-sm font-semibold">
                View Market Trends
              </button>
              <button onClick={() => setScreen("ai")} className="flex-1 bg-farm-800 text-white rounded-lg py-2 text-sm font-semibold">
                Ask FarmerAI
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="flex items-center gap-2 text-xs text-stone-500 pb-2">
        <MapPin size={14} className="text-farm-700" /> Farm location GPS verified
      </div>
    </div>
  );
}
