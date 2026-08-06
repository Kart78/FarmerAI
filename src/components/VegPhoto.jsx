import { useState } from "react";
import { Leaf } from "lucide-react";

export default function VegPhoto({ src, alt, color = "bg-farm-800/10", size = 56, rounded = "rounded-lg", className = "" }) {
  const [failed, setFailed] = useState(false);
  const style = { width: size, height: size };

  if (failed || !src) {
    return (
      <div
        style={style}
        className={`${rounded} ${color} flex items-center justify-center text-farm-800 shrink-0 ${className}`}
      >
        <Leaf size={Math.round(size * 0.4)} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      style={style}
      className={`${rounded} object-cover shrink-0 ${className}`}
    />
  );
}
