import { useState, useEffect } from "react";

export default function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from local storage
    const userData = localStorage.getItem("user");
    const expiry = localStorage.getItem("expiry");

    const now = new Date().getTime();
    const expiryTime = parseInt(expiry, 10);

    if (userData && expiry) {
      if (now < expiryTime) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error("Error parsing user data:", error);
          setUser(null);
        }
      } else {
        // expired
        localStorage.removeItem("user");
        localStorage.removeItem("expiry");
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  return [user, setUser];
}
