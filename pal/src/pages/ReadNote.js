import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserBackLink from "../components/UserBackLink";
import DocumentViewer from "../components/DocumentViewer";
import { useAuth } from "../context/AuthContext";
import { notesAPI } from "../api/apiService";
import { downloadNoteToDevice } from "../utils/fileHelpers";
import { getFileUrl, getNoteId, normalizeNote } from "../utils/noteHelpers";
import "../styles/ReadNote.css";

function ReadNote() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [note, setNote] = useState(location.state ? normalizeNote(location.state) : null);
  const [isSaved, setIsSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("");
  const [loading, setLoading] = useState(Boolean(location.state));
  const noteId = getNoteId(note);

  useEffect(() => {
    const fetchNote = async () => {
      const idFromState = getNoteId(location.state);
      if (!idFromState) {
        setLoading(false);
        return;
      }

      try {
        const fresh = await notesAPI.getNoteById(idFromState);
        setNote(normalizeNote(fresh));
      } catch {
        if (location.state) setNote(normalizeNote(location.state));
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [location.state]);

  useEffect(() => {
    if (!isAuthenticated || !noteId) return undefined;

    const checkSaved = async () => {
      try {
        const response = await notesAPI.getSavedNotes();
        const ids = (response.data || []).map(getNoteId);
        setIsSaved(ids.includes(noteId));
      } catch {
        setIsSaved(false);
      }
    };

    checkSaved();
  }, [noteId, isAuthenticated]);

  const handleDownload = async () => {
    if (!note) return;
    try {
      setBusy(true);
      setDownloadStatus("");
      await downloadNoteToDevice(note, { recordOnServer: isAuthenticated });
      setDownloadStatus("File saved to your device.");
    } catch (error) {
      setDownloadStatus(error.message || "Download failed.");
    } finally {
      setBusy(false);
    }
  };

  const handleSaveToggle = async () => {
    if (!noteId || !isAuthenticated) return;

    try {
      setBusy(true);
      if (isSaved) {
        await notesAPI.unsaveNote(noteId);
        setIsSaved(false);
      } else {
        await notesAPI.saveNote(noteId);
        setIsSaved(true);
      }
    } catch (error) {
      alert(error.message || "Could not update saved list");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="read-note-page">
          <p className="page-status">Loading note...</p>
        </div>
      </>
    );
  }

  if (!note) {
    return (
      <>
        <Navbar />
        <div className="read-note-page">
          <UserBackLink to={isAuthenticated ? "/dashboard" : "/"} />
          <h2>No note selected</h2>
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="inline-action-link">
            Browse notes
          </Link>
        </div>
      </>
    );
  }

  const fileUrl = getFileUrl(note.fileUrl);

  return (
    <>
      <Navbar />

      <div className="read-note-page">
        <UserBackLink to={isAuthenticated ? "/dashboard" : "/"} />

        <div className="note-view-container">
          <header className="note-header">
            <div className="note-meta">
              <h1>{note.title}</h1>
              <div className="note-meta-grid">
                <span>
                  <strong>Subject:</strong> {note.subject}
                </span>
                <span>
                  <strong>Semester:</strong> {note.semester}
                </span>
                <span>
                  <strong>Branch:</strong> {note.course || "—"}
                </span>
                <span>
                  <strong>Uploaded by:</strong> {note.uploader}
                </span>
                {note.fileName && (
                  <span>
                    <strong>File:</strong> {note.fileName}
                  </span>
                )}
              </div>

              {note.description ? (
                <div className="note-description-panel">
                  <h2>Description</h2>
                  <p>{note.description}</p>
                </div>
              ) : (
                <div className="note-description-panel note-description-empty">
                  <p>No additional description provided.</p>
                </div>
              )}
            </div>

            <div className="note-actions">
              <button
                className="btn-viewer-action download-btn"
                type="button"
                onClick={handleDownload}
                disabled={busy || !fileUrl}
              >
                Download
              </button>
              {isAuthenticated && (
                <button
                  className={`btn-viewer-action ${isSaved ? "unsave-btn" : "save-btn"}`}
                  type="button"
                  onClick={handleSaveToggle}
                  disabled={busy}
                >
                  {isSaved ? "Remove from Saved" : "Save"}
                </button>
              )}
            </div>
          </header>

          {downloadStatus && <p className="download-status">{downloadStatus}</p>}

          <section className="document-viewer" aria-label="Document preview">
            {note.fileUrl ? (
              <DocumentViewer note={note} />
            ) : (
              <div className="pdf-box">
                <h2>No file attached</h2>
                <p>This note does not include an uploaded document.</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default ReadNote;
