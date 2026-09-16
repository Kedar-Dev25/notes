import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h1>Welcome 👋</h1>

      <p>What should we call you?</p>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <button onClick={handleContinue}>
        Continue
      </button>
    </div>
  );
}

export default Auth;