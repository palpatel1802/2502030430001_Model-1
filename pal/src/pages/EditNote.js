import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import { notesAPI } from "../api/apiService";
import { normalizeNote } from "../utils/noteHelpers";
import "../styles/Dashboard.css";
import "../styles/UploadNotes.css";

const ACCEPTED_TYPES =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.jpg,.jpeg,.png,.webp";

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    course: "B.Tech",
    semester: "",
    description: "",
  });
  const [currentFileName, setCurrentFileName] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadNote = async () => {
      try {
        const note = normalizeNote(await notesAPI.getNoteById(id));
        setFormData({
          title: note.title || "",
          subject: note.subject || "",
          course: note.course || "B.Tech",
          semester: String(note.semester || ""),
          description: note.description || "",
        });
        setCurrentFileName(note.fileName || "");
      } catch (loadError) {
        setError(loadError.message || "Unable to load note.");
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("subject", formData.subject);
    payload.append("course", formData.course);
    payload.append("semester", formData.semester);
    payload.append("description", formData.description);
    if (file) payload.append("file", file);

    try {
      setSaving(true);
      await notesAPI.updateNoteWithFile(id, payload);
      navigate("/mynotes");
    } catch (saveError) {
      setError(saveError.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/mynotes" />

          <div className="welcome-banner">
            <h1>Edit Note</h1>
            <p>Update details or replace the uploaded document.</p>
          </div>

          {loading ? (
            <p className="page-status">Loading note...</p>
          ) : (
            <form className="study-form" onSubmit={handleSubmit}>
              {error && <p className="auth-error">{error}</p>}

              <input
                name="title"
                type="text"
                placeholder="Title *"
                value={formData.title}
                onChange={handleChange}
                required
              />
              <input
                name="subject"
                type="text"
                placeholder="Subject *"
                value={formData.subject}
                onChange={handleChange}
                required
              />
              <input
                name="course"
                type="text"
                placeholder="Course *"
                value={formData.course}
                onChange={handleChange}
                required
              />
              <input
                name="semester"
                type="number"
                min="1"
                max="12"
                placeholder="Semester *"
                value={formData.semester}
                onChange={handleChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description (optional)"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              />

              {currentFileName && (
                <p className="current-file-label">
                  Current file: <strong>{currentFileName}</strong>
                </p>
              )}

              <label className="file-upload-field">
                <span>Replace document (optional)</span>
                <input type="file" accept={ACCEPTED_TYPES} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                {file && <small className="file-selected">{file.name}</small>}
              </label>

              <button className="auth-btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default EditNote;
