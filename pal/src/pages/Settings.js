import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import UserBackLink from "../components/UserBackLink";
import { usersAPI } from "../api/apiService";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { getStoredUser } from "../utils/userHelpers";
import "../styles/Dashboard.css";
import "../styles/Settings.css";

function Settings() {
  const { user: currentUser } = useCurrentUser();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    course: "B.Tech",
    semester: 1,
    bio: "",
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const user = currentUser || getStoredUser();
    if (!user) return;

    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      course: user.course || "B.Tech",
      semester: user.semester || 1,
      bio: user.bio || "",
    });
  }, [currentUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: name === "semester" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = currentUser || getStoredUser();
    const userId = user?.id || user?._id;

    if (!userId) {
      setError("Unable to identify your account. Please log in again.");
      return;
    }

    try {
      setSaving(true);
      setStatus("");
      setError("");
      const response = await usersAPI.updateProfile(userId, formData);
      localStorage.setItem("user", JSON.stringify(response.user));
      setStatus("Profile updated successfully.");
    } catch (saveError) {
      setError(saveError.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-content">
          <UserBackLink to="/dashboard" />
          <div className="welcome-banner">
            <h1>Settings</h1>
            <p>Manage your StudyHub preferences.</p>
          </div>

          <form className="settings-panel" onSubmit={handleSubmit}>
            <div className="settings-field-grid">
              <label>
                <span>First name</span>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Last name</span>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <div className="settings-field-grid">
              <label>
                <span>Course</span>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                <span>Semester</span>
                <select name="semester" value={formData.semester} onChange={handleChange}>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
              </select>
              </label>
            </div>

            <label className="settings-bio-field">
              <span>Bio</span>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="6"
                maxLength="600"
                placeholder="Share a short academic bio, interests, or study goals."
              />
            </label>

            {error && <p className="auth-error">{error}</p>}
            {status && <p className="settings-success">{status}</p>}

            <button className="settings-save-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Settings;
