import { Menu, Bell } from "lucide-react";

export default function ScreenHeader({ title, setScreen, openMenu }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <button onClick={openMenu} className="p-1.5 rounded-lg border border-stone-200 text-stone-600 md:hidden">
          <Menu size={16} />
        </button>
        <span className="font-display font-semibold text-stone-800">{title}</span>
      </div>
      <button
        onClick={() => setScreen && setScreen("notifications")}
        className="relative p-1.5 rounded-lg border border-stone-200 text-stone-600"
      >
        <Bell size={16} />
        <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
          12
        </span>
      </button>
    </div>
  );
}
