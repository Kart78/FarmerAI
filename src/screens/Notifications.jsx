import { Bell } from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { NOTIFICATIONS } from "../data/mock.js";

export default function Notifications({ setScreen, openMenu }) {
  return (
    <div>
      <ScreenHeader title="Notifications" setScreen={setScreen} openMenu={openMenu} />
      <div className="bg-white border border-stone-200 rounded-card p-4 max-w-lg">
        {NOTIFICATIONS.map((n, i) => (
          <div key={i} className="flex gap-3 py-3 border-b border-stone-100 last:border-0">
            <Bell size={16} className="text-farm-700 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-stone-700">{n.text}</p>
              <p className="text-xs text-stone-400 mt-0.5">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
