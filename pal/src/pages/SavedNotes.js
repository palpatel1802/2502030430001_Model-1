import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NoteCard from "../components/NoteCard";
import UserBackLink from "../components/UserBackLink";
import { notesAPI } from "../api/apiService";
import { getNoteId, normalizeNote } from "../utils/noteHelpers";
import "../styles/Dashboard.css";

function SavedNotes() {
  const [savedNotes, setSavedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSaved = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await notesAPI.getSavedNotes();
      setSavedNotes((response.data || []).map(normalizeNote));
    } catch (loadError) {
      setError(loadError.message || "Unable to load saved notes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/dashboard" />

          <div className="welcome-banner">
            <h1>Saved Notes</h1>
            <p>Bookmarked study material. Remove items you no longer need.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {loading ? (
            <p className="page-status">Loading saved notes...</p>
          ) : (
            <div className="notes-grid">
              {savedNotes.length === 0 ? (
                <div className="note-card empty-state-card">
                  <h3>No saved notes yet</h3>
                  <p>Save notes from the study library to build your collection.</p>
                </div>
              ) : (
                savedNotes.map((note) => (
                  <NoteCard
                    key={getNoteId(note)}
                    note={note}
                    variant="saved"
                    onChanged={loadSaved}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default SavedNotes;
