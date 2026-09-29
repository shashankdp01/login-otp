import { useEffect, useState } from "react";
import { submitCheckout, verify } from "./api.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 10-digit Indian mobile (starts 6-9), or an international number with "+" and 8-15 digits.
function phoneValid(value) {
  const v = value.trim();
  if (!/^\+?[\d\s\-()]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return v.startsWith("+") ? digits.length >= 8 && digits.length <= 15 : /^[6-9]\d{9}$/.test(digits);
}

function CodeModal({ email: initialEmail, onSuccess, onSkip, onCreateAccount }) {
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try { onSuccess(await verify({ email: email.trim().toLowerCase(), code })); }
    catch (err) { setError(err.message); setBusy(false); }
  }
  return (
    <div className="backdrop" onKeyDown={(e) => e.key === "Escape" && onSkip()}>
      <form className="card modal" role="dialog" aria-modal="true" aria-labelledby="m-title" onSubmit={submit}>
        <h2 id="m-title">Sign in to continue</h2>
        <label>Email<input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <p>Enter the 6-digit code you received when you created your account.</p>
        <input className="code-input" autoFocus inputMode="numeric" maxLength={6} autoComplete="one-time-code"
          aria-label="6-digit code" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
        {error && <p className="error" role="alert">{error}</p>}
        <div className="row">
          <button type="button" className="ghost" onClick={onSkip}>Cancel</button>
          <button className="primary" disabled={busy || code.length !== 6 || !email.trim()}>{busy ? "Signing in…" : "Sign in"}</button>
        </div>
        <button type="button" className="ghost" onClick={() => { onSkip(); onCreateAccount(); }}>Create an account</button>
      </form>
    </div>
  );
}

export default function Checkout({ onCreateAccount, onReturnToCheckout, onUserChange, signInRequest, user }) {
  const [form, setForm] = useState({ email: "", phone: "", shipping_address: "" });
  const [modal, setModal] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const email = form.email.trim().toLowerCase();
  const emailValid = EMAIL_RE.test(email);
  const phoneOk = phoneValid(form.phone);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  useEffect(() => {
    if (signInRequest > 0) setModal(true);
  }, [signInRequest]);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!phoneOk) { setError("Enter a valid phone number."); return; }
    if (!user) {
      setModal(true);
      return;
    }
    setBusy(true);
    try { await submitCheckout({ ...form, email }, user.token); setDone(true); }
    catch (err) {
      setError(err.message);
      if (err.status === 401) { onUserChange(null); setModal(true); }
    }
    finally { setBusy(false); }
  }

  if (done) {
    return (
      <section className="card" aria-live="polite">
        <h1>Order received</h1>
        <p>We saved your shipping details{user ? `, ${user.first_name}` : ""}. No payment was taken.</p>
        <button className="primary" onClick={() => { setForm({ email: "", phone: "", shipping_address: "" }); onUserChange(null); setDone(false); }}>Start over</button>
      </section>
    );
  }
  return (
    <>
      <form className="card" onSubmit={submit}>
        {user && <p className="greeting">Signed in as {user.first_name} {user.last_name}</p>}
        <h1>Shipping details</h1>
        <label>Email
          <input type="email" required value={form.email} onChange={set("email")} autoComplete="email"
            aria-invalid={form.email !== "" && !emailValid} />
          {form.email !== "" && !emailValid && <span className="hint">Enter a complete email address.</span>}
          {emailValid && <span className="hint ok">Email looks good.</span>}
        </label>
        <label>Phone
          <input type="tel" required value={form.phone} onChange={set("phone")} autoComplete="tel"
            aria-invalid={form.phone !== "" && !phoneOk} placeholder="98765 43210 or +1 415 555 0132" />
          {form.phone !== "" && !phoneOk && <span className="hint">Use a 10-digit mobile number, or include the country code (+…).</span>}
        </label>
        <label>Shipping address<textarea required rows={3} value={form.shipping_address} onChange={set("shipping_address")} autoComplete="street-address" /></label>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy}>{busy ? "Saving…" : "Place order"}</button>
      </form>
      {modal && (
        <CodeModal email={email} onCreateAccount={onCreateAccount}
          onSuccess={(authenticatedUser) => {
            onUserChange(authenticatedUser);
            setForm((current) => ({ ...current, email: authenticatedUser.email }));
            setModal(false);
            onReturnToCheckout();
          }}
          onSkip={() => { setModal(false); onReturnToCheckout(); }} />
      )}
    </>
  );
}
