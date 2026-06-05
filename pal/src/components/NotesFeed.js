import { useCallback, useEffect, useState } from "react";
import { notesAPI } from "../api/apiService";
import { getNoteId, normalizeNote } from "../utils/noteHelpers";
import NoteCard from "./NoteCard";
import PublicNoteCard from "./PublicNoteCard";
import UnifiedSearchBar from "./UnifiedSearchBar";
import "../styles/NotesFeed.css";

function NotesFeed({
  isPublic = false,
  limit = 100,
  unifiedSearch = true,
  title = "Study Notes Library",
  subtitle = "Browse notes from every course, branch, and semester.",
  emptyMessage = "No notes match your search yet.",
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuery, setActiveQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = { limit: String(limit) };
      if (activeQuery.trim()) params.search = activeQuery.trim();

      const response = await notesAPI.getAllNotes(params);
      setNotes((response.data || []).map(normalizeNote));
      setTotal(response.pagination?.total ?? response.data?.length ?? 0);
    } catch (loadError) {
      setError(
        loadError.message?.includes("Failed to fetch")
          ? "Cannot reach the server. Start the API with: cd server && npm run dev"
          : loadError.message || "Unable to load notes."
      );
      setNotes([]);
    } finally {
      setLoading(false);
    }
  }, [activeQuery, limit]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleSearchSubmit = (query) => {
    setActiveQuery(query.trim());
  };

  const CardComponent = isPublic ? PublicNoteCard : NoteCard;

  return (
    <section className="notes-feed">
      <div className="notes-feed-header">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {!loading && (
            <span className="notes-count">
              {total} note{total === 1 ? "" : "s"} available
            </span>
          )}
        </div>
      </div>

      {unifiedSearch && (
        <UnifiedSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSubmit={handleSearchSubmit}
        />
      )}

      {error && <p className="auth-error">{error}</p>}

      {loading ? (
        <p className="page-status">Loading notes...</p>
      ) : (
        <div className="notes-grid">
          {notes.length === 0 ? (
            <div className="note-card empty-state-card">
              <h3>{emptyMessage}</h3>
              <p>Try a different search term or check back later.</p>
            </div>
          ) : (
            notes.map((note) =>
              isPublic ? (
                <CardComponent key={getNoteId(note)} note={note} />
              ) : (
                <CardComponent key={getNoteId(note)} note={note} variant="library" onChanged={loadNotes} />
              )
            )
          )}
        </div>
      )}
    </section>
  );
}

export default NotesFeed;
