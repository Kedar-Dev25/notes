import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notesData } from "./data";
import "../App.css";

function Notes() {
  const { type = "recordnotes" } = useParams();
  const navigate = useNavigate();
  const whatsappNumber = "919114564601";
  const [username, setUsername] = useState(
    () => localStorage.getItem("username")
  );
  const [showInstalledMessage, setShowInstalledMessage] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isPwaInstalled, setIsPwaInstalled] = useState(false);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBar, setShowInstallBar] = useState(false);
  const [dismissInstallBar, setDismissInstallBar] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openedImageIndex, setOpenedImageIndex] = useState(0);
  const [openedImage, setOpenedImage] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("Python");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState("");

  const handleLogout = () => {
  localStorage.removeItem("username");
  setUsername(null);
  navigate("/auth", { replace: true });
};


useEffect(() => {
  if (isStandalone) {
    return;
  }

  const handleScroll = () => {
    if (window.scrollY > 180) {
      setShowInstallBar(true);
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, [isStandalone]);


const handleInstall = async () => {
  if (!installPrompt) return;

  installPrompt.prompt();

  const { outcome } = await installPrompt.userChoice;

  if (outcome === "accepted") {
    localStorage.setItem("notesPwaInstalled", "true");
    localStorage.setItem("notesShowInstalledWelcome", "true");

    setIsPwaInstalled(true);
    setInstallPrompt(null);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowInstalledMessage(true);
    }
  }
};

useEffect(() => {
  const standalone = window.matchMedia("(display-mode: standalone)").matches;

  if (!standalone) {
    return;
  }

  const shouldShowWelcome =
    localStorage.getItem("notesShowInstalledWelcome") === "true";

  if (shouldShowWelcome) {
    localStorage.removeItem("notesShowInstalledWelcome");
    setShowInstalledMessage(true);
  }
}, []);

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

useEffect(() => {
  const standalone = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  setIsStandalone(standalone);

  if (standalone) {
    return;
  }

const checkInstalledPwa = async () => {
  const savedInstalled = localStorage.getItem("notesPwaInstalled");

  if (savedInstalled === "true") {
    setIsPwaInstalled(true);
    return;
  }

  if (!("getInstalledRelatedApps" in navigator)) {
    return;
  }

  try {
    const relatedApps = await navigator.getInstalledRelatedApps();

    const installed = relatedApps.some(
      (app) =>
        app.platform === "webapp" &&
        app.id === "/"
    );

    if (installed) {
      localStorage.setItem("notesPwaInstalled", "true");
      setIsPwaInstalled(true);
    }
  } catch (error) {
    console.error(
      "Installed PWA detection failed:",
      error
    );
  }
};

  checkInstalledPwa();
}, []);

useEffect(() => {
  const standalone = window.matchMedia(
    "(display-mode: standalone)"
  ).matches;

  if (standalone && window.location.pathname !== "/") {
    navigate("/", { replace: true });
  }
}, [navigate]);

const handleSendWhatsApp = () => {
  if (!uploadedUrl) {
    return;
  }

  const message = `New Note Contribution

Name: ${username}
Image URL: ${uploadedUrl}`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
};
const handleUpload = async (file) => {
  if (!file) {
    return;
  }

  setIsUploading(true);

  try {
    const formData = new FormData();

    formData.append("file", selectedFile);
    formData.append("upload_preset", "notes_upload");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwus1tmi/image/upload",
      {
        method: "POST",
        body: formData
      }
    );

    const data = await response.json();

    console.log("Cloudinary response:", data);
    console.log("Uploaded image URL:", data.secure_url);

    setUploadedUrl(data.secure_url);
  } catch (error) {
    console.error("Upload failed:", error);
  } finally {
    setIsUploading(false);
  }
};
useEffect(() => {
  const savedUsername = localStorage.getItem("username");

  if (!savedUsername) {
    navigate("/auth", { replace: true });
    return;
  }

  setUsername(savedUsername);

  if (!type) {
    navigate("/notes/recordnotes", { replace: true });
  }
}, [navigate, type]);

  if (!username) {
    return null;
  }

  const subjects = [
    "Python",
    "C++",
    "Digital Electronics",
    "Data Structure",
    "Algorithm"
  ];

  const classNotes = notesData.classnotes;

  const selectedNote = classNotes.find(
    (note) => note.title === selectedSubject
  );

const navItems = [
  {
    label: "Record Notes",
    mobileLabel: "Records",
    path: "/notes/recordnotes",
    type: "recordnotes"
  },
  {
    label: "Class Notes",
    mobileLabel: "Class Notes",
    path: "/notes/classnotes",
    type: "classnotes"
  },
  {
    label: "Important",
    mobileLabel: "Deadline",
    path: "/notes/imp",
    type: "imp"
  },
  {
    label: "Announcements",
    mobileLabel: "Updates",
    path: "/notes/announcements",
    type: "announcements"
  }
];

  const handleEditName = () => {
    setEditedUsername(username);
    setIsEditingName(true);
  };

const handleSaveName = () => {
  const trimmedName = editedUsername.trim();

  if (!trimmedName) {
    return;
  }

  localStorage.setItem("username", trimmedName);
  setUsername(trimmedName);
  setIsEditingName(false);
};



  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef1f5",
        color: "#172033",
        fontFamily: "Arial, sans-serif",
        width: "100%"
      }}
    >
{/* Main Navigation */}
<nav className="main-nav">
  <div className="nav-inner">

    {/* Product Logo */}
    <button
      className="nav-logo"
      onClick={() => navigate("/notes/recordnotes")}
      aria-label="Notes home"
    >
      <img src="/note.png" alt="Notes" />
    </button>

    {/* Navigation Items */}
    <div className="nav-items">
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`nav-item ${
            type === item.type ? "nav-item-active" : ""
          }`}
        >
          <span className="desktop-label">
            {item.label}
          </span>

          <span className="mobile-label">
            {item.mobileLabel}
          </span>
        </button>
      ))}
    </div>

  </div>
