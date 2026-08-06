import {
  LayoutDashboard, Tractor, Carrot, PackageSearch, Truck, Wallet,
  Users, Bot, Bell, Settings, MessageCircleQuestion, Plus, X, BadgeCheck,
} from "lucide-react";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "farm", label: "My Farm", icon: Tractor },
  { id: "products", label: "Products", icon: Carrot },
  { id: "orders", label: "Orders", icon: PackageSearch },
  { id: "deliveries", label: "Deliveries", icon: Truck },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "customers", label: "Customers", icon: Users },
  { id: "ai", label: "AI Assistant", icon: Bot },
  { id: "notifications", label: "Notifications", icon: Bell, badge: 12 },
  { id: "settings", label: "Settings", icon: Settings },
];

function SidebarContent({ screen, setScreen, farmer, onNavigate }) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-100">
        <div className="w-10 h-10 rounded-full bg-farm-800 text-white flex items-center justify-center font-bold shrink-0">
          {farmer.name[0]}
        </div>
        <div>
          <div className="font-semibold text-stone-800 text-sm flex items-center gap-1">
            {farmer.name}
            <BadgeCheck size={14} className="text-farm-700 fill-farm-800/10" />
          </div>
          <div className="text-xs text-farm-700">{farmer.plan}</div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {ITEMS.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => {
              setScreen(id);
              onNavigate && onNavigate();
            }}
            className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              screen === id
                ? "bg-farm-800/10 text-farm-800 font-semibold"
                : "text-stone-600 hover:bg-stone-100"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <Icon size={17} />
              {label}
            </span>
            {badge && (
              <span className="text-[10px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-3 space-y-2 border-t border-stone-100">
        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 text-sm text-stone-600">
          <MessageCircleQuestion size={16} /> Need help? Chat with us
        </button>
        <button
          onClick={() => {
            setScreen("add-produce");
            onNavigate && onNavigate();
          }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-farm-800 text-white text-sm font-semibold hover:bg-farm-900"
        >
          <Plus size={16} /> Add Produce
        </button>
      </div>
    </>
  );
}

export default function Sidebar({ screen, setScreen, farmer, mobileOpen, closeMobile }) {
  return (
    <>
      {/* Permanent rail on desktop/tablet */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-stone-200 bg-white">
        <SidebarContent screen={screen} setScreen={setScreen} farmer={farmer} />
      </aside>

      {/* Slide-in drawer on mobile */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobile} />
          <aside className="relative w-72 max-w-[80%] bg-white flex flex-col h-full shadow-xl">
            <div className="flex justify-end px-3 pt-3">
              <button onClick={closeMobile} className="p-1.5 rounded-lg border border-stone-200 text-stone-600">
                <X size={16} />
              </button>
            </div>
            <SidebarContent screen={screen} setScreen={setScreen} farmer={farmer} onNavigate={closeMobile} />
          </aside>
        </div>
      )}
    </>
  );
}
