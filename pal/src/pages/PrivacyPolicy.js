import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import "../styles/Dashboard.css";

function PrivacyPolicy() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        {isAuthenticated && <Sidebar />}
        <main className="dashboard-content">
          {isAuthenticated && <UserBackLink to="/dashboard" />}

          <div className="welcome-banner">
            <h1>Privacy Policy</h1>
            <p>Your privacy is important to us. Read how we manage and protect your personal information.</p>
          </div>

          <div className="notes-grid">
            <article className="note-card">
              <h3>Information Collection</h3>
              <p>
                We collect your name, email, academic branch, and semester when you register an account to personalize your dashboard.
              </p>
            </article>

            <article className="note-card">
              <h3>Upload Protection</h3>
              <p>
                Document uploads are stored securely on our servers. Files uploaded publicly are accessible by other registered users.
              </p>
            </article>

            <article className="note-card">
              <h3>Security & Tracking</h3>
              <p>
                We use secure tokens to maintain your session. We do not sell or share your personal account information with third parties.
              </p>
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
