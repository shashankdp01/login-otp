import { useState } from "react";
import { register, verify } from "./api.js";

export default function Register({ onDone }) {
  const [form, setForm] = useState({ email: "", first_name: "", last_name: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [code, setCode] = useState(null);
  const [user, setUser] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      const result = await register(form);
      setCode(result.code);
      setUser(await verify({ email: form.email, code: result.code }));
    }
    catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }

  if (code) {
    return (
      <section className="card" aria-live="polite">
        <h1>You're registered</h1>
        <p>Save this code for future sign-ins. Your account is ready.</p>
        <p className="code" aria-label={`Your code is ${code.split("").join(" ")}`}>{code}</p>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="primary" disabled={busy} onClick={() => onDone(user)}>{busy ? "Preparing checkout…" : "Continue to checkout"}</button>
      </section>
    );
  }
  return (
    <form className="card" onSubmit={submit}>
      <h1>Create an account</h1>
      <label>Email<input type="email" required value={form.email} onChange={set("email")} autoComplete="email" /></label>
      <div className="row">
        <label>First name<input required value={form.first_name} onChange={set("first_name")} autoComplete="given-name" /></label>
        <label>Last name<input required value={form.last_name} onChange={set("last_name")} autoComplete="family-name" /></label>
      </div>
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary" disabled={busy}>{busy ? "Registering…" : "Register"}</button>
    </form>
  );
}
