import { useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

export default function Login({ onLoggedIn }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("phone"); // phone | otp
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const normalizedPhone = phone.startsWith("+") ? phone : `+91${phone.replace(/\D/g, "")}`;

  async function sendOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: normalizedPhone });
    setLoading(false);
    if (error) return setError(error.message);
    setStage("otp");
  }

  async function verifyOtp(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalizedPhone,
      token: otp,
      type: "sms",
    });
    setLoading(false);
    if (error) return setError(error.message);
    onLoggedIn?.(data.session);
  }

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white border border-stone-200 rounded-card p-6">
      <h1 className="font-display text-xl text-stone-800 mb-1">FarmerAI</h1>
      <p className="text-sm text-stone-500 mb-6">
        {stage === "phone" ? "Enter your phone number to sign in" : "Enter the code we texted you"}
      </p>

      {stage === "phone" ? (
        <form onSubmit={sendOtp} className="space-y-3">
          <input
            type="tel"
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"
            required
          />
          <button disabled={loading} className="w-full bg-farm-800 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50">
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-3">
          <input
            type="text"
            placeholder="6-digit code"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm tracking-widest"
            required
          />
          <button disabled={loading} className="w-full bg-farm-800 text-white rounded-lg py-2 text-sm font-semibold disabled:opacity-50">
            {loading ? "Verifying…" : "Verify & Sign In"}
          </button>
          <button type="button" onClick={() => setStage("phone")} className="w-full text-xs text-stone-500">
            Change number
          </button>
        </form>
      )}

      {error && <p className="text-xs text-red-600 mt-3">{error}</p>}
    </div>
  );
}
