import { LayoutDashboard, PackageSearch, Plus, Wallet, Bot } from "lucide-react";

const ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "orders", label: "Orders", icon: PackageSearch },
  { id: "add-produce", label: "Add Produce", icon: Plus, primary: true },
  { id: "payments", label: "Payments", icon: Wallet },
  { id: "ai", label: "AI Assistant", icon: Bot },
];

export default function BottomNav({ screen, setScreen }) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-farm-900 flex justify-around py-2 z-10">
      {ITEMS.map(({ id, label, icon: Icon, primary }) => (
        <button
          key={id}
          onClick={() => setScreen(id)}
          className={`flex flex-col items-center gap-0.5 text-[10px] px-2 py-1 rounded-lg ${
            primary
              ? "bg-farm-700 text-white px-3"
              : screen === id
              ? "text-amber-300"
              : "text-stone-300"
          }`}
        >
          <Icon size={16} />
          {label}
        </button>
      ))}
    </nav>
  );
}
