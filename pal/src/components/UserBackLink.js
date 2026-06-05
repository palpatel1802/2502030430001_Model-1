import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getDisplayName, getStoredUser, syncCurrentUser } from "../utils/userHelpers";
import "../styles/UserBackLink.css";

function UserBackLink({ to = "/dashboard" }) {
  const [displayName, setDisplayName] = useState(() => getDisplayName(getStoredUser()));

  useEffect(() => {
    let active = true;
    syncCurrentUser().then((user) => {
      if (active && user) {
        setDisplayName(getDisplayName(user));
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <Link to={to} className="user-back-link" aria-label={`Back to dashboard, ${displayName}`}>
      <span className="user-back-arrow" aria-hidden="true">
        ←
      </span>
      <span className="user-back-name">{displayName}</span>
    </Link>
  );
}

export default UserBackLink;
