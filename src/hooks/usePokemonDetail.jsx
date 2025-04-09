import { useState, useEffect, useCallback } from "react";

export default function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonImage, setPokemonImage] = useState(null);

  // Function to clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Function to fetch Pokémon details
  const fetchPokemonDetails = useCallback(async () => {
    console.log("fetching pokemon details")
    try {
      setLoading(true);
      setError(null);
      
      // Fetch Pokémon details
      const response = await fetch(`http://127.0.0.1:8000/api/pokemon/${id}`);
      if (!response.ok) {
        throw new Error("Pokemon not found");
      }
      
      const res = await response.json();
      const pokemonData = res.data;
      setPokemon(pokemonData);
      
      // Fetch Pokémon image from PokeAPI
      const imageResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.race}`);
      const pokeData = await imageResponse.json();
      setPokemonImage(pokeData.sprites.other["official-artwork"].front_default);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Function to update Pokémon basic info
  const updatePokemon = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/pokemon/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to update Pokémon");
      }
      
      const data = await response.json();
      setPokemon(data.data);
      return data.data;
    } catch (error) {
      console.error("Error updating Pokémon:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to update Pokémon skills
  const updatePokemonSkills = async (skills) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/pokemon/${id}/skill`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(skills)
      });
      
      const data = await response.json();
      if (data.code !== 201) {
        throw new Error(data.message || "Failed to update skills");
      }
      
      setPokemon(prev => ({
        ...prev,
        ...data.data
      }));
      return data.data;
    } catch (error) {
      console.error("Error updating skills:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete Pokémon
  const deletePokemon = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = sessionStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:8000/api/pokemon/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete Pokémon");
      }
      
      return true; // Return true on successful deletion
    } catch (error) {
      console.error("Error deleting Pokémon:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch Pokémon details on mount or when id changes
  useEffect(() => {
    fetchPokemonDetails();
  }, [fetchPokemonDetails]);

  return { 
    pokemon, 
    loading, 
    error, 
    pokemonImage,
    updatePokemon,
    updatePokemonSkills,
    deletePokemon,
    clearError
  };
}
