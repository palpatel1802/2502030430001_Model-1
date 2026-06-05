import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import { notesAPI } from "../api/apiService";
import "../styles/Dashboard.css";
import "../styles/UploadNotes.css";

const ACCEPTED_TYPES =
  ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.jpg,.jpeg,.png,.webp";

function UploadNotes() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    course: "B.Tech",
    semester: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleFileChange = (event) => {
    setFile(event.target.files?.[0] || null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!file) {
      setError("Please choose a document to upload.");
      return;
    }

    const payload = new FormData();
    payload.append("file", file);
    payload.append("title", formData.title);
    payload.append("subject", formData.subject);
    payload.append("course", formData.course);
    payload.append("semester", formData.semester);
    if (formData.description.trim()) {
      payload.append("description", formData.description.trim());
    }
    payload.append("tags", [formData.subject, formData.course].join(","));

    try {
      setLoading(true);
      await notesAPI.uploadNote(payload);
      navigate("/mynotes");
    } catch (apiError) {
      const message = apiError.message || "Upload failed.";
      setError(
        message.includes("Route not found")
          ? `${message} Restart the API server: cd server && npm run dev`
          : message.includes("login") || message.includes("token")
            ? "Please login and try again."
            : message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/dashboard" />

          <div className="welcome-banner">
            <h1>Upload Notes</h1>
            <p>Upload PDF, Word, PowerPoint, Excel, text, or image documents.</p>
          </div>

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

            <label className="file-upload-field">
              <span>Document file *</span>
              <input
                type="file"
                accept={ACCEPTED_TYPES}
                onChange={handleFileChange}
                required
              />
              {file && <small className="file-selected">{file.name}</small>}
            </label>

            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Notes"}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default UploadNotes;
