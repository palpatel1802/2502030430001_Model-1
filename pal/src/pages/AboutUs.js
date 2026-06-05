import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import "../styles/Dashboard.css";

function AboutUs() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        {isAuthenticated && <Sidebar />}
        <main className="dashboard-content">
          {isAuthenticated && <UserBackLink to="/dashboard" />}

          <div className="welcome-banner">
            <h1>About StudyHub</h1>
            <p>
              StudyHub is a collaborative platform designed for students to share, find, and organize academic resources.
            </p>
          </div>

          <div className="notes-grid">
            <article className="note-card">
              <h3>Our Mission</h3>
              <p>
                To simplify the academic journey by providing a centralized library for study guides and lecture notes.
              </p>
            </article>

            <article className="note-card">
              <h3>For Students, By Students</h3>
              <p>
                Upload your own notes, download resources for preparation, and save helpful notes to your personal bookmarks.
              </p>
            </article>

            <article className="note-card">
              <h3>Structured Learning</h3>
              <p>
                Navigate notes organized by program, course codes, subject, and semester.
              </p>
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AboutUs;
