import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notesData } from "./data";

function Notes() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    () => localStorage.getItem("username")
  );
  const [openedImageIndex, setOpenedImageIndex] = useState(0);
  const [openedImage, setOpenedImage] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("Python");
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");

    if (!savedUsername) {
      navigate("/auth", { replace: true });
      return;
    }

    setUsername(savedUsername);
  }, [navigate]);

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
      label: "Class Notes",
      path: "/notes/classnotes",
      type: "classnotes"
    },
    {
      label: "Record Notes",
      path: "/notes/recordnotes",
      type: "recordnotes"
    },
    {
      label: "Important",
      path: "/notes/imp",
      type: "imp"
    },
    {
      label: "Announcements",
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
      <nav
       style={{
  background: "#172033",
  borderBottom: "1px solid #263248",
  padding: "8px 8px",
  position: "sticky",
  top: 0,
  zIndex: 100
}}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "5px",
            width: "100%",
            maxWidth: "900px",
            margin: "0 auto"
          }}
        >
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: "100%",
                minWidth: 0,
                minHeight: "42px",
                padding: "8px 4px",
                border: "none",
                borderRadius: "8px",
                background:
                  type === item.type ? "#fff" : "transparent",
                color:
                  type === item.type ? "#172033" : "#e7ebf0",
                fontWeight:
                  type === item.type ? "600" : "500",
                fontSize: "12px",
                cursor: "pointer",
                whiteSpace: "normal",
                lineHeight: "1.2",
                textAlign: "center"
              }}
            >
              {item.label}
            </button>
          ))}
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

          {notesData.recordnotes.map((note) => (
            <article
              key={note.title}
              style={{
                marginBottom: "24px"
              }}
            >
              <h2
                style={{
                  margin: "0 0 14px",
                  fontSize: "21px"
                }}
              >
                {note.title}
              </h2>

              {note.images &&
              note.images.length > 0 ? (
                note.images.map((image) => (
                  <div
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
                        fontSize: "17px"
                      }}
                    >
                      {image.name}
                    </h3>

                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      style={{
                        width: "100%",
                        maxWidth: "700px",
                        height: "auto",
                        display: "block",
                        margin: "0 auto",
                        borderRadius: "6px"
                      }}
                    />
                  </div>
                ))
              ) : (
                <p
                  style={{
                    color: "#596579"
                  }}
                >
                  No record notes available yet.
                </p>
              )}
            </article>
          ))}
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
    </div>
  );
}

export default Notes;
