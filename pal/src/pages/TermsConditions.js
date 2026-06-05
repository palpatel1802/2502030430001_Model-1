import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import "../styles/Dashboard.css";

function TermsConditions() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        {isAuthenticated && <Sidebar />}
        <main className="dashboard-content">
          {isAuthenticated && <UserBackLink to="/dashboard" />}

          <div className="welcome-banner">
            <h1>Terms &amp; Conditions</h1>
            <p>Please read these Terms and Conditions carefully before using the StudyHub platform.</p>
          </div>

          <div className="notes-grid">
            <article className="note-card">
              <h3>User Responsibilities</h3>
              <p>
                By uploading study material, you confirm that you possess the necessary copyrights or permissions to share the document.
              </p>
            </article>

            <article className="note-card">
              <h3>Prohibited Content</h3>
              <p>
                Spamming, commercial advertising, uploading copyright-violating text books, or abusive content is strictly prohibited.
              </p>
            </article>

            <article className="note-card">
              <h3>Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate accounts that violate our community policies or engage in abusive uploads.
              </p>
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default TermsConditions;
