import { useEffect, useState } from "react";

/**
 * WeatherRibbon
 * Drop this at the top of Dashboard.jsx (above your existing stat cards).
 *
 * <WeatherRibbon lat={farmer?.lat} lon={farmer?.lon} />
 *
 * - No API key needed: uses Open-Meteo (free, no auth).
 * - If lat/lon aren't passed, it tries browser geolocation, then falls
 *   back to a default location so the ribbon never breaks the dashboard.
 * - Caches the result in sessionStorage for 30 min per location so you
 *   don't refetch on every nav.
 */

const FALLBACK_LOCATION = { lat: 28.6139, lon: 77.209, label: "Delhi, IN" }; // swap to your primary market
const CACHE_MS = 30 * 60 * 1000;

const WMO_ICON = (code) => {
  if (code === 0) return { icon: SunIcon, label: "Clear" };
  if ([1, 2].includes(code)) return { icon: SunCloudIcon, label: "Partly cloudy" };
  if (code === 3) return { icon: CloudIcon, label: "Overcast" };
  if ([45, 48].includes(code)) return { icon: FogIcon, label: "Fog" };
  if ([51, 53, 55, 56, 57].includes(code)) return { icon: DrizzleIcon, label: "Drizzle" };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { icon: RainIcon, label: "Rain" };
  if ([66, 67].includes(code)) return { icon: RainIcon, label: "Freezing rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { icon: SnowIcon, label: "Snow" };
  if ([95, 96, 99].includes(code)) return { icon: StormIcon, label: "Thunderstorm" };
  return { icon: CloudIcon, label: "Cloudy" };
};

function advisory({ precipProbMax, tMax, windMax }) {
  if (precipProbMax >= 60)
    return { text: "Rain likely — delay spraying & hold off harvest", tone: "warn" };
  if (windMax >= 30)
    return { text: "High wind expected — postpone spraying", tone: "warn" };
  if (tMax >= 38)
    return { text: "Heat stress risk — irrigate early morning or evening", tone: "warn" };
  if (precipProbMax <= 20 && tMax < 35)
    return { text: "Good conditions for fieldwork & harvest", tone: "good" };
  return { text: "Conditions look manageable — check crop-specific advice", tone: "neutral" };
}

export default function WeatherRibbon({ lat, lon, locationLabel }) {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  const useLat = lat ?? FALLBACK_LOCATION.lat;
  const useLon = lon ?? FALLBACK_LOCATION.lon;
  const label = locationLabel ?? (lat ? undefined : FALLBACK_LOCATION.label);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const cacheKey = `weather:${useLat.toFixed(2)},${useLon.toFixed(2)}`;
      try {
        const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
        if (cached && Date.now() - cached.ts < CACHE_MS) {
          if (!cancelled) setState({ status: "ready", data: cached.data, error: null });
          return;
        }
      } catch {
        /* ignore bad cache */
      }

      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", useLat);
        url.searchParams.set("longitude", useLon);
        url.searchParams.set("current", "temperature_2m,weather_code");
        url.searchParams.set(
          "daily",
          "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max"
        );
        url.searchParams.set("timezone", "auto");

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`Weather API ${res.status}`);
        const json = await res.json();

        const data = {
          current: {
            temp: Math.round(json.current.temperature_2m),
            code: json.current.weather_code,
          },
          today: {
            max: Math.round(json.daily.temperature_2m_max[0]),
            min: Math.round(json.daily.temperature_2m_min[0]),
            code: json.daily.weather_code[0],
          },
          tomorrow: {
            max: Math.round(json.daily.temperature_2m_max[1]),
            min: Math.round(json.daily.temperature_2m_min[1]),
            code: json.daily.weather_code[1],
            precipProb: json.daily.precipitation_probability_max[1],
            windMax: Math.round(json.daily.wind_speed_10m_max[1]),
          },
        };

        sessionStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), data }));
        if (!cancelled) setState({ status: "ready", data, error: null });
      } catch (err) {
        if (!cancelled) setState({ status: "error", data: null, error: err.message });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [useLat, useLon]);

  if (state.status === "loading") {
    return (
      <div className="w-full rounded-xl bg-slate-800/60 border border-slate-700/60 px-4 py-3 mb-4 animate-pulse">
        <div className="h-5 w-48 bg-slate-700/60 rounded" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="w-full rounded-xl bg-slate-800/60 border border-slate-700/60 px-4 py-3 mb-4 text-sm text-slate-400">
        Weather unavailable right now — check crop advisory manually.
      </div>
    );
  }

  const { current, today, tomorrow } = state.data;
  const currentIcon = WMO_ICON(current.code);
  const tomorrowIcon = WMO_ICON(tomorrow.code);
  const advice = advisory({
    precipProbMax: tomorrow.precipProb,
    tMax: tomorrow.max,
    windMax: tomorrow.windMax,
  });

  const toneClasses = {
    good: "bg-emerald-500/10 border-emerald-500/30 text-emerald-300",
    warn: "bg-amber-500/10 border-amber-500/30 text-amber-300",
    neutral: "bg-slate-500/10 border-slate-500/30 text-slate-300",
  }[advice.tone];

  return (
    <div className="w-full rounded-xl bg-slate-800/60 border border-slate-700/60 px-4 py-3 mb-4 flex flex-wrap items-center gap-4">
      {/* Today */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-700/60">
        <currentIcon.icon className="w-8 h-8 text-sky-300" />
        <div>
          <div className="text-xs text-slate-400 leading-tight">
            {label ?? "Today"} · {currentIcon.label}
          </div>
          <div className="text-lg font-semibold text-slate-100 leading-tight">
            {current.temp}°
            <span className="text-xs text-slate-400 font-normal ml-1">
              H{today.max}° / L{today.min}°
            </span>
          </div>
        </div>
      </div>

      {/* Tomorrow — the enhancement */}
      <div className="flex items-center gap-2 pr-4 border-r border-slate-700/60">
        <tomorrowIcon.icon className="w-8 h-8 text-indigo-300" />
        <div>
          <div className="text-xs text-slate-400 leading-tight">
            Tomorrow · {tomorrowIcon.label}
          </div>
          <div className="text-lg font-semibold text-slate-100 leading-tight">
            H{tomorrow.max}° / L{tomorrow.min}°
            <span className="text-xs text-slate-400 font-normal ml-1">
              {tomorrow.precipProb}% rain
            </span>
          </div>
        </div>
      </div>

      {/* Advisory */}
      <div className={`flex-1 min-w-[220px] rounded-lg border px-3 py-1.5 text-sm font-medium ${toneClasses}`}>
        {advice.text}
      </div>
    </div>
  );
}

