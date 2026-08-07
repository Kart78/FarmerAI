import { useState } from "react";
import {
  Search,
  Plus,
  Check,
  Camera,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import VegPhoto from "./VegPhoto.jsx";

// Shown by default, no search needed — keeps the grid to 9 tiles + Add New so it fits without scrolling.
const DEFAULT_VEGETABLES = [
  { id: "tomato", name: "Tomato", color: "#dc2626" },
  { id: "onion", name: "Onion", color: "#9333ea" },
  { id: "potato", name: "Potato", color: "#d97706" },
  { id: "brinjal", name: "Brinjal (Eggplant)", color: "#7c3aed" },
  { id: "okra", name: "Okra", color: "#14532d" },
  { id: "spinach", name: "Spinach", color: "#16a34a" },
  { id: "cabbage", name: "Cabbage", color: "#84cc16" },
  { id: "cauliflower", name: "Cauliflower", color: "#f5f5f4" },
  { id: "carrot", name: "Carrot", color: "#ea580c" },
];

// Only surfaced when the farmer searches for them by name.
const MORE_VEGETABLES = [
  { id: "chili", name: "Green Chili", color: "#16a34a" },
  { id: "cucumber", name: "Cucumber", color: "#65a30d" },
  { id: "capsicum", name: "Capsicum", color: "#15803d" },
  { id: "beans", name: "Beans", color: "#4d7c0f" },
  { id: "peas", name: "Green Peas", color: "#65a30d" },
  { id: "radish", name: "Radish", color: "#f1f5f9" },
  { id: "beetroot", name: "Beetroot", color: "#9f1239" },
  { id: "bittergourd", name: "Bitter Gourd", color: "#166534" },
  { id: "bottlegourd", name: "Bottle Gourd", color: "#a3e635" },
  { id: "pumpkin", name: "Pumpkin", color: "#c2410c" },
  { id: "garlic", name: "Garlic", color: "#f5f5f4" },
  { id: "ginger", name: "Ginger", color: "#ca8a04" },
  { id: "sweetpotato", name: "Sweet Potato", color: "#b45309" },
  { id: "drumstick", name: "Drumstick", color: "#4d7c0f" },
];

const ALL_VEGETABLES = [...DEFAULT_VEGETABLES, ...MORE_VEGETABLES];

const UNITS = ["Kg", "Quintal", "Dozen", "Bundle"];
const STEP_LABELS = ["Select Vegetable", "Enter Quantity", "Set Your Price", "Harvested", "Add Photo"];
const MARKET_PRICE = 31;
const SUGGESTED_PRICE = 30;

function StepDots({ step }) {
  return (
    <div className="flex items-center mb-5">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-initial">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
              i < step
                ? "bg-farm-700 text-white"
                : i === step
                ? "bg-farm-800 text-white"
                : "bg-stone-200 text-stone-500"
            }`}
          >
            {i < step ? <Check size={13} /> : i + 1}
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 ${i < step ? "bg-farm-700" : "bg-stone-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepCard({ number, title, children }) {
  return (
    <div className="bg-white border border-stone-200 rounded-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-6 h-6 rounded-full bg-farm-800 text-white text-xs font-semibold flex items-center justify-center shrink-0">
          {number}
        </span>
        <h3 className="font-display text-base text-stone-800">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function NextButton({ onClick, disabled, label = "Next" }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full mt-5 bg-farm-800 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
    >
      {label}
    </button>
  );
}

export default function SellingWorkflow({ onPublished }) {
  const [step, setStep] = useState(0); // 0-4 = steps, 5 = preview
  const [search, setSearch] = useState("");
  const [veg, setVeg] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("Kg");
  const [price, setPrice] = useState("");
  const [harvested, setHarvested] = useState("Today");
  const [harvestDate, setHarvestDate] = useState("");
  const [photos, setPhotos] = useState([]);

  const query = search.trim().toLowerCase();
  const visibleVegetables = query
    ? ALL_VEGETABLES.filter((v) => v.name.toLowerCase().includes(query))
    : DEFAULT_VEGETABLES;

  const priceDiffPct = price ? Math.round(((MARKET_PRICE - Number(price)) / MARKET_PRICE) * 100) : null;

  const reset = () => {
    setStep(0);
    setSearch("");
    setVeg(null);
    setQuantity("");
    setUnit("Kg");
    setPrice("");
    setHarvested("Today");
    setHarvestDate("");
    setPhotos([]);
  };

  const addPhoto = () => {
    if (photos.length >= 4) return;
    setPhotos((p) => [...p, veg?.color || "#84cc16"]);
  };

  const publish = () => {
    onPublished && onPublished();
    reset();
  };

  return (
    <div>
      <StepDots step={step > 4 ? 4 : step} />

      {step === 0 && (
        <StepCard number={1} title="Select Vegetable">
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search vegetable..."
              className="w-full border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-farm-700/30"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            {visibleVegetables.map((v) => (
              <button
                key={v.id}
                onClick={() => {
                  setVeg(v);
                  setStep(1);
                }}
                className={`rounded-xl border p-2 flex flex-col items-center gap-1.5 text-center transition-colors ${
                  veg?.id === v.id ? "border-farm-700 bg-farm-50/60 ring-1 ring-farm-700" : "border-stone-200 hover:border-stone-300"
                }`}
              >
                {/* vegName added so VegPhoto's Pexels lookup actually fires */}
                <VegPhoto alt={v.name} color={v.color} size={48} vegName={v.name} />
                <span className="text-xs font-medium text-stone-800 leading-tight">{v.name}</span>
              </button>
            ))}
            {visibleVegetables.length === 0 && (
              <p className="col-span-3 text-sm text-stone-400 text-center py-4">No matches. Try Add New below.</p>
            )}
          </div>

          <button
            onClick={() => {
              const name = search.trim() || "Custom Vegetable";
              const custom = { id: "custom-" + Date.now(), name, color: "#78716c" };
              setVeg(custom);
              setStep(1);
            }}
            className="w-full mt-3 border border-dashed border-stone-300 text-stone-500 rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-medium hover:border-farm-700 hover:text-farm-700"
          >
            <Plus size={15} /> Add New Vegetable
          </button>
        </StepCard>
      )}

      {step === 1 && veg && (
        <StepCard number={2} title="Enter Quantity">
          <div className="flex flex-col items-center gap-2 mb-4">
            {/* vegName added */}
            <VegPhoto alt={veg.name} color={veg.color} size={64} vegName={veg.name} />
            <span className="font-semibold text-stone-800">{veg.name}</span>
          </div>

          <label className="text-xs text-stone-500 mb-1 block">Available Quantity</label>
          <div className="flex gap-2 mb-2">
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className="flex-1 border border-stone-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-farm-700/30"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border border-stone-300 rounded-lg px-2 py-2.5 text-sm bg-white"
            >
              {UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-stone-400 mb-2">Tip: Buyers prefer more than 100 Kg</p>

          <div className="flex gap-2 mt-3">
            <button onClick={() => setStep(0)} className="border border-stone-300 text-stone-600 rounded-lg px-3 py-2.5">
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => setStep(2)}
              disabled={!quantity}
              className="flex-1 bg-farm-800 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold py-2.5 rounded-lg"
            >
              Next
            </button>
          </div>
        </StepCard>
      )}

      {step === 2 && veg && (
        <StepCard number={3} title="Set Your Price">
          <div className="text-center mb-3">
            <span className="text-sm text-stone-500">{veg.name}</span>
          </div>
          <label className="text-xs text-stone-500 mb-1 block">Your Price</label>
          <div className="flex items-center border border-stone-300 rounded-lg px-3 mb-3 focus-within:ring-2 focus-within:ring-farm-700/30">
            <span className="text-stone-500 mr-1">₹</span>
            <input
              type="number"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0"
              className="flex-1 py-2.5 text-sm focus:outline-none"
            />
            <span className="text-stone-400 text-sm">/ {unit}</span>
          </div>

          <div className="bg-farm-50 border border-farm-700/20 rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Sparkles size={13} className="text-farm-700" />
              <span className="text-xs font-semibold text-farm-700">AI Suggestion · Best Price</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
              <span>Market Price</span>
              <span className="font-mono">₹{MARKET_PRICE} / {unit}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Suggested Price</span>
              <span className="font-mono">₹{SUGGESTED_PRICE} / {unit}</span>
            </div>
            {priceDiffPct !== null && priceDiffPct !== 0 && (
              <p className="text-xs text-farm-700 font-medium mt-2">
                {priceDiffPct > 0
                  ? `You are ${priceDiffPct}% below market price`
                  : `You are ${Math.abs(priceDiffPct)}% above market price`}
              </p>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(1)} className="border border-stone-300 text-stone-600 rounded-lg px-3 py-2.5">
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!price}
              className="flex-1 bg-farm-800 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold py-2.5 rounded-lg"
            >
              Next
            </button>
          </div>
        </StepCard>
      )}

      {step === 3 && (
        <StepCard number={4} title="Harvested">
          <p className="text-xs text-stone-500 mb-3">When was it harvested?</p>
          <div className="space-y-2 mb-3">
            {["Today", "Yesterday", "Pick a Date"].map((opt) => (
              <label
                key={opt}
                className={`flex items-center gap-3 border rounded-lg px-3 py-2.5 cursor-pointer text-sm ${
                  harvested === opt ? "border-farm-700 bg-farm-50/60" : "border-stone-200"
                }`}
              >
                <input
                  type="radio"
                  name="harvested"
                  checked={harvested === opt}
                  onChange={() => setHarvested(opt)}
                  className="accent-farm-800"
                />
                {opt}
              </label>
            ))}
            {harvested === "Pick a Date" && (
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm"
              />
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(2)} className="border border-stone-300 text-stone-600 rounded-lg px-3 py-2.5">
              <ArrowLeft size={16} />
            </button>
            <button
              onClick={() => setStep(4)}
              disabled={harvested === "Pick a Date" && !harvestDate}
              className="flex-1 bg-farm-800 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-semibold py-2.5 rounded-lg"
            >
              Next
            </button>
          </div>
        </StepCard>
      )}

      {step === 4 && veg && (
        <StepCard number={5} title="Add Photo">
          <p className="text-xs text-stone-500 mb-3">Add a clear photo</p>
          <button
            onClick={addPhoto}
            className="w-full h-32 border-2 border-dashed border-stone-300 rounded-xl flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-farm-700 hover:text-farm-700 mb-3"
          >
            <Camera size={22} />
            <span className="text-xs">Tap to add photo</span>
          </button>

          {photos.length > 0 && (
            <div className="mb-3">
              <p className="text-xs text-stone-400 mb-1.5">Added ({photos.length}/4)</p>
              <div className="flex gap-2">
                {photos.map((c, i) => (
                  // vegName added
                  <VegPhoto key={i} alt={veg.name} color={c} size={44} vegName={veg.name} />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <button onClick={() => setStep(3)} className="border border-stone-300 text-stone-600 rounded-lg px-3 py-2.5">
              <ArrowLeft size={16} />
            </button>
            <NextButton onClick={() => setStep(5)} label="Preview" />
          </div>
        </StepCard>
      )}

      {step === 5 && veg && (
        <div className="bg-white border border-stone-200 rounded-card p-4">
          <h3 className="font-display text-base text-stone-800 mb-3">Preview & Publish</h3>
          <div className="flex items-center gap-3 mb-4">
            {/* vegName added */}
            <VegPhoto alt={veg.name} color={veg.color} size={56} vegName={veg.name} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-800">{veg.name}</span>
                <span className="text-[10px] bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">Live</span>
              </div>
              <div className="text-sm text-stone-500 font-mono">{quantity} {unit} · ₹{price}/{unit}</div>
            </div>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-500">Quantity</span>
              <span className="text-stone-800 font-medium">{quantity} {unit}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-500">Price</span>
              <span className="text-stone-800 font-medium">₹{price} / {unit}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-500">Harvested</span>
              <span className="text-stone-800 font-medium">{harvested === "Pick a Date" ? harvestDate || "—" : harvested}</span>
            </div>
            <div className="flex items-center gap-1.5 text-farm-700 text-xs pt-1">
              <ShieldCheck size={13} /> GPS Verified Location
            </div>
          </div>

          <p className="text-xs text-stone-400 mb-3">By publishing, you agree to our terms.</p>

          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 border border-stone-300 text-stone-600 rounded-lg py-2.5 text-sm font-semibold"
            >