</nav>



      {/* Greeting + Profile */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px 16px 0",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            position: "relative"
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "22px",
              lineHeight: "1.3",
              minWidth: 0,
              overflowWrap: "anywhere"
            }}
          >
            Hi, {username || "Student"} 👋
          </h2>

          <div
            style={{
              position: "relative",
              flexShrink: 0
            }}
          >
            <button
              onClick={handleEditName}
              aria-label="Edit profile name"
              style={{
                borderRadius: "50%",
                border: "2px solid #172033",
                height: "50px",
                width: "50px",
                background: "#fff",
                color: "#172033",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 0
              }}
            >
              {(username || "S").charAt(0).toUpperCase()}
            </button>
          </div>
        </div>

{/* Edit Name Modal */}
{isEditingName && (
  <div
    onClick={() => setIsEditingName(false)}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(23, 32, 51, 0.35)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 1000,
      boxSizing: "border-box"
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: "400px",
        background: "#fff",
        borderRadius: "14px",
        padding: "20px",
        boxSizing: "border-box",
        boxShadow: "0 12px 40px rgba(0,0,0,0.18)"
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          fontSize: "18px",
          fontWeight: "600",
          color: "#172033"
        }}
      >
        Edit your name
      </p>

      <p
        style={{
          margin: "0 0 16px",
          fontSize: "14px",
          color: "#596579",
          lineHeight: "1.4"
        }}
      >
        This name will be shown on your notes page.
      </p>

      <input
        type="text"
        value={editedUsername}
        onChange={(e) => setEditedUsername(e.target.value)}
        autoFocus
        maxLength={30}
        style={{
          width: "100%",
          height: "44px",
          padding: "0 12px",
          border: "1px solid #d3d8df",
          borderRadius: "8px",
          fontSize: "16px",
          color: "#172033",
          outline: "none",
          boxSizing: "border-box"
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "12px"
        }}
      >
        <button
          onClick={handleSaveName}
          style={{
            flex: 1,
            height: "44px",
            border: "none",
            borderRadius: "8px",
            background: "#172033",
            color: "#fff",
            cursor: "pointer",
            fontWeight: "600"
          }}
        >
          Save
        </button>

        <button
          onClick={() => setIsEditingName(false)}
          style={{
            flex: 1,
            height: "44px",
            border: "1px solid #d3d8df",
            borderRadius: "8px",
            background: "#f8f9fb",
            color: "#172033",
            cursor: "pointer",
            fontWeight: "500"
          }}
        >
          Cancel
        </button>
      </div>
      <div
  style={{
    height: "1px",
    background: "#eceff3",
    margin: "16px 0 12px"
  }}
