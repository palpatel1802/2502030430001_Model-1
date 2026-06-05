import { Link, useLocation } from "react-router-dom";
import "../styles/Sidebar.css";

const menuItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/profile", label: "Profile" },
  { to: "/upload", label: "Upload Notes" },
  { to: "/search", label: "Search Notes" },
  { to: "/mynotes", label: "My Notes" },
  { to: "/savednotes", label: "Saved Notes" },
  { to: "/downloaded", label: "Downloaded Notes" },
  { to: "/settings", label: "Edit Profile" },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={location.pathname === item.to ? "active" : ""}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
