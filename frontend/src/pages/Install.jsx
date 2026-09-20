import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Install() {
 const navigate = useNavigate();
  const [installPrompt, setInstallPrompt] = useState(null);

    useEffect(() => {
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt
    );

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstall = async () => {
  if (!installPrompt) {
    return;
  }

  installPrompt.prompt();

  const { outcome } = await installPrompt.userChoice;

  if (outcome === "accepted") {
    setInstallPrompt(null);
  }
};
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef1f5",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          margin: "0 auto",
          padding: "20px 16px 40px",
          boxSizing: "border-box"
        }}
      >
        {/* Back */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            border: "none",
            background: "transparent",
            color: "#172033",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            padding: "8px 0"
          }}
        >
          ← Back
        </button>

        {/* Main */}
        <main
          style={{
            marginTop: "42px",
            textAlign: "center"
          }}
        >
          {/* App Icon */}
          <img
            src="/note.png"
            alt="Notes"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "17px",
              objectFit: "cover",
              marginBottom: "18px"
            }}
          />

          {/* Heading */}
          <h1
            style={{
              margin: "0 0 9px",
              fontSize: "27px",
              lineHeight: "1.2",
              fontWeight: "700"
            }}
          >
            Install Notes App
          </h1>

          {/* Friendly description */}
          <p
            style={{
              margin: "0 auto",
              maxWidth: "390px",
              color: "#596579",
              fontSize: "14px",
              lineHeight: "1.5"
            }}
          >
            Keep Notes just one tap away on your device.
          </p>

          {/* Simple benefits */}
          <div
            style={{
              marginTop: "26px",
              textAlign: "left"
            }}
          >
            {/* Benefit 1 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px"
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#e4f5e9",
                  color: "#218739",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  flexShrink: 0
                }}
              >
                ✓
              </span>

              <span
                style={{
                  fontSize: "14px",
                  color: "#3f4b5d"
                }}
              >
                Open your notes quickly
              </span>
            </div>

            {/* Benefit 2 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "12px"
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#e4f5e9",
                  color: "#218739",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  flexShrink: 0
                }}
              >
                ✓
              </span>

              <span
                style={{
                  fontSize: "14px",
                  color: "#3f4b5d"
                }}
              >
                Use Notes like an app
              </span>
            </div>

            {/* Benefit 3 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "#e4f5e9",
                  color: "#218739",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: "700",
                  flexShrink: 0
                }}
              >
                ✓
              </span>

              <span
                style={{
                  fontSize: "14px",
                  color: "#3f4b5d"
                }}
              >
                Find it easily on your device
              </span>
            </div>
          </div>

          {/* Install area */}
          <div
            style={{
              marginTop: "30px"
            }}
          >
            <button
  type="button"
  onClick={handleInstall}
  style={{
    width: "100%",
    height: "50px",
    border: "none",
    borderRadius: "10px",
    background: "#172033",
    color: "#fff",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    boxShadow: "0 3px 8px rgba(23,32,51,0.10)",
    transition: "transform 0.08s ease, background 0.15s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.background = "#222e45";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.background = "#172033";
    e.currentTarget.style.transform = "scale(1)";
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.97)";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "scale(1)";
  }}
>
  <span style={{ fontSize: "17px" }}>📱</span>
  <span>Install Notes App</span>
</button>

            {/* Trust message */}
            <p
              style={{
                margin: "10px 0 0",
                fontSize: "12px",
                color: "#7a8494",
                lineHeight: "1.4"
              }}
            >
              Free to install · No payment needed
            </p>
          </div>

          {/* Maybe Later */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              marginTop: "16px",
              border: "none",
              background: "transparent",
              color: "#596579",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: "500"
            }}
          >
            Maybe later
          </button>
        </main>
      </div>
    </div>
  );
}

export default Install;
