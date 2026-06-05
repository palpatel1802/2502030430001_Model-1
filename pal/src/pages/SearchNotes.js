import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import NotesFeed from "../components/NotesFeed";
import UserBackLink from "../components/UserBackLink";
import { useAuth } from "../context/AuthContext";
import "../styles/Dashboard.css";

function SearchNotes() {
  const { isAuthenticated } = useAuth();

  const content = (
    <>
      {isAuthenticated && <UserBackLink to="/dashboard" />}
      <div className="welcome-banner">
        <h1>Search Notes</h1>
        <p>Search the full public library by title, branch, semester, or subject.</p>
      </div>
      <NotesFeed
        isPublic={!isAuthenticated}
        limit={200}
        title="Search Results"
        subtitle="All matching notes from every user on StudyHub."
        emptyMessage="No notes found."
      />
    </>
  );

  if (!isAuthenticated) {
    return (
      <div className="home-container">
        <nav className="navbar">
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
        <main className="home-library-section">{content}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">{content}</main>
      </div>
      <Footer />
    </div>
  );
}

export default SearchNotes;
