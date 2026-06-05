import { useNavigate } from "react-router-dom";
import { formatFileSize, normalizeNote } from "../utils/noteHelpers";
import "../styles/NoteCard.css";

function PublicNoteCard({ note }) {
  const navigate = useNavigate();
  const normalized = normalizeNote(note);

  const handleView = () => {
    navigate("/login", {
      state: {
        from: "/readnote",
        note: normalized,
        prompt: "Please log in to view this note.",
      },
    });
  };

  return (
    <article className="note-card">
      <div className="note-card-header">
        <span className="note-file-badge">{normalized.fileName ? "Document" : "Note"}</span>
        {normalized.course && <span className="note-file-meta">{normalized.course}</span>}
      </div>

      <h3>{normalized.title}</h3>
      <p>
        <strong>Subject:</strong> {normalized.subject}
      </p>
      <p>
        <strong>Semester:</strong> {normalized.semester}
      </p>
      <p>
        <strong>Branch / Course:</strong> {normalized.course || "—"}
      </p>
      <p>
        <strong>Uploaded By:</strong> {normalized.uploader}
      </p>
      {normalized.fileName && (
        <p className="note-filename">
          <strong>File:</strong> {normalized.fileName} ({formatFileSize(normalized.fileSize)})
        </p>
      )}

      <div className="card-buttons variant-single">
        <button className="btn-card-action view-btn" type="button" onClick={handleView}>
          View
        </button>
      </div>
    </article>
  );
}

export default PublicNoteCard;