/* --- minimal inline icon set (no extra dependency) --- */
function iconBase(children) {
  return function Icon({ className }) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.6">
        {children}
      </svg>
    );
  };
}

const SunIcon = iconBase(
  <>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" strokeLinecap="round" />
  </>
);
const SunCloudIcon = iconBase(
  <>
    <circle cx="8" cy="9" r="3" />
    <path d="M6 9v0" />
    <path d="M7 17h10a3 3 0 000-6 4 4 0 00-7.5-1.3" strokeLinecap="round" strokeLinejoin="round" />
  </>
);
const CloudIcon = iconBase(
  <path d="M6 17h11a3.5 3.5 0 000-7 5 5 0 00-9.6-1.5A4 4 0 006 17z" strokeLinecap="round" strokeLinejoin="round" />
);
const FogIcon = iconBase(
  <>
    <path d="M6 15h12M4 18h16M8 12h9" strokeLinecap="round" />
  </>
);
const DrizzleIcon = iconBase(
  <>
    <path d="M6 13h11a3.5 3.5 0 000-7 5 5 0 00-9.6-1.5A4 4 0 006 13z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 18v2M13 18v2M17 18v2" strokeLinecap="round" />
  </>
);
const RainIcon = iconBase(
  <>
    <path d="M6 12h11a3.5 3.5 0 000-7 5 5 0 00-9.6-1.5A4 4 0 006 12z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 17l-1.5 3M13 17l-1.5 3M18 17l-1.5 3" strokeLinecap="round" />
  </>
);
const SnowIcon = iconBase(
  <>
    <path d="M6 12h11a3.5 3.5 0 000-7 5 5 0 00-9.6-1.5A4 4 0 006 12z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 18v3M9 18l-1.5 1M9 18l1.5 1M15 18v3M15 18l-1.5 1M15 18l1.5 1" strokeLinecap="round" />
  </>
);
const StormIcon = iconBase(
  <>
    <path d="M6 11h11a3.5 3.5 0 000-7 5 5 0 00-9.6-1.5A4 4 0 006 11z" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 13l-3 5h3l-2 4" strokeLinecap="round" strokeLinejoin="round" />
  </>
);
