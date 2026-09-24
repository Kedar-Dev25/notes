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


const handleShare = async () => {
  const shareUrl = window.location.origin;

  const shareData = {
    title: "Notes26",
    text: "Class notes, records and important updates — check out Notes26.",
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    alert("Notes26 link copied!");
  } catch (error) {
    if (error.name !== "AbortError") {
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("Notes26 link copied!");
      } catch (clipboardError) {
        console.error("Share failed:", clipboardError);
      }
    }
  }
};
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

  window.notesInstallPrompt = event;
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



<div
  style={{
    width: "100%",
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "14px 16px 0",
    boxSizing: "border-box"
  }}
>
  <div
    style={{
      position: "relative",
      height: "54px",
      display: "flex",
      alignItems: "flex-start"
    }}
  >
    {/* Greeting */}
    <h2
      style={{
        margin: "16px 0 0",
        fontSize: "22px",
        lineHeight: "1.3",
        minWidth: 0,
        maxWidth: "calc(100% - 72px)",
        overflowWrap: "anywhere",
        fontWeight: "600",
        letterSpacing: "-0.25px",
        color: "#172033"
      }}
    >
      Hi, {username || "Student"} 👋
    </h2>

    {/* Profile + Share */}
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "7px"
      }}
    >
      {/* Profile */}
      <button
        onClick={handleEditName}
        aria-label="Edit profile name"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          border: "1.5px solid #172033",
          background: "#ffffff",
          color: "#172033",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          boxShadow: "0 2px 8px rgba(23,32,51,0.07)"
        }}
      >
        {(username || "S").charAt(0).toUpperCase()}
      </button>

      {/* Share */}
      <button
        type="button"
        onClick={handleShare}
        aria-label="Share Notes26"
        title="Share Notes26"
        style={{
          width: "50px",
          height: "50px",
          border: "1px solid #d8dee7",
          borderRadius: "14px",
          background: "#ffffff",
          color: "#172033",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          boxShadow: "0 2px 8px rgba(23,32,51,0.06)"
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle
            cx="18"
            cy="5"
            r="2.2"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <circle
            cx="6"
            cy="12"
            r="2.2"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <circle
            cx="18"
            cy="19"
            r="2.2"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M8 11L16 6.2"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <path
            d="M8 13L16 17.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</div>

{/* ================= CLASS NOTES ================= */}
{(!type || type === "classnotes") && (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "28px 16px 40px",
      boxSizing: "border-box"
    }}
  >
    {/* Heading */}
    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          lineHeight: "1.2",
          letterSpacing: "-0.4px"
        }}
      >
        Class Notes
      </h1>
    </div>

    {/* Subject Selector */}
    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <p
        style={{
          margin: "0 0 11px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#596579"
        }}
      >
        Choose Subject
      </p>

      <div
        style={{
          display: "flex",
          gap: "7px",
          overflowX: "auto",
          paddingBottom: "4px",
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
              minHeight: "40px",
              padding: "8px 13px",
              borderRadius: "9px",
              border:
                selectedSubject === subject
                  ? "1px solid #172033"
                  : "1px solid #d7dce3",
              background:
                selectedSubject === subject
                  ? "#172033"
                  : "#ffffff",
              color:
                selectedSubject === subject
                  ? "#ffffff"
                  : "#344054",
              cursor: "pointer",
              fontWeight:
                selectedSubject === subject
                  ? "600"
                  : "500",
              fontSize: "12px",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease"
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
          margin: "0 0 12px",
          fontSize: "19px",
          lineHeight: "1.3",
          letterSpacing: "-0.2px"
        }}
      >
        {selectedSubject} Notes
      </h2>

      {selectedNote?.images &&
      selectedNote.images.length > 0 ? (
        <div>
          {selectedNote.images.map((image) => (
            <article
              key={image.name}
              style={{
                background: "#ffffff",
                padding: "10px",
                borderRadius: "11px",
                border: "1px solid #e1e5ea",
                marginBottom: "10px",
                boxShadow:
                  "0 2px 8px rgba(23,32,51,0.045)"
              }}
            >
              {/* Image Header */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  margin: "2px 4px 9px"
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: "14px",
                    lineHeight: "1.35",
                    fontWeight: "600",
                    color: "#172033",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    minWidth: 0
                  }}
                >
                  {image.name}
                </h3>

                {image.date && (
                  <span
                    style={{
                      flexShrink: 0,
                      fontSize: "10px",
                      color: "#667085",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {image.date}
                  </span>
                )}
              </div>

              <img
                src={image.imageUrl}
                alt={image.name}
                onClick={() => {
                  setOpenedImage(image);
                  setOpenedImageIndex(
                    selectedNote.images.findIndex(
                      (item) => item.name === image.name
                    )
                  );
                }}
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  height: "auto",
                  maxHeight: "500px",
                  objectFit: "contain",
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "7px",
                  cursor: "pointer"
                }}
              />
            </article>
          ))}
        </div>
      ) : (
        <div
          style={{
            background: "#ffffff",
            border: "1px dashed #d3d8df",
            borderRadius: "11px",
            padding: "22px 16px",
            textAlign: "center"
          }}
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "6px"
            }}
          >
            📚
          </div>

          <p
            style={{
              margin: 0,
              color: "#596579",
              fontSize: "13px"
            }}
          >
            No notes available for this subject yet.
          </p>
        </div>
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
    padding: "28px 16px 40px"
  }}

  >
    {/* Heading */}
    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          lineHeight: "1.2",
          letterSpacing: "-0.4px"
        }}
      >
        Record Notes
      </h1>
    </div>

    {/* Subject Selector */}
    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <p
        style={{
          margin: "0 0 11px",
          fontSize: "13px",
          fontWeight: "600",
          color: "#596579"
        }}
      >
        Choose Subject
      </p>

      <div
        style={{
          display: "flex",
          gap: "7px",
          overflowX: "auto",
          paddingBottom: "4px",
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
              minHeight: "40px",
              padding: "8px 13px",
              borderRadius: "9px",
              border:
                selectedSubject === subject
                  ? "1px solid #172033"
                  : "1px solid #d7dce3",
              background:
                selectedSubject === subject
                  ? "#172033"
                  : "#ffffff",
              color:
                selectedSubject === subject
                  ? "#ffffff"
                  : "#344054",
              cursor: "pointer",
              fontWeight:
                selectedSubject === subject
                  ? "600"
                  : "500",
              fontSize: "12px",
              whiteSpace: "nowrap",
              transition: "all 0.15s ease"
            }}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>

    {/* Selected Subject */}
    <section>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginBottom: "12px"
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "19px",
            lineHeight: "1.3",
            letterSpacing: "-0.2px"
          }}
        >
          {selectedSubject} Record
        </h2>
      </div>

      {(() => {
        const selectedRecord = notesData.recordnotes.find(
          (note) => note.title === selectedSubject
        );

        return selectedRecord?.images &&
          selectedRecord.images.length > 0 ? (
          selectedRecord.images.map((record) => (
            <article
              key={record.name}
              style={{
                background: "#ffffff",
                padding: "13px 14px",
                borderRadius: "11px",
                border: "1px solid #e1e5ea",
                marginBottom: "10px",
                boxShadow: "0 2px 8px rgba(23,32,51,0.045)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px"
              }}
            >
              {/* Record Information */}
              <div
                style={{
                  minWidth: 0,
                  flex: 1
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    minWidth: 0
                  }}
                >
                  <span
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: "#f1f3f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "14px"
                    }}
                  >
                    📄
                  </span>

                  <h3
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      lineHeight: "1.35",
                      fontWeight: "600",
                      color: "#172033",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {record.name}
                  </h3>
                </div>

                {record.date && (
                  <p
                    style={{
                      margin: "4px 0 0 35px",
                      fontSize: "10px",
                      color: "#667085"
                    }}
                  >
                    {record.date}
                  </p>
                )}
              </div>

              {/* Open PDF */}
              <a
                href={record.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flexShrink: 0,
                  padding: "8px 11px",
                  borderRadius: "8px",
                  background: "#172033",
                  color: "#ffffff",
                  textDecoration: "none",
                  fontSize: "11px",
                  fontWeight: "600",
                  whiteSpace: "nowrap"
                }}
              >
                Open PDF
              </a>
            </article>
          ))
        ) : (
          <div
            style={{
              background: "#ffffff",
              border: "1px dashed #d3d8df",
              borderRadius: "11px",
              padding: "22px 16px",
              textAlign: "center"
            }}
          >
            <div
              style={{
                fontSize: "24px",
                marginBottom: "6px"
              }}
            >
              📚
            </div>

            <p
              style={{
                margin: 0,
                color: "#596579",
                fontSize: "13px"
              }}
            >
              No record notes available yet.
            </p>
          </div>
        );
      })()}
    </section>
  </main>
)}


      {/* ================= IMPORTANT ================= */}
{/* ================= IMPORTANT ================= */}
{type === "imp" && (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "28px 16px 40px",
      boxSizing: "border-box"
    }}
  >
    {/* Heading */}
    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          lineHeight: "1.2",
          letterSpacing: "-0.4px"
        }}
      >
        Important
      </h1>

      <p
        style={{
          margin: "8px 0 0",
          color: "#667085",
          fontSize: "13px",
          lineHeight: "1.45"
        }}
      >
        Important dates and reminders.
      </p>
    </div>

    {/* Important Items */}
    <section>
      {notesData.imp.map((item) => (
        <article
          key={item.title}
          style={{
            background: "#ffffff",
            padding: "14px",
            borderRadius: "11px",
            border: "1px solid #e1e5ea",
            marginBottom: "10px",
            boxShadow:
              "0 2px 8px rgba(23,32,51,0.045)"
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "15px",
              lineHeight: "1.4",
              fontWeight: "600",
              color: "#172033"
            }}
          >
            {item.title}
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              color: "#667085",
              fontSize: "11px",
              lineHeight: "1.4"
            }}
          >
            {item.date}
          </p>
        </article>
      ))}
    </section>
  </main>
)}
{/* ================= ANNOUNCEMENTS ================= */}
{type === "announcements" && (
  <main
    style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "28px 16px 40px",
      boxSizing: "border-box"
    }}
  >
    {/* Heading */}
    <div
      style={{
        marginBottom: "30px"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "28px",
          lineHeight: "1.2",
          letterSpacing: "-0.4px"
        }}
      >
        Announcements
      </h1>

      <p
        style={{
          margin: "8px 0 0",
          color: "#667085",
          fontSize: "13px",
          lineHeight: "1.45"
        }}
      >
        Important updates and announcements.
      </p>
    </div>

    {/* Announcements */}
    <section>
      {notesData.announcements.map((item) => (
        <article
          key={item.title}
          style={{
            background: "#ffffff",
            padding: "10px",
            borderRadius: "11px",
            border: "1px solid #e1e5ea",
            marginBottom: "10px",
            boxShadow:
              "0 2px 8px rgba(23,32,51,0.045)"
          }}
        >
          <div
            style={{
              padding: "3px 4px 8px"
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "15px",
                lineHeight: "1.4",
                fontWeight: "600",
                color: "#172033"
              }}
            >
              {item.title}
            </h2>

            <p
              style={{
                margin: "5px 0 0",
                color: "#667085",
                fontSize: "11px"
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
                margin: "2px auto 0",
                borderRadius: "7px"
              }}
            />
          )}
        </article>
      ))}
    </section>
  </main>
)}

