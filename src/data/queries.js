import { supabase } from "../lib/supabaseClient.js";
import { FARMER, LISTINGS, ORDERS, DELIVERY, NOTIFICATIONS, INSIGHTS } from "./mock.js";

async function safeFetch(table, fallback, query = (q) => q) {
  if (!supabase) return fallback;
  try {
    const { data, error } = await query(supabase.from(table).select("*"));
    if (error) {
      console.error(`[${table}] fetch error:`, error.message);
      return fallback;
    }
    return data ?? []; // empty table = empty array, NOT mock fallback
  } catch (err) {
    console.error(`[${table}] fetch threw:`, err);
    return fallback;
  }
}

export async function getFarmer() {
  if (!supabase) return FARMER;
  const { data: authData } = await supabase.auth.getUser();
  if (!authData?.user) return FARMER;
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("auth_id", authData.user.id)
    .single();
  if (error) {
    console.error("[farmers] fetch error:", error.message);
    return FARMER;
  }
  return data ?? FARMER;
}

export const getListings = () => safeFetch("listings", LISTINGS);
export const getOrders = () =>
  safeFetch("orders", ORDERS, (q) => q.order("created_at", { ascending: false }));
export const getNotifications = () =>
  safeFetch("notifications", NOTIFICATIONS, (q) =>
    q.order("created_at", { ascending: false }).limit(10)
  );
export const getInsights = () => safeFetch("insights", INSIGHTS);

export async function getDelivery() {
  const rows = await safeFetch("deliveries", [DELIVERY], (q) =>
    q.order("updated_at", { ascending: false }).limit(1)
  );
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

export async function getDashboardStats() {
  const [listings, orders] = await Promise.all([getListings(), getOrders()]);
  const today = new Date().toDateString();
  const todaysOrders = orders.filter(
    (o) => !o.created_at || new Date(o.created_at).toDateString() === today
  );
  return {
    todaysRevenue: todaysOrders.reduce((s, o) => s + Number(o.value || 0), 0),
    todaysOrderCount: todaysOrders.length,
    availableStockKg: listings
      .filter((l) => l.status === "Live")
      .reduce((s, l) => s + Number(l.qty || 0), 0),
    listingCount: listings.filter((l) => l.status === "Live").length,
    pendingPayment: orders
      .filter((o) => o.status !== "Delivered")
      .reduce((s, o) => s + (Number(o.value || 0) - Number(o.advance || 0)), 0),
    pendingCount: orders.filter((o) => o.status !== "Delivered").length,
  };
}
