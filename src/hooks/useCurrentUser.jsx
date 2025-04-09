import { useState, useEffect } from "react";

export default function useCurrentUser() {
    const [currentUser, setCurrentUser] = useState(null);
    
    useEffect(() => {
        // Get current user from session storage
        const userData = sessionStorage.getItem("user");
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setCurrentUser(parsedUser);
            } catch (error) {
                console.error("Error parsing user data:", error);
                setCurrentUser(null);
            }
        }
    }, []); // Empty dependency array means this only runs once on mount
    
    return currentUser;
}