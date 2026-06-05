import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDisplayName, getStoredUser, syncCurrentUser } from "../utils/userHelpers";

export function useCurrentUser() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser || getStoredUser());
  const [displayName, setDisplayName] = useState(() => getDisplayName(authUser || getStoredUser()));

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setDisplayName(getDisplayName(authUser));
      return undefined;
    }

    let active = true;
    syncCurrentUser().then((freshUser) => {
      if (active && freshUser) {
        setUser(freshUser);
        setDisplayName(getDisplayName(freshUser));
      }
    });

    return () => {
      active = false;
    };
  }, [authUser]);

  return { user, displayName };
}
