import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./styles/Dashboard.css";

function About() {
  return (
    <div>
      <Navbar />

      <main className="dashboard-content">
        <div className="welcome-banner">
          <h1>About StudyHub</h1>
          <p>
            StudyHub helps students find, upload, save, and track study material
            for every course and semester.
          </p>
        </div>

        <div className="notes-grid">
          <div className="note-card">
            <h3>Shared Notes</h3>
            <p>Students can publish useful notes for classmates and juniors.</p>
          </div>

          <div className="note-card">
          <h3>Course Library</h3>
            <p>Notes can be organized by subject, semester, and course.</p>
          </div>

          <div className="note-card">
            <h3>Saved Notes</h3>
            <p>StudyHub keeps your saved notes and downloaded resources easy to revisit.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
