import { useState } from "react";
import {
  User,
  MapPin,
  Bell,
  Globe,
  Wallet,
  ShieldCheck,
  ChevronRight,
  ChevronUp,
  LogOut,
  Camera,
  Check,
  X,
} from "lucide-react";
import ScreenHeader from "../components/ScreenHeader.jsx";
import { FARMER } from "../data/mock.js";

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-6 rounded-full shrink-0 transition-colors relative ${checked ? "bg-farm-800" : "bg-stone-300"}`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block mb-3 last:mb-0">
      <span className="text-xs text-stone-500 mb-1 block">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-farm-700/30"
      />
    </label>
  );
}

// Expandable row: header is clickable, and when open shows an inline edit form
// with real Save/Cancel behavior (draft state only commits on Save).
function EditableRow({ icon: Icon, label, sub, isOpen, onToggle, onSave, onCancel, children }) {
  return (
    <div className="border-b border-stone-100 last:border-0">
      <button onClick={onToggle} className="w-full flex items-center gap-3 py-3 text-left">
        <div className="w-9 h-9 rounded-full bg-farm-800/10 text-farm-800 flex items-center justify-center shrink-0">
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-stone-800">{label}</div>
          {sub && <div className="text-xs text-stone-500 truncate">{sub}</div>}
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-stone-400 shrink-0" />
        ) : (
          <ChevronRight size={16} className="text-stone-400 shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="pb-4 pl-12 pr-1">
          {children}
          <div className="flex gap-2 mt-1">
            <button
              onClick={onCancel}
              className="flex-1 flex items-center justify-center gap-1.5 border border-stone-300 text-stone-600 text-sm font-medium py-2 rounded-lg"
            >
              <X size={14} /> Cancel
            </button>
            <button
              onClick={onSave}
              className="flex-1 flex items-center justify-center gap-1.5 bg-farm-800 text-white text-sm font-semibold py-2 rounded-lg"
            >
              <Check size={14} /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ icon: Icon, label, sub, right }) {
  return (
    <div className="w-full flex items-center gap-3 py-3 border-b border-stone-100 last:border-0 text-left">
      <div className="w-9 h-9 rounded-full bg-farm-800/10 text-farm-800 flex items-center justify-center shrink-0">
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-stone-800">{label}</div>
        {sub && <div className="text-xs text-stone-500">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export default function Settings({ setScreen, openMenu }) {
  // Saved, "committed" values — what's actually displayed.
  const [personal, setPersonal] = useState({
    name: FARMER?.name || "Karthi",
    phone: "+91 98765 43210",
    address: "Plot 12, Periyanaickenpalayam, Coimbatore, TN",
  });
  const [farm, setFarm] = useState({
    location: "Coimbatore, TN",
    size: "4.5 acres",
  });
  const [bank, setBank] = useState({
    accountName: "Karthi S",
    accountNumber: "XXXX XXXX 4521",
    ifsc: "SBIN0001234",
    upi: "karthi@ybl",
  });

  // Which panel is expanded for editing, and its in-progress draft.
  const [editing, setEditing] = useState(null); // "personal" | "farm" | "bank" | null
  const [draft, setDraft] = useState({});

  const openEditor = (section) => {
    if (editing === section) {
      setEditing(null);
      return;
    }
    setDraft(section === "personal" ? personal : section === "farm" ? farm : bank);
    setEditing(section);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft({});
  };

  const saveEdit = (section) => {
    if (section === "personal") setPersonal(draft);
    if (section === "farm") setFarm(draft);
    if (section === "bank") setBank(draft);
    setEditing(null);
  };

  const setDraftField = (field) => (value) => setDraft((d) => ({ ...d, [field]: value }));

  const [orderAlerts, setOrderAlerts] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [deliveryAlerts, setDeliveryAlerts] = useState(true);
  const [aiTips, setAiTips] = useState(false);
  const [language, setLanguage] = useState("English");

  return (
    <div className="max-w-2xl mx-auto">
      <ScreenHeader title="Settings" setScreen={setScreen} openMenu={openMenu} />
      <h1 className="text-xl font-display font-semibold text-stone-800 mb-4">Settings</h1>

      {/* Profile */}
      <div className="bg-white border border-stone-200 rounded-card p-4 mb-5 flex items-center gap-4">
        <div className="relative shrink-0">
          <div className="w-16 h-16 rounded-full bg-farm-800 text-white flex items-center justify-center text-xl font-semibold">
            {personal.name?.[0] || "K"}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500">
            <Camera size={12} />
          </button>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">{personal.name}</span>
            <ShieldCheck size={14} className="text-farm-700" />
          </div>
          <div className="text-xs text-stone-500">Premium Farmer</div>
          <div className="flex items-center gap-1 text-xs text-farm-700 mt-1">
            <MapPin size={12} /> GPS Verified Farm
          </div>
        </div>
        <button onClick={() => openEditor("personal")} className="text-sm text-farm-700 font-medium shrink-0">
          Edit
        </button>
      </div>

      {/* Account */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 px-1">Account</h2>
        <div className="bg-white border border-stone-200 rounded-card px-4">
          <EditableRow
            icon={User}
            label="Personal Details"
            sub={`${personal.phone} · ${personal.address}`}
            isOpen={editing === "personal"}
            onToggle={() => openEditor("personal")}
            onSave={() => saveEdit("personal")}
            onCancel={cancelEdit}
          >
            <Field label="Name" value={draft.name || ""} onChange={setDraftField("name")} />
            <Field label="Phone" value={draft.phone || ""} onChange={setDraftField("phone")} />
            <Field label="Address" value={draft.address || ""} onChange={setDraftField("address")} />
          </EditableRow>

          <EditableRow
            icon={MapPin}
            label="Farm Location"
            sub={`${farm.location} · ${farm.size}`}
            isOpen={editing === "farm"}
            onToggle={() => openEditor("farm")}
            onSave={() => saveEdit("farm")}
            onCancel={cancelEdit}
          >
            <Field label="Location" value={draft.location || ""} onChange={setDraftField("location")} />
            <Field label="Farm Size" value={draft.size || ""} onChange={setDraftField("size")} />
            <div className="flex items-center gap-1.5 text-xs text-farm-700 mt-1">
              <ShieldCheck size={13} /> GPS Verified
            </div>
          </EditableRow>

          <EditableRow
            icon={Wallet}
            label="Bank & Payment Details"
            sub={`${bank.accountNumber} · ${bank.upi}`}
            isOpen={editing === "bank"}
            onToggle={() => openEditor("bank")}
            onSave={() => saveEdit("bank")}
            onCancel={cancelEdit}
          >
            <Field label="Account Holder Name" value={draft.accountName || ""} onChange={setDraftField("accountName")} />
            <Field label="Account Number" value={draft.accountNumber || ""} onChange={setDraftField("accountNumber")} />
            <Field label="IFSC Code" value={draft.ifsc || ""} onChange={setDraftField("ifsc")} />
            <Field label="UPI ID" value={draft.upi || ""} onChange={setDraftField("upi")} />
          </EditableRow>
        </div>
      </div>

      {/* Notifications */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 px-1">Notifications</h2>
        <div className="bg-white border border-stone-200 rounded-card px-4">
          <Row icon={Bell} label="Order Alerts" sub="New orders and status changes" right={<Toggle checked={orderAlerts} onChange={setOrderAlerts} />} />
          <Row icon={Bell} label="Price Alerts" sub="Market price swings for your crops" right={<Toggle checked={priceAlerts} onChange={setPriceAlerts} />} />
          <Row icon={Bell} label="Delivery Alerts" sub="Truck pickup and ETA updates" right={<Toggle checked={deliveryAlerts} onChange={setDeliveryAlerts} />} />
          <Row icon={Bell} label="AI Tips" sub="Daily selling suggestions" right={<Toggle checked={aiTips} onChange={setAiTips} />} />
        </div>
      </div>

      {/* Preferences */}
      <div className="mb-5">
        <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2 px-1">Preferences</h2>
        <div className="bg-white border border-stone-200 rounded-card px-4">
          <Row
            icon={Globe}
            label="Language"
            sub="App display language"
            right={
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="text-sm border border-stone-300 rounded-lg px-2 py-1 bg-white"
              >
                <option>English</option>
                <option>தமிழ் (Tamil)</option>
                <option>हिन्दी (Hindi)</option>
              </select>
            }
          />
        </div>
      </div>

      {/* Sign out */}
      <button className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 text-sm font-semibold py-2.5 rounded-lg mb-4">
        <LogOut size={15} /> Log Out
      </button>

      <p className="text-center text-xs text-stone-400 pb-4">FarmerAI · Agri Marketplace · v1.0</p>
    </div>
  );
}
