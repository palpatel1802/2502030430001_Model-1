import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard";
import UserBackLink from "../components/UserBackLink";
import { notesAPI } from "../api/apiService";
import { getNoteId, normalizeNote } from "../utils/noteHelpers";
import "../styles/Dashboard.css";

function MyNotes() {
  const [myUploads, setMyUploads] = useState([]);
  const [savedFromLibrary, setSavedFromLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [mineResponse, savedResponse] = await Promise.all([
        notesAPI.getMyNotes(),
        notesAPI.getSavedNotes(),
      ]);

      const uploads = (mineResponse.data || []).map(normalizeNote);
      const myIds = new Set(uploads.map(getNoteId));
      const savedOnly = (savedResponse.data || [])
        .map(normalizeNote)
        .filter((note) => !myIds.has(getNoteId(note)));

      setMyUploads(uploads);
      setSavedFromLibrary(savedOnly);
    } catch (loadError) {
      setError(loadError.message || "Unable to load your notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/dashboard" />

          <div className="welcome-banner">
            <h1>My Notes</h1>
            <p>Your uploads and saved study material in one place.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {loading ? (
            <p className="page-status">Loading your notes...</p>
          ) : (
            <>
              <section className="notes-section">
                <div className="section-heading">
                  <h2>My Uploads</h2>
                  <Link to="/upload" className="section-link">
                    Upload new
                  </Link>
                </div>

                <div className="notes-grid">
                  {myUploads.length === 0 ? (
                    <div className="note-card empty-state-card">
                      <h3>No uploads yet</h3>
                      <p>Use Upload Notes to add your first document.</p>
                      <Link to="/upload" className="inline-action-link">
                        Go to Upload
                      </Link>
                    </div>
                  ) : (
                    myUploads.map((note) => (
                      <NoteCard
                        key={getNoteId(note)}
                        note={note}
                        variant="owned"
                        onChanged={loadNotes}
                      />
                    ))
                  )}
                </div>
              </section>

              <section className="notes-section">
                <div className="section-heading">
                  <h2>Saved in My Collection</h2>
                  <Link to="/savednotes" className="section-link">
                    View all saved
                  </Link>
                </div>

                <div className="notes-grid">
                  {savedFromLibrary.length === 0 ? (
                    <div className="note-card empty-state-card">
                      <h3>No saved notes here</h3>
                      <p>Save notes from Search or Dashboard to see them listed below your uploads.</p>
                    </div>
                  ) : (
                    savedFromLibrary.map((note) => (
                      <NoteCard
                        key={getNoteId(note)}
                        note={note}
                        variant="saved"
                        onChanged={loadNotes}
                      />
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default MyNotes;