{/* ================= PROFILE MODAL ================= */}
{isEditingName && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 3000,
      background: "rgba(0, 0, 0, 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      boxSizing: "border-box"
    }}
    onClick={() => setIsEditingName(false)}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "360px",
        background: "#ffffff",
        borderRadius: "16px",
        padding: "22px",
        boxSizing: "border-box",
        boxShadow: "0 20px 50px rgba(0,0,0,0.18)"
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px"
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              color: "#172033"
            }}
          >
            Profile
          </h2>

          <p
            style={{
              margin: "5px 0 0",
              fontSize: "12px",
              color: "#667085"
            }}
          >
            Manage your Notes profile
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditingName(false)}
          aria-label="Close profile"
          style={{
            width: "32px",
            height: "32px",
            border: "none",
            borderRadius: "8px",
            background: "#f1f3f6",
            color: "#172033",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          ×
        </button>
      </div>

      {/* Avatar */}
      <div
        style={{
          width: "64px",
          height: "64px",
          margin: "0 auto 18px",
          borderRadius: "50%",
          background: "#172033",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "25px",
          fontWeight: "600"
        }}
      >
        {(editedUsername || username || "S").charAt(0).toUpperCase()}
      </div>

      {/* Name */}
      <label
        style={{
          display: "block",
          marginBottom: "7px",
          fontSize: "12px",
          fontWeight: "600",
          color: "#596579"
        }}
      >
        Your name
      </label>

      <input
        type="text"
        value={editedUsername}
        onChange={(e) => setEditedUsername(e.target.value)}
        autoFocus
        maxLength={40}
        style={{
          width: "100%",
          height: "44px",
          boxSizing: "border-box",
          border: "1px solid #d7dce3",
          borderRadius: "9px",
          padding: "0 12px",
          outline: "none",
          fontSize: "14px",
          color: "#172033",
          background: "#ffffff"
        }}
      />

      {/* Save */}
      <button
        type="button"
        onClick={handleSaveName}
        style={{
          width: "100%",
          height: "44px",
          marginTop: "12px",
          border: "none",
          borderRadius: "9px",
          background: "#172033",
          color: "#ffffff",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "600"
        }}
      >
        Save Changes
      </button>


        {!isPwaInstalled && !isStandalone && installPrompt && (
  <button
    type="button"
    onClick={handleInstall}
    style={{
      width: "100%",
      height: "42px",
      marginTop: "8px",
      border: "1px solid #dbe4f0",
      borderRadius: "9px",
      background: "#eef6ff",
      color: "#172033",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px"
    }}
  >
    📱 Install Notes App
  </button>
)}
      {/* Logout */}
      <button
        type="button"
        onClick={handleLogout}
        style={{
          width: "100%",
          height: "42px",
          marginTop: "8px",
          border: "1px solid #e1e5ea",
          borderRadius: "9px",
          background: "#ffffff",
          color: "#b42318",
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: "600"
        }}
      >
        Log Out
      </button>
    </div>
  </div>
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

