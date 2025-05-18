import { useState, useEffect } from "react";

export default function useAuthUser() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from local storage
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []);

  return [user, setUser];
}
