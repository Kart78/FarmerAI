import { useEffect, useState } from "react";
import { CloudRain, Cloud, CloudSun, Sun, CloudSnow, CloudFog, Zap } from "lucide-react";

const FALLBACK_LOCATION = { lat: 28.6139, lon: 77.209, label: "Delhi, IN" };
const CACHE_MS = 30 * 60 * 1000;

const WMO_ICON = (code) => {
  if (code === 0) return { Icon: Sun, label: "Clear" };
  if ([1, 2].includes(code)) return { Icon: CloudSun, label: "Partly cloudy" };
  if (code === 3) return { Icon: Cloud, label: "Overcast" };
  if ([45, 48].includes(code)) return { Icon: CloudFog, label: "Fog" };
  if ([51, 53, 55, 56, 57, 61, 63, 65, 80, 81, 82, 66, 67].includes(code))
    return { Icon: CloudRain, label: "Rain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { Icon: CloudSnow, label: "Snow" };
  if ([95, 96, 99].includes(code)) return { Icon: Zap, label: "Thunderstorm" };
  return { Icon: Cloud, label: "Cloudy" };
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
  const [state, setState] = useState({ status: "loading", data: null });

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
          if (!cancelled) setState({ status: "ready", data: cached.data });
          return;
        }
      } catch {}

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
          current: { temp: Math.round(json.current.temperature_2m), code: json.current.weather_code },
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
        if (!cancelled) setState({ status: "ready", data });
      } catch (err) {
        if (!cancelled) setState({ status: "error", data: null });
      }
    }

    load();
    return () => { cancelled = true; };
  }, [useLat, useLon]);

  if (state.status === "loading") {
    return (
      <div className="bg-white border border-stone-200 rounded-card p-4 animate-pulse">
        <div className="h-5 w-48 bg-stone-100 rounded" />
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="bg-white border border-stone-200 rounded-card p-4 text-sm text-stone-500">
        Weather unavailable right now — check crop advisory manually.
      </div>
    );
  }

  const { current, today, tomorrow } = state.data;
  const CurrentIcon = WMO_ICON(current.code).Icon;
  const TomorrowIcon = WMO_ICON(tomorrow.code).Icon;
  const advice = advisory({
    precipProbMax: tomorrow.precipProb,
    tMax: tomorrow.max,
    windMax: tomorrow.windMax,
  });

  const toneClasses = {
    good: "bg-green-50 border-green-200 text-green-700",
    warn: "bg-amber-50 border-amber-200 text-amber-700",
    neutral: "bg-stone-50 border-stone-200 text-stone-600",
  }[advice.tone];

  return (
    <div className="bg-white border border-stone-200 rounded-card p-4 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2 pr-4 border-r border-stone-200">
        <CurrentIcon size={28} className="text-farm-700" />
        <div>
          <div className="text-xs text-stone-500 leading-tight">
            {label ?? "Today"} · {WMO_ICON(current.code).label}
          </div>
          <div className="text-lg font-bold text-stone-800 leading-tight">
            {current.temp}°
            <span className="text-xs text-stone-500 font-normal ml-1">
              H{today.max}° / L{today.min}°
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 pr-4 border-r border-stone-200">
        <TomorrowIcon size={28} className="text-stone-500" />
        <div>
          <div className="text-xs text-stone-500 leading-tight">
            Tomorrow · {WMO_ICON(tomorrow.code).label}
          </div>
          <div className="text-lg font-bold text-stone-800 leading-tight">
            H{tomorrow.max}° / L{tomorrow.min}°
            <span className="text-xs text-stone-500 font-normal ml-1">
              {tomorrow.precipProb}% rain
            </span>
          </div>
        </div>
      </div>

      <div className={`flex-1 min-w-[220px] rounded-card border px-3 py-1.5 text-sm font-medium ${toneClasses}`}>
        {advice.text}
      </div>
    </div>
  );
}
