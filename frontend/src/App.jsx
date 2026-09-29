import { useState } from "react";
import Register from "./Register.jsx";
import Checkout from "./Checkout.jsx";

export default function App() {
  const [tab, setTab] = useState("checkout");
  const [signInRequest, setSignInRequest] = useState(0);
  const [user, setUser] = useState(null);
  return (
    <main className="shell">
      <nav className="tabs" aria-label="Page">
        <button aria-current={tab === "checkout"} onClick={() => setTab("checkout")}>Checkout</button>
        {user ? (
          <button onClick={() => { setUser(null); setTab("checkout"); }}>Logout</button>
        ) : (
          <>
            <button aria-current={tab === "signin"} onClick={() => { setTab("signin"); setSignInRequest((request) => request + 1); }}>Sign in</button>
            <button aria-current={tab === "register"} onClick={() => setTab("register")}>Create account</button>
          </>
        )}
      </nav>
      <div hidden={tab === "register"}>
        <Checkout
          onCreateAccount={() => setTab("register")}
          onReturnToCheckout={() => setTab("checkout")}
          onUserChange={setUser}
          signInRequest={signInRequest}
          user={user}
        />
      </div>
      {tab === "register" && <Register onDone={(authenticatedUser) => { setUser(authenticatedUser); setTab("checkout"); }} />}
    </main>
  );
}