/>

{!isStandalone && (
  <button
    type="button"
    onClick={() => {
      if (isPwaInstalled) {
        window.location.href = "web+notes://open";
      } else {
        handleInstall();
      }
    }}
    style={{
      width: "100%",
      height: "42px",
      border: "1px solid #d3d8df",
      borderRadius: "8px",
      background: "#f8f9fb",
      color: "#172033",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      marginBottom: "10px"
    }}
  >
    <span style={{ fontSize: "17px" }}>
      {isPwaInstalled ? "🚀" : "📱"}
    </span>

    <span>
      {isPwaInstalled ? "Open Notes App" : "Install Notes App"}
    </span>
  </button>
)}

<button
  type="button"
  onClick={handleLogout}
  style={{
    width: "100%",
    height: "42px",
    border: "1px solid #f0caca",
    borderRadius: "8px",
    background: "#fff",
    color: "#c0392b",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px"
  }}
>
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M9 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />

    <path
      d="M16 17L21 12L16 7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    <path
      d="M21 12H9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>

  <span>Logout</span>
</button>
    </div>
  </div>
)}
      </div>

      {/* ================= CLASS NOTES ================= */}
      {(!type || type === "classnotes") && (
        <main
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "18px 16px 40px"
          }}
        >
          {/* Heading */}
          <div
            style={{
              marginBottom: "24px"
            }}
          >
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "28px",
                lineHeight: "1.2"
              }}
            >
              Class Notes
            </h1>

            <p
              style={{
                margin: 0,
                color: "#596579",
                lineHeight: "1.5"
              }}
            >
              Find your notes by subject.
            </p>
          </div>

          {/* Subject Selector */}
          <div
            style={{
              marginBottom: "28px"
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontWeight: "600"
              }}
            >
              Select Subject
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "6px",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none"
              }}
            >
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  style={{
                    flex: "0 0 auto",
                    minHeight: "42px",
                    padding: "9px 14px",
                    borderRadius: "8px",
                    border:
                      selectedSubject === subject
                        ? "1px solid #172033"
                        : "1px solid #d3d8df",
                    background:
                      selectedSubject === subject
                        ? "#172033"
                        : "#f8f9fb",
                    color:
                      selectedSubject === subject
                        ? "#fff"
                        : "#222",
                    cursor: "pointer",
                    fontWeight:
                      selectedSubject === subject
                        ? "600"
                        : "500",
                    whiteSpace: "nowrap"
                  }}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Subject */}
          <section>
            <h2
              style={{
                margin: "0 0 16px",
                fontSize: "21px"
              }}
            >
              {selectedSubject} Notes
            </h2>

            {selectedNote ? (
              <div>
                {selectedNote.images &&
                selectedNote.images.length > 0 ? (
                  selectedNote.images.map((image) => (
                    <article
                      key={image.name}
                      style={{
                        background: "#fff",
                        padding: "10px",
                        borderRadius: "10px",
                        border: "1px solid #dfe3e8",
                        marginBottom: "20px",
                        boxShadow:
                          "0 3px 12px rgba(0,0,0,0.06)"
                      }}
                    >
                      <h3
                        style={{
                          margin: "6px 8px 14px",
                          fontSize: "17px",
                          lineHeight: "1.4"
                        }}
                      >
                        {image.name}
                      </h3>

                      <img
  src={image.imageUrl}
  alt={image.name}
  onClick={() => {
  setOpenedImage(image);
  setOpenedImageIndex(
    selectedNote.images.findIndex((item) => item.name === image.name)
  );
}}
  style={{
    width: "100%",
    maxWidth: "700px",
    height: "auto",
    display: "block",
    margin: "0 auto",
    borderRadius: "6px",
    cursor: "pointer"
  }}
/>
                    </article>
                  ))
                ) : (
                  <p
                    style={{
                      color: "#596579"
                    }}
                  >
                    No notes available for this subject yet.
                  </p>
                )}
              </div>
            ) : (
              <p
                style={{
                  color: "#596579"
                }}
              >
                No notes available for this subject yet.
              </p>
            )}
          </section>
        </main>
      )}

