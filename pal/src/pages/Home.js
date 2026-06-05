import { Link } from "react-router-dom";
import NotesFeed from "../components/NotesFeed";
import Footer from "../components/Footer";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <nav className="navbar navbar-guest">
        <Link to="/" className="logo">
          StudyHub
        </Link>
        <div className="nav-buttons">
          <Link to="/login" className="login-btn">
            Login
          </Link>
          <Link to="/signup" className="signup-btn">
            Signup
          </Link>
        </div>
      </nav>

      <section className="hero-section hero-section-compact">
        <h1>Find Study Notes For Every Subject, Semester &amp; Branch</h1>
        <p>
          Search the public library below. Log in to view full documents, save notes, and upload your
          own material.
        </p>
      </section>

      <section className="home-library-section">
        <NotesFeed
          isPublic
          limit={200}
          unifiedSearch
          title="All Study Notes"
          subtitle="Search across every upload — all branches, semesters, and subjects in one place."
          emptyMessage="No notes match your search."
        />
      </section>

      <Footer />
    </div>
  );
}

export default Home;
