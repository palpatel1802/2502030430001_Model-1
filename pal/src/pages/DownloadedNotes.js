import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard";
import UserBackLink from "../components/UserBackLink";
import { notesAPI } from "../api/apiService";
import { syncLocalDownloadedNotes } from "../utils/fileHelpers";
import { getNoteId, normalizeNote } from "../utils/noteHelpers";
import "../styles/Dashboard.css";

function DownloadedNotes() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDownloads = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      await syncLocalDownloadedNotes();
      const response = await notesAPI.getDownloadedNotes();
      setDownloads((response.data || []).map(normalizeNote).filter(Boolean));
    } catch (loadError) {
      setError(loadError.message || "Unable to load downloaded notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDownloads();
  }, [loadDownloads]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/dashboard" />
          <div className="welcome-banner">
            <h1>Downloaded Notes</h1>
            <p>Recently downloaded files and study references.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <div className="notes-grid">
            {loading ? (
              <p className="page-status">Loading downloaded notes...</p>
            ) : downloads.length === 0 ? (
              <div className="note-card">
                <h3>No downloads yet</h3>
                <p>Downloaded notes will appear in this list.</p>
              </div>
            ) : (
              downloads.map((note) => (
                <NoteCard key={getNoteId(note)} note={note} variant="downloaded" onChanged={loadDownloads} />
              ))
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default DownloadedNotes;
