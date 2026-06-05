import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NotesFeed from "../components/NotesFeed";
import { useCurrentUser } from "../hooks/useCurrentUser";
import "../styles/Dashboard.css";

function Dashboard() {
  const { displayName } = useCurrentUser();

  return (
    <div className="dashboard-page">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar />

        <main className="dashboard-content dashboard-content-enhanced">
          <div className="welcome-banner welcome-banner-enhanced">
            <div>
              <p className="welcome-eyebrow">Your library</p>
              <h1>Welcome back, {displayName}</h1>
              <p>
                Browse every note on StudyHub. Use View to read documents — download is available
                inside the viewer.
              </p>
            </div>
          </div>

          <div className="dashboard-quick-actions">
            <Link to="/upload" className="quick-action-card">
              <span className="quick-action-label">Upload</span>
              <span className="quick-action-hint">Add new material</span>
            </Link>
            <Link to="/mynotes" className="quick-action-card">
              <span className="quick-action-label">My Notes</span>
              <span className="quick-action-hint">Your uploads</span>
            </Link>
            <Link to="/savednotes" className="quick-action-card">
              <span className="quick-action-label">Saved</span>
              <span className="quick-action-hint">Bookmarks</span>
            </Link>
          </div>

          <NotesFeed
            limit={200}
            unifiedSearch
            title="All Notes"
            subtitle="Every published note — search by title, subject, branch, semester, or uploader."
            emptyMessage="No notes found."
          />
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;