{/* ================= RECORD NOTES ================= */}
{type === "recordnotes" && (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "18px 16px 40px"
    }}
  >
    {/* Heading */}
    <div
      style={{
        marginBottom: "24px"
      }}
    >
      <h1
        style={{
          margin: "0 0 6px",
          fontSize: "28px"
        }}
      >
        Record Notes
      </h1>

      <p
        style={{
          margin: 0,
          color: "#596579",
          lineHeight: "1.5"
        }}
      >
        Your practical and record work.
      </p>
    </div>

    {/* Subject Selector */}
    <div
      style={{
        marginBottom: "28px"
      }}
    >
      <p
        style={{
          margin: "0 0 10px",
          fontWeight: "600"
        }}
      >
        Select Subject
      </p>

      <div
        style={{
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          paddingBottom: "6px",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none"
        }}
      >
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => setSelectedSubject(subject)}
            style={{
              flex: "0 0 auto",
              minHeight: "42px",
              padding: "9px 14px",
              borderRadius: "8px",
              border:
                selectedSubject === subject
                  ? "1px solid #172033"
                  : "1px solid #d3d8df",
              background:
                selectedSubject === subject
                  ? "#172033"
                  : "#f8f9fb",
              color:
                selectedSubject === subject
                  ? "#fff"
                  : "#222",
              cursor: "pointer",
              fontWeight:
                selectedSubject === subject
                  ? "600"
                  : "500",
              whiteSpace: "nowrap"
            }}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>

    {/* Selected Subject */}
    <section>
      <h2
        style={{
          margin: "0 0 16px",
          fontSize: "21px"
        }}
      >
        {selectedSubject} Record
      </h2>

      {(() => {
        const selectedRecord = notesData.recordnotes.find(
          (note) => note.title === selectedSubject
        );

        return selectedRecord?.images &&
          selectedRecord.images.length > 0 ? (
          selectedRecord.images.map((image) => (
            <article
              key={image.name}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #dfe3e8",
                marginBottom: "20px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.06)"
              }}
            >
              <h3
                style={{
                  margin: "6px 8px 14px",
                  fontSize: "17px",
                  lineHeight: "1.4"
                }}
              >
                {image.name}
              </h3>

              <img
                src={image.imageUrl}
                alt={image.name}
                onClick={() => {
                  setOpenedImage(image);
                  setOpenedImageIndex(
                    selectedRecord.images.findIndex(
                      (item) => item.name === image.name
                    )
                  );
                }}
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  height: "auto",
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              />
            </article>
          ))
        ) : (
          <p
            style={{
              color: "#596579"
            }}
          >
            No record notes available for this subject yet.
          </p>
        );
      })()}
    </section>
  </main>
)}

      {/* ================= IMPORTANT ================= */}
      {type === "imp" && (
        <main
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "18px 16px 40px"
          }}
        >
          <div
            style={{
              marginBottom: "24px"
            }}
          >
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "28px"
              }}
            >
              Important
            </h1>

            <p
              style={{
                margin: 0,
                color: "#596579",
                lineHeight: "1.5"
              }}
            >
              Important dates and reminders.
            </p>
          </div>

          {notesData.imp.map((item) => (
            <article
              key={item.title}
              style={{
                background: "#fff",
                padding: "18px",
                borderRadius: "10px",
                border: "1px solid #dfe3e8",
                marginBottom: "14px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.05)"
              }}
            >
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: "18px"
                }}
              >
                {item.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#596579"
                }}
              >
                {item.date}
              </p>
            </article>
          ))}
        </main>
      )}

      {/* ================= ANNOUNCEMENTS ================= */}
      {type === "announcements" && (
        <main
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "18px 16px 40px"
          }}
        >
          <div
            style={{
              marginBottom: "24px"
            }}
          >
            <h1
              style={{
                margin: "0 0 6px",
                fontSize: "28px"
              }}
            >
              Announcements
            </h1>

            <p
              style={{
                margin: 0,
                color: "#596579",
                lineHeight: "1.5"
              }}
            >
              Important updates and announcements.
            </p>
          </div>

          {notesData.announcements.map((item) => (
            <article
              key={item.title}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "10px",
                border: "1px solid #dfe3e8",
                marginBottom: "20px",
                boxShadow:
                  "0 3px 12px rgba(0,0,0,0.06)"
              }}
            >
              <div
                style={{
                  padding: "8px"
                }}
              >
                <h2
                  style={{
                    margin: "0 0 8px",
                    fontSize: "19px"
                  }}
                >
                  {item.title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#596579"
                  }}
                >
                  {item.date}
                </p>
              </div>

              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  style={{
                    width: "100%",
                    maxWidth: "700px",
                    height: "auto",
                    display: "block",
                    margin: "12px auto 0",
                    borderRadius: "6px"
                  }}
                />
              )}
            </article>
          ))}
        </main>
              )}

      {/* Full Screen Note Viewer */}
      {openedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            background: "#172033",
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              height: "64px",
              flexShrink: 0,
              background: "#172033",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 14px",
              borderBottom: "1px solid #263248",
              boxSizing: "border-box"
            }}
          >
