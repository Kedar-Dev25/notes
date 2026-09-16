import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notesData } from "./data";

function Notes() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    () => localStorage.getItem("username")
  );

  const [selectedSubject, setSelectedSubject] = useState("Python");

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#eef1f5",
        color: "#172033",
        fontFamily: "Arial, sans-serif"
      }}
    >
      {/* Main Navigation */}
{/* Main Navigation */}
<nav
  style={{
    background: "#172033",
    borderBottom: "1px solid #263248",
    padding: "8px 8px"
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

      {/* Greeting */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px 16px 0"
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "22px",
            lineHeight: "1.3"
          }}
        >
          Hi, {username || "Student"} 👋
        </h2>
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
                        style={{
                          width: "100%",
                          maxWidth: "700px",
                          height: "auto",
                          display: "block",
                          margin: "0 auto",
                          borderRadius: "6px"
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
    </div>
  );
}

export default Notes;