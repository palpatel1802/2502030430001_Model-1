import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import { authAPI, usersAPI } from "../api/apiService";
import { syncLocalDownloadedNotes } from "../utils/fileHelpers";
import { getStoredUser } from "../utils/userHelpers";
import { useCurrentUser } from "../hooks/useCurrentUser";
import "../styles/Dashboard.css";
import "../styles/Profile.css";

function Profile() {
  const { user: contextUser, displayName } = useCurrentUser();
  const [user, setUser] = useState(contextUser || getStoredUser());
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");
        const freshUser = await authAPI.getCurrentUser();
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));

        const userId = freshUser.id || freshUser._id;
        if (userId) {
          await syncLocalDownloadedNotes();
          const statsResponse = await usersAPI.getUserStats(userId);
          setStats(statsResponse);
        }
      } catch (loadError) {
        setError(loadError.message || "Unable to load profile.");
        setUser(contextUser || getStoredUser());
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [contextUser]);

  const uploadedCount = stats?.notesUploaded || 0;
  const downloadedCount = stats?.downloadedNotes ?? user?.downloadedNotes?.length ?? 0;
  const savedCount = stats?.notesSaved ?? user?.savedNotes?.length ?? 0;

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/dashboard" />

          <div className="welcome-banner">
            <h1>Hello, {displayName}</h1>
            <p>Your StudyHub profile and learning activity.</p>
          </div>

          {error && <p className="auth-error">{error}</p>}

          {loading ? (
            <p className="page-status">Loading profile...</p>
          ) : (
            <div className="profile-layout">
              <section className="profile-card profile-hero">
                <div className="profile-avatar" aria-hidden="true">
                  {(user?.firstName?.[0] || "S").toUpperCase()}
                  {(user?.lastName?.[0] || "").toUpperCase()}
                </div>
                <div>
                  <h2>
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="profile-role">{user?.role || "student"}</p>
                  <p>
                    <strong>Email:</strong> {user?.email}
                  </p>
                </div>
              </section>

              <section className="profile-card">
                <h3>About</h3>
                <p className="profile-bio">
                  {user?.bio?.trim() ? user.bio : "Add a short bio from Edit Profile to personalize your profile."}
                </p>
              </section>

              <section className="profile-stats-grid" aria-label="Profile note metrics">
                <div className="profile-stat">
                  <span className="stat-value">{uploadedCount}</span>
                  <span className="stat-label">Notes Uploaded</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">{downloadedCount}</span>
                  <span className="stat-label">Downloaded Notes</span>
                </div>
                <div className="profile-stat">
                  <span className="stat-value">{savedCount}</span>
                  <span className="stat-label">Saved Notes</span>
                </div>
              </section>

              <div className="profile-actions">
                <Link to="/settings" className="inline-action-link">
                  Edit Profile
                </Link>
                <Link to="/mynotes" className="inline-action-link">
                  View My Notes
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Profile;
