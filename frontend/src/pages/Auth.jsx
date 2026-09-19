import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Auth() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    const trimmedName = name.trim();

    if (!trimmedName) return;

    localStorage.setItem("username", trimmedName);
    navigate("/");
  };

  return (
    <main className="auth-page">
      <section className="auth-box">
        <div className="auth-brand">Notes</div>

        <div className="auth-header">
          <h1>Welcome 👋</h1>
          <p>What should we call you?</p>
        </div>

        <div className="auth-form">
          <label htmlFor="username">Your name</label>

          <input
            id="username"
            type="text"
            placeholder="Enter your name"
            value={name}
            maxLength={30}
            autoComplete="name"
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleContinue();
              }
            }}
          />

          <button
            type="button"
            onClick={handleContinue}
            disabled={!name.trim()}
          >
            Continue
            <span>→</span>
          </button>
        </div>

        <p className="auth-note">
          Your name stays on this device.
        </p>
      </section>
    </main>
  );
}

export default Auth;