import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import "../styles/Dashboard.css";

function Services() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        {isAuthenticated && <Sidebar />}
        <main className="dashboard-content">
          {isAuthenticated && <UserBackLink to="/dashboard" />}

          <div className="welcome-banner">
            <h1>Our Services</h1>
            <p>Explore the features and resources StudyHub provides to make academic prep seamless.</p>
          </div>

          <div className="notes-grid">
            <article className="note-card">
              <h3>Collaborative Library</h3>
              <p>
                Browse notes shared by fellow students. Search and filter by course code, semester, or subject.
              </p>
            </article>

            <article className="note-card">
              <h3>Content Management</h3>
              <p>
                Upload notes in PDF, Word, PowerPoint, or text formats. Edit, manage, and track downloads of your uploaded documents.
              </p>
            </article>

            <article className="note-card">
              <h3>Personal Dashboard</h3>
              <p>
                Save notes to your bookmarks for quick offline/online reading. Manage your academic profile settings.
              </p>
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Services;
