import { useEffect, useState } from "react";
import { getVegetablePhoto } from "../lib/pexels.js";

export default function VegPhoto({ src, alt, color, size = 48, vegName }) {
  const [photoUrl, setPhotoUrl] = useState(src || null);

  useEffect(() => {
    if (src) return; // already have an explicit photo (e.g. Supabase-stored URL)
    if (!vegName) return;
    let cancelled = false;
    getVegetablePhoto(vegName).then((url) => {
      if (!cancelled && url) setPhotoUrl(url);
    });
    return () => { cancelled = true; };
  }, [src, vegName]);

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={alt}
        width={size}
        height={size}
        className="rounded-lg object-cover"
        style={{ width: size, height: size }}
        loading="lazy"
      />
    );
  }

  // No API key / fetch failed — clean color swatch, not a broken image icon
  const isHex = typeof color === "string" && color.startsWith("#");
  return (
    <div
      className={`rounded-lg flex items-center justify-center text-xs text-stone-500 ${isHex ? "" : color || "bg-stone-100"}`}
      style={{ width: size, height: size, backgroundColor: isHex ? color : undefined }}
    >
      {alt?.[0] ?? "?"}
    </div>
  );
}
