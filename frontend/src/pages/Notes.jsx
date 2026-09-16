import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { notesData } from "./data";

function Notes() {
  const { type } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState(
    () => localStorage.getItem("username")
  );

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

  const [selectedSubject, setSelectedSubject] = useState("Python");

  const classNotes = notesData.classnotes;

  const selectedNote = classNotes.find(
    (note) => note.title === selectedSubject
  );

  const navItems = [
    { label: "Class Notes", path: "/notes/classnotes", type: "classnotes" },
    { label: "Record Notes", path: "/notes/recordnotes", type: "recordnotes" },
    { label: "Important", path: "/notes/imp", type: "imp" },
    {
      label: "Announcements",
      path: "/notes/announcements",
      type: "announcements"
    }
  ];

  return (
    <div>
      {/* Main Navigation */}
      <nav
        style={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          padding: "14px 20px",
          borderBottom: "1px solid #e5e5e5",
          overflowX: "auto",
          background: "#fff"
        }}
      >
        {/* App Name */}
        <button
          onClick={() => navigate("/")}
          style={{
            flex: "0 0 auto",
            marginRight: "8px",
            padding: "9px 14px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px"
          }}
        >
          Notes
        </button>

        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: "0 0 auto",
              padding: "9px 14px",
              borderRadius: "7px",
              border:
                type === item.type
                  ? "1px solid #111"
                  : "1px solid #ddd",
              background:
                type === item.type
                  ? "#111"
                  : "#fff",
              color:
                type === item.type
                  ? "#fff"
                  : "#222",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Greeting */}
      <div
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px 20px 0"
        }}
      >
        <h2 style={{ margin: 0 }}>
          Hi, {username || "Student"} 👋
        </h2>
      </div>

      {/* Main Content */}
      {(!type || type === "classnotes") && (
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "20px"
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ marginBottom: "6px" }}>Class Notes</h1>

            <p style={{ margin: 0, color: "#666" }}>
              Find your notes by subject.
            </p>
          </div>

          {/* Subject Selector */}
          <div style={{ marginBottom: "28px" }}>
            <p
              style={{
                marginBottom: "10px",
                fontWeight: "600"
              }}
            >
              Select Subject
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                overflowX: "auto",
                paddingBottom: "6px",
                scrollbarWidth: "none"
              }}
            >
              {subjects.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  style={{
                    flex: "0 0 auto",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    border:
                      selectedSubject === subject
                        ? "1px solid #111"
                        : "1px solid #ddd",
                    background:
                      selectedSubject === subject
                        ? "#111"
                        : "#fff",
                    color:
                      selectedSubject === subject
                        ? "#fff"
                        : "#222",
                    cursor: "pointer",
                    fontWeight: "500"
                  }}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Notes */}
          <div>
            <h2 style={{ marginBottom: "16px" }}>
              {selectedSubject} Notes
            </h2>

            {selectedNote ? (
              <img
                src={selectedNote.imageUrl}
                alt={`${selectedSubject} notes`}
                style={{
                  width: "100%",
                  maxWidth: "700px",
                  display: "block",
                  margin: "0 auto",
                  borderRadius: "8px",
                  border: "1px solid #e5e5e5"
                }}
              />
            ) : (
              <p style={{ color: "#666" }}>
                No notes available for this subject yet.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Other Sections */}
      {type && type !== "classnotes" && (
        <div
          style={{
            maxWidth: "1000px",
            margin: "0 auto",
            padding: "20px"
          }}
        >
          <h1>
            {navItems.find((item) => item.type === type)?.label}
          </h1>
        </div>
      )}
    </div>
  );
}

export default Notes;