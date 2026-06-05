import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import "../styles/Dashboard.css";

function ContactUs() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        {isAuthenticated && <Sidebar />}
        <main className="dashboard-content">
          {isAuthenticated && <UserBackLink to="/dashboard" />}

          <div className="welcome-banner">
            <h1>Contact Us</h1>
            <p>Have questions, feedback, or need technical assistance? We are here to help!</p>
          </div>

          <div className="notes-grid">
            <article className="note-card">
              <h3>Support Email</h3>
              <p>Email our helpdesk at:</p>
              <p><strong>support@studyhub.com</strong></p>
              <p>We aim to respond to all inquiries within 24 hours.</p>
            </article>

            <article className="note-card">
              <h3>Content Takedown</h3>
              <p>For copyright concerns or inappropriate content complaints, contact:</p>
              <p><strong>takedowns@studyhub.com</strong></p>
            </article>

            <article className="note-card">
              <h3>Working Hours</h3>
              <p>Monday – Friday: 9:00 AM – 6:00 PM</p>
              <p>Saturday: 10:00 AM – 2:00 PM</p>
              <p>Sunday: Closed</p>
            </article>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default ContactUs;
