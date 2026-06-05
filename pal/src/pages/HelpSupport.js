import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import "../styles/Dashboard.css";

function HelpSupport() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        {isAuthenticated && <Sidebar />}
        <main className="dashboard-content">
          {isAuthenticated && <UserBackLink to="/dashboard" />}

          <div className="welcome-banner">
            <h1>Help & Support</h1>
            <p>Find answers for uploads, notes, saved items, and account access.</p>
          </div>

          <div className="notes-grid">
            <div className="note-card">
              <h3>Uploading notes</h3>
              <p>Upload PDF, Word, PowerPoint, Excel, or image files with title, subject, and semester.</p>
            </div>
            <div className="note-card">
              <h3>Saving notes</h3>
              <p>Use saved notes to keep useful resources in one place for quick access later.</p>
            </div>
            <div className="note-card">
              <h3>Account help</h3>
              <p>Keep your email current from Profile so StudyHub can identify your uploads.</p>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default HelpSupport;