<button
  onClick={() => setOpenedImage(null)}
  style={{
    width: "42px",
    height: "42px",
    border: "1px solid #344158",
    borderRadius: "10px",
    background: "#263248",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  }}
>
  <svg
    width="21"
    height="21"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5L8 12L15 19"
      stroke="white"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</button>

            <button
  onClick={async () => {
    try {
      const response = await fetch(openedImage.imageUrl);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = openedImage.name || "note";
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }}
  style={{
    width: "42px",
    height: "42px",
    border: "1px solid #344158",
    borderRadius: "10px",
    background: "#263248",
    color: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0
  }}
>
<svg
  width="22"
  height="22"
  viewBox="0 0 24 24"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M12 4V15"
    stroke="white"
    strokeWidth="2.2"
    strokeLinecap="round"
  />

  <path
    d="M7.5 11.5L12 16L16.5 11.5"
    stroke="white"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />

  <path
    d="M5 16.5V19C5 19.55 5.45 20 6 20H18C18.55 20 19 19.55 19 19V16.5"
    stroke="white"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>
</button>
          </div>

<div
  style={{
    flex: 1,
    width: "100%",
    overflowY: "auto",
    background: "#eef1f5",
    padding: "18px 12px 30px",
    boxSizing: "border-box"
  }}
>
  <div
    style={{
      width: "100%",
      maxWidth: "900px",
      margin: "0 auto"
    }}
  >
    <h2
      style={{
        margin: "0 0 12px",
        fontSize: "17px",
        fontWeight: "600",
        color: "#172033",
        lineHeight: "1.4"
      }}
    >
      {openedImage.name}
    </h2>

    <img
      src={openedImage.imageUrl}
      alt={openedImage.name}
      style={{
        width: "100%",
        height: "auto",
        display: "block",
        borderRadius: "6px"
      }}
    />
  </div>
</div>


<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    marginTop: "24px",
    paddingBottom: "8px",
    flexWrap: "wrap"
  }}
