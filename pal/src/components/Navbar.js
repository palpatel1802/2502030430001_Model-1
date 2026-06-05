import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) {
    return (
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
    );
  }

  return (
    <nav className="navbar navbar-minimal">
      <Link to="/dashboard" className="logo">
        StudyHub
      </Link>
      <button type="button" className="signup-btn nav-logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
