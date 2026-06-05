import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notesAPI } from "../api/apiService";
import { formatFileSize, getNoteId, normalizeNote } from "../utils/noteHelpers";
import "../styles/NoteCard.css";

function NoteCard({ note, variant = "library", onChanged }) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const normalized = normalizeNote(note);
  const noteId = getNoteId(normalized);

  const handleView = () => {
    navigate("/readnote", { state: normalized });
  };

  const runAction = async (action) => {
    try {
      setBusy(true);
      await action();
      if (onChanged) onChanged();
    } catch (error) {
      alert(error.message || "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSave = () =>
    runAction(async () => {
      await notesAPI.saveNote(noteId);
    });

  const handleUnsave = () =>
    runAction(async () => {
      await notesAPI.unsaveNote(noteId);
    });

  const handleDelete = () => {
    if (!window.confirm(`Delete "${normalized.title}" permanently?`)) return;
    runAction(async () => {
      await notesAPI.deleteNote(noteId);
    });
  };

  const handleEdit = () => {
    navigate(`/editnote/${noteId}`);
  };

  return (
    <article className="note-card">
      <div className="note-card-header">
        <span className="note-file-badge">{normalized.fileName ? "Document" : "Note"}</span>
        {normalized.fileName && <span className="note-file-meta">{formatFileSize(normalized.fileSize)}</span>}
      </div>

      <h3>{normalized.title}</h3>

      <p>
        <strong>Subject:</strong> {normalized.subject}
      </p>

      <p>
        <strong>Semester:</strong> {normalized.semester}
      </p>

      <p>
        <strong>Uploaded By:</strong> {normalized.uploader}
      </p>

      {normalized.fileName && (
        <p className="note-filename" title={normalized.fileName}>
          <strong>File:</strong> {normalized.fileName}
        </p>
      )}

      {normalized.description && <p className="note-description">{normalized.description}</p>}

      <div className={`card-buttons variant-${variant}`}>
        {variant === "library" && (
          <>
            <button className="btn-card-action save-btn" type="button" onClick={handleSave} disabled={busy}>
              Save
            </button>
            <button className="btn-card-action view-btn" type="button" onClick={handleView} disabled={busy}>
              View
            </button>
          </>
        )}

        {variant === "saved" && (
          <>
            <button className="btn-card-action unsave-btn" type="button" onClick={handleUnsave} disabled={busy}>
              Remove
            </button>
            <button className="btn-card-action view-btn" type="button" onClick={handleView} disabled={busy}>
              View
            </button>
          </>
        )}

        {variant === "downloaded" && (
          <button className="btn-card-action view-btn" type="button" onClick={handleView} disabled={busy}>
            View
          </button>
        )}

        {variant === "owned" && (
          <>
            <button className="btn-card-action edit-btn" type="button" onClick={handleEdit} disabled={busy}>
              Edit
            </button>
            <button className="btn-card-action delete-btn" type="button" onClick={handleDelete} disabled={busy}>
              Delete
            </button>
            <button className="btn-card-action view-btn" type="button" onClick={handleView} disabled={busy}>
              View
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default NoteCard;
