import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";
import { getFarmerProfile, onAuthStateChange } from "../lib/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(undefined); // undefined = not checked yet
  const [farmer, setFarmer] = useState(null);
  const [farmerLoading, setFarmerLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setSession(null);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const unsubscribe = onAuthStateChange((s) => setSession(s));
    return unsubscribe;
  }, []);

 useEffect(() => {
  if (!session?.user) {
    setFarmer(null);
    return;
  }
  let cancelled = false;
  setFarmerLoading(true);
  console.log("[useAuth] fetching farmer for auth user:", session.user.id);
  getFarmerProfile(session.user.id)
    .then((f) => {
      console.log("[useAuth] getFarmerProfile resolved with:", f);
      if (!cancelled) setFarmer(f);
    })
    .catch((err) => {
      console.log("[useAuth] getFarmerProfile REJECTED:", err);
      if (!cancelled) setFarmer(null);
    })
    .finally(() => !cancelled && setFarmerLoading(false));
  return () => {
    cancelled = true;
  };
}, [session?.user?.id]);

  const value = {
    supabaseConfigured: !!supabase,
    session,
    sessionChecked: session !== undefined,
    user: session?.user ?? null,
    farmer,
    farmerLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