>
  {/* Previous */}
  <button
    onClick={() => {
      if (openedImageIndex > 0) {
        const newIndex = openedImageIndex - 1;
        setOpenedImageIndex(newIndex);
        setOpenedImage(selectedNote.images[newIndex]);
      }
    }}
    disabled={openedImageIndex === 0}
    style={{
      width: "38px",
      height: "38px",
      border: "1px solid #d3d8df",
      borderRadius: "9px",
      background: "#fff",
      color: "#172033",
      cursor: openedImageIndex === 0 ? "default" : "pointer",
      opacity: openedImageIndex === 0 ? 0.4 : 1,
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    ←
  </button>

  {/* Page Numbers */}
  {selectedNote.images.length <= 4 ? (
    selectedNote.images.map((_, index) => (
      <button
        key={index}
        onClick={() => {
          setOpenedImageIndex(index);
          setOpenedImage(selectedNote.images[index]);
        }}
        style={{
          width: "38px",
          height: "38px",
          border:
            openedImageIndex === index
              ? "1px solid #172033"
              : "1px solid #d3d8df",
          borderRadius: "9px",
          background:
            openedImageIndex === index
              ? "#172033"
              : "#fff",
          color:
            openedImageIndex === index
              ? "#fff"
              : "#172033",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        {index + 1}
      </button>
    ))
  ) : (
    <>
      <button
        onClick={() => {
          setOpenedImageIndex(0);
          setOpenedImage(selectedNote.images[0]);
        }}
        style={{
          width: "38px",
          height: "38px",
          border: "1px solid #d3d8df",
          borderRadius: "9px",
          background:
            openedImageIndex === 0 ? "#172033" : "#fff",
          color:
            openedImageIndex === 0 ? "#fff" : "#172033",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        1
      </button>

      <span
        style={{
          padding: "0 3px",
          color: "#596579",
          fontWeight: "600"
        }}
      >
        ...
      </span>

      <button
        onClick={() => {
          const lastIndex = selectedNote.images.length - 1;
          setOpenedImageIndex(lastIndex);
          setOpenedImage(selectedNote.images[lastIndex]);
        }}
        style={{
          width: "38px",
          height: "38px",
          border: "1px solid #d3d8df",
          borderRadius: "9px",
          background:
            openedImageIndex === selectedNote.images.length - 1
              ? "#172033"
              : "#fff",
          color:
            openedImageIndex === selectedNote.images.length - 1
              ? "#fff"
              : "#172033",
          cursor: "pointer",
          fontWeight: "600"
        }}
      >
        {selectedNote.images.length}
      </button>
    </>
  )}

  {/* Next */}
  <button
    onClick={() => {
      if (openedImageIndex < selectedNote.images.length - 1) {
        const newIndex = openedImageIndex + 1;
        setOpenedImageIndex(newIndex);
        setOpenedImage(selectedNote.images[newIndex]);
      }
    }}
    disabled={
      openedImageIndex === selectedNote.images.length - 1
    }
    style={{
      width: "38px",
      height: "38px",
      border: "1px solid #d3d8df",
      borderRadius: "9px",
      background: "#fff",
      color: "#172033",
      cursor:
        openedImageIndex === selectedNote.images.length - 1
          ? "default"
          : "pointer",
      opacity:
        openedImageIndex === selectedNote.images.length - 1
          ? 0.4
          : 1,
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    →
  </button>
</div>
        </div>

      )}
<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    handleUpload(file);
  }}
/>

<button
  onClick={handleUpload}
  disabled={!selectedFile || isUploading}
>
  {isUploading ? "Uploading..." : "Upload"}
</button>

{uploadedUrl && (
  <img
    src={uploadedUrl}
    alt="Uploaded note"
    style={{
      width: "300px",
      marginTop: "20px"
    }}
  />
)}
{uploadedUrl && (
  <button
    onClick={handleSendWhatsApp}
    style={{
      display: "block",
      marginTop: "12px",
      padding: "10px 16px",
      border: "none",
      borderRadius: "8px",
      background: "#172033",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "600"
    }}
  >
    Send on WhatsApp
  </button>
)}

{!isStandalone && showInstallBar && !dismissInstallBar && (
    <div
    style={{
      position: "fixed",
      left: "12px",
      right: "12px",
      bottom: "12px",
      zIndex: 900,
      maxWidth: "560px",
      margin: "0 auto",
      background: "#172033",
      color: "#fff",
      borderRadius: "12px",
      padding: "10px 12px",
      boxSizing: "border-box",
      boxShadow: "0 8px 24px rgba(23,32,51,0.20)",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transform: "translateY(0)",
      animation: "installBarSlideUp 0.25s ease-out"
    }}
  >
    <div
      style={{
        width: "34px",
        height: "34px",
        borderRadius: "9px",
        background: "#263248",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: "17px"
      }}
    >
      📱
    </div>

    <div
      style={{
        flex: 1,
        minWidth: 0
      }}
    >
      <div
        style={{
          fontSize: "14px",
          fontWeight: "600",
          lineHeight: "1.3"
        }}
      >
        {isPwaInstalled ? "Open Notes App" : "Install Notes App"}
      </div>

      <div
        style={{
          marginTop: "2px",
          fontSize: "12px",
          color: "#c3cad5",
          lineHeight: "1.3"
        }}
      >
        Keep your notes one tap away.
      </div>
    </div>

<button
  type="button"
  onClick={() => {
    if (isPwaInstalled) {
      window.location.href = "web+notes://open";
    } else {
      navigate("/notes/install");
    }
  }}
  style={{
    border: "none",
    borderRadius: "8px",
    background: "#fff",
    color: "#172033",
    padding: "8px 12px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    flexShrink: 0
  }}
>
  {isPwaInstalled ? "Open" : "Install"}
</button>

    <button
      type="button"
      onClick={() => setDismissInstallBar(true)}
      aria-label="Close install message"
      style={{
        width: "28px",
        height: "28px",
        border: "none",
        background: "transparent",
        color: "#c3cad5",
        cursor: "pointer",
        fontSize: "18px",
        padding: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0
      }}
    >
      ×
    </button>
  </div>
)}
{showInstalledMessage && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0, 0, 0, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      zIndex: 9999
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "360px",
        background: "#ffffff",
        borderRadius: "18px",
        padding: "24px",
        textAlign: "center",
        boxShadow: "0 20px 50px rgba(0,0,0,0.2)"
      }}
    >
      <div style={{ fontSize: "42px", marginBottom: "10px" }}>
        🎉
      </div>

      <h2
        style={{
          margin: "0 0 8px",
          color: "#172033",
          fontSize: "22px"
        }}
      >
        Notes is installed!
      </h2>

      <p
        style={{
          margin: "0 0 20px",
          color: "#667085",
          fontSize: "14px",
          lineHeight: "1.5"
        }}
      >
        You can now open Notes directly from your home screen like a normal app.
      </p>

      <div
        style={{
          background: "#f4f6f8",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "20px"
        }}
      >
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "14px",
            background: "#172033",
            margin: "0 auto 10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px"
          }}
        >
          📝
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "#172033"
          }}
        >
          Notes
        </div>
      </div>

      <button
        type="button"
        onClick={() => setShowInstalledMessage(false)}
        style={{
          width: "100%",
          height: "44px",
          border: "none",
          borderRadius: "9px",
          background: "#172033",
          color: "#ffffff",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "14px"
        }}
      >
        Start Using Notes
      </button>
    </div>
  </div>
)}
    </div>
  );
}

export default Notes;
