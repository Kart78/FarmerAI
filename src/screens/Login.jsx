import { useState } from "react";
import { Sprout, Mail, Phone, CheckCircle2, ArrowLeft } from "lucide-react";
import { signInWithOtp, signInWithPhoneOtp, verifyPhoneOtp } from "../lib/api.js";

const TABS = ["Phone", "Email"];

function normalizePhone(raw, countryCode) {
  const digits = raw.replace(/\D/g, "");
  return `${countryCode}${digits}`;
}

export default function Login() {
  const [tab, setTab] = useState("Phone");

  // Email state
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSending, setEmailSending] = useState(false);

  // Phone state
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false); // false = enter phone, true = enter code
  const [code, setCode] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneSending, setPhoneSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const fullPhone = normalizePhone(phone, countryCode);

  const submitEmail = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setEmailSending(true);
    setEmailError("");
    try {
      await signInWithOtp(email.trim());
      setEmailSent(true);
    } catch (err) {
      setEmailError(err.message || "Couldn't send the link. Try again.");
    }
    setEmailSending(false);
  };

  const submitPhone = async (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 7) return;
    setPhoneSending(true);
    setPhoneError("");
    try {
      await signInWithPhoneOtp(fullPhone);
      setOtpStep(true);
    } catch (err) {
      setPhoneError(err.message || "Couldn't send the code. Try again.");
    }
    setPhoneSending(false);
  };

  const submitCode = async (e) => {
    e.preventDefault();
    if (code.trim().length < 4) return;
    setVerifying(true);
    setPhoneError("");
    try {
      await verifyPhoneOtp(fullPhone, code.trim());
      // onAuthStateChange in AuthProvider picks up the new session automatically
    } catch (err) {
      setPhoneError(err.message || "Invalid code. Try again.");
    }
    setVerifying(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6">
          <Sprout className="text-farm-700" size={28} />
          <span className="font-display font-bold text-xl text-stone-800">FarmerAI</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-card p-6">
          {!(emailSent && tab === "Email") && (
            <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    setTab(t);
                    setOtpStep(false);
                    setPhoneError("");
                    setEmailError("");
                  }}
                  className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${
                    tab === t ? "bg-white text-farm-800 shadow-sm" : "text-stone-500"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {tab === "Phone" && !otpStep && (
            <>
              <h1 className="font-display font-semibold text-lg text-stone-800 mb-1">Sign in with phone</h1>
              <p className="text-sm text-stone-500 mb-5">We'll text you a one-time code.</p>
              <form onSubmit={submitPhone} className="space-y-3">
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="border border-stone-300 rounded-lg px-2 text-sm bg-white"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-farm-700/30"
                    />
                  </div>
                </div>
                {phoneError && <p className="text-xs text-red-600">{phoneError}</p>}
                <button
                  type="submit"
                  disabled={phoneSending}
                  className="w-full bg-farm-800 disabled:bg-stone-300 text-white text-sm font-semibold py-2.5 rounded-lg"
                >
                  {phoneSending ? "Sending…" : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {tab === "Phone" && otpStep && (
            <>
              <button
                onClick={() => setOtpStep(false)}
                className="flex items-center gap-1 text-xs text-stone-500 mb-3"
              >
                <ArrowLeft size={13} /> Change number
              </button>
              <h1 className="font-display font-semibold text-lg text-stone-800 mb-1">Enter the code</h1>
              <p className="text-sm text-stone-500 mb-5">
                Sent to <span className="font-medium text-stone-700">{fullPhone}</span>
              </p>
              <form onSubmit={submitCode} className="space-y-3">
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="6-digit code"
                  className="w-full border border-stone-300 rounded-lg px-3 py-2.5 text-sm text-center tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-farm-700/30"
                />
                {phoneError && <p className="text-xs text-red-600">{phoneError}</p>}
                <button
                  type="submit"
                  disabled={verifying}
                  className="w-full bg-farm-800 disabled:bg-stone-300 text-white text-sm font-semibold py-2.5 rounded-lg"
                >
                  {verifying ? "Verifying…" : "Verify & Sign in"}
                </button>
                <button
                  type="button"
                  onClick={submitPhone}
                  disabled={phoneSending}
                  className="w-full text-xs text-farm-700 font-medium py-1"
                >
                  {phoneSending ? "Resending…" : "Resend code"}
                </button>
              </form>
            </>
          )}

          {tab === "Email" && !emailSent && (
            <>
              <h1 className="font-display font-semibold text-lg text-stone-800 mb-1">Sign in with email</h1>
              <p className="text-sm text-stone-500 mb-5">We'll send you a magic link — no password needed.</p>
              <form onSubmit={submitEmail} className="space-y-3">
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-farm-700/30"
                  />
                </div>
                {emailError && <p className="text-xs text-red-600">{emailError}</p>}
                <button
                  type="submit"
                  disabled={emailSending}
                  className="w-full bg-farm-800 disabled:bg-stone-300 text-white text-sm font-semibold py-2.5 rounded-lg"
                >
                  {emailSending ? "Sending…" : "Send magic link"}
                </button>
              </form>
            </>
          )}

          {tab === "Email" && emailSent && (
            <div className="text-center py-4">
              <CheckCircle2 className="mx-auto text-farm-700 mb-3" size={32} />
              <h1 className="font-display font-semibold text-stone-800 mb-1">Check your email</h1>
              <p className="text-sm text-stone-500">
                We sent a sign-in link to <span className="font-medium text-stone-700">{email}</span>. Open it on
                this device to continue.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
