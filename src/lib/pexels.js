const PEXELS_KEY = import.meta.env.VITE_PEXELS_API_KEY;
const CACHE_PREFIX = "vegphoto:";
const CACHE_MS = 7 * 24 * 60 * 60 * 1000; // photos don't change — cache a week

export async function getVegetablePhoto(vegName) {
  if (!PEXELS_KEY) return null;

  const cacheKey = `${CACHE_PREFIX}${vegName.toLowerCase()}`;
  try {
    const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");
    if (cached && Date.now() - cached.ts < CACHE_MS) return cached.url;
  } catch {}

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(vegName + " vegetable fresh")}&per_page=1&orientation=square`,
      { headers: { Authorization: PEXELS_KEY } }
    );
    if (!res.ok) throw new Error(`Pexels ${res.status}`);
    const json = await res.json();
    const url = json.photos?.[0]?.src?.medium ?? null;
    if (url) localStorage.setItem(cacheKey, JSON.stringify({ ts: Date.now(), url }));
    return url;
  } catch (err) {
    console.error(`[pexels] ${vegName}:`, err.message);
    return null;
  }
}
