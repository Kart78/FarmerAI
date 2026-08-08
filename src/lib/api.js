import { supabase } from "./supabaseClient.js";

function requireClient() {
  if (!supabase) {
    throw new Error(
      "Supabase isn't configured. Copy .env.example to .env, add your project URL + anon key, and restart the dev server."
    );
  }
  return supabase;
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export async function getSession() {
  const client = requireClient();
  const { data, error } = await client.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  const client = requireClient();
  const { data } = client.auth.onAuthStateChange((_event, session) => callback(session));
  return () => data.subscription.unsubscribe();
}

export async function signInWithOtp(email) {
  const client = requireClient();
  const { error } = await client.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function signInWithPhoneOtp(phone) {
  const client = requireClient();
  const { error } = await client.auth.signInWithOtp({ phone });
  if (error) throw error;
}

export async function verifyPhoneOtp(phone, token) {
  const client = requireClient();
  const { data, error } = await client.auth.verifyOtp({ phone, token, type: "sms" });
  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const client = requireClient();
  const { error } = await client.auth.signOut();
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Farmer profile
// farmers.id is its own uuid; the signed-in Supabase Auth user is linked via
// farmers.auth_id, NOT farmers.id. Every farmer-scoped query below therefore
// needs the farmer's *row id* (farmers.id), which we look up once via
// getFarmerProfile() and then reuse — not the raw auth user id.
// ---------------------------------------------------------------------------
export async function getFarmerProfile(authUserId) {
  const client = requireClient();
  const { data, error } = await client
    .from("farmers")
    .select("*")
    .eq("auth_id", authUserId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Market prices (public catalog, keyed by the short veg id e.g. "tomato")
// ---------------------------------------------------------------------------
export async function getMarketPrices() {
  const client = requireClient();
  const { data, error } = await client.from("market_prices").select("*");
  if (error) throw error;
  const byVeg = {};
  (data ?? []).forEach((row) => {
    byVeg[row.veg] = row;
  });
  return byVeg;
}

// ---------------------------------------------------------------------------
// Listings
// farmerId here is always farmers.id (the row id), not the auth user id.
// ---------------------------------------------------------------------------
export async function getListings(farmerId) {
  const client = requireClient();
  const { data, error } = await client
    .from("listings")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createListing(farmerId, listing) {
  const client = requireClient();
  const { data, error } = await client
    .from("listings")
    .insert({ farmer_id: farmerId, ...listing })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function getOrders(farmerId) {
  const client = requireClient();
  const { data, error } = await client
    .from("orders")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function acceptOrder(orderId) {
  const client = requireClient();
  const { data, error } = await client
    .from("orders")
    .update({ status: "Accepted" })
    .eq("id", orderId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ---------------------------------------------------------------------------
// Deliveries
// deliveries has no farmer_id or status column of its own — it's scoped and
// filtered through its parent order instead (orders.farmer_id, orders.status).
// ---------------------------------------------------------------------------
export async function getActiveDeliveries(farmerId) {
  const client = requireClient();
  const { data, error } = await client
    .from("deliveries")
    .select("*, orders!inner(id, farmer_id, status, buyer, item, value)")
    .eq("orders.farmer_id", farmerId)
    .eq("orders.status", "In Transit")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Notifications
// Note: the message column is named `text`, not `message`.
// ---------------------------------------------------------------------------
export async function getNotifications(farmerId) {
  const client = requireClient();
  const { data, error } = await client
    .from("notifications")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export function unreadNotificationCount(notifications) {
  return notifications.filter((n) => !n.read).length;
}

// ---------------------------------------------------------------------------
// Insights (AI Assistant cards)
// Note: the message column is named `text`, and the vegetable column `veg`.
// ---------------------------------------------------------------------------
export async function getInsights(farmerId) {
  const client = requireClient();
  const { data, error } = await client
    .from("insights")
    .select("*")
    .eq("farmer_id", farmerId)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}

// ---------------------------------------------------------------------------
// AI chat — routed through the ai-assistant Edge Function
// ---------------------------------------------------------------------------
export async function askAssistant(message, farmerName) {
  const client = requireClient();
  const { data, error } = await client.functions.invoke("ai-assistant", {
    body: { message, farmerName },
  });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data.reply;
}

// ---------------------------------------------------------------------------
// Dashboard aggregates — computed from real rows, never hardcoded
// ---------------------------------------------------------------------------
export async function getDashboardStats(farmerId) {
  const [listings, orders] = await Promise.all([getListings(farmerId), getOrders(farmerId)]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysOrders = orders.filter((o) => o.created_at?.slice(0, 10) === todayStr);
  const todaysRevenue = todaysOrders.reduce((sum, o) => sum + Number(o.value || 0), 0);
  const availableStock = listings
    .filter((l) => l.status === "Live")
    .reduce((sum, l) => sum + Number(l.qty || 0), 0);
  const liveItemCount = new Set(listings.filter((l) => l.status === "Live").map((l) => l.veg)).size;
  const pendingOrders = orders.filter((o) => o.status !== "Delivered");
  const pendingPayment = pendingOrders.reduce(
    (sum, o) => sum + (Number(o.value || 0) - Number(o.advance || 0)),
    0
  );

  return {
    todaysRevenue,
    todaysOrderCount: todaysOrders.length,
    availableStock,
    liveItemCount,
    pendingPayment,
    pendingPaymentCount: pendingOrders.length,
    listings,
    orders,
  };
}
