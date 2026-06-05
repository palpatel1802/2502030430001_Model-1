import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../api/apiService";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await authAPI.login(formData);
      login(response.user, response.token);

      if (location.state?.note) {
        navigate("/readnote", { replace: true, state: location.state.note });
        return;
      }

      const redirectTo =
        (typeof location.state?.from === "string" && location.state.from) || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (apiError) {
      setError(apiError.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="auth-logo">
          <h1>StudyHub</h1>
          <p>Welcome Back</p>
        </div>

        {location.state?.prompt && (
          <p className="auth-info">{location.state.prompt}</p>
        )}

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account?
          <Link to="/signup"> Signup</Link>
        </p>

        <p className="auth-link">
          <Link to="/">← Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
