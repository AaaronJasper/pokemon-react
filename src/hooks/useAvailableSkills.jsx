import { useState, useEffect } from "react";

export default function useAvailableSkills(id) {
    const [availableSkills, setAvailableSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await fetch(`http://127.0.0.1:8000/api/pokemon/${id}/enableSkill`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch available skills");
                }

                const data = await response.json();
                
                // Check if data is an array
                if (!Array.isArray(data)) {
                    console.error("Invalid skills data format:", data);
                    setAvailableSkills([]);
                    return;
                }
                
                setAvailableSkills(data);
            } catch (error) {
                console.error("Error fetching available skills:", error);
                setError(error.message);
                setAvailableSkills([]); // Set empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, [id]); // Only re-fetch when id changes

    return { availableSkills, loading, error };
}
