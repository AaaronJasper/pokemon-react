import { useState, useEffect } from "react";

export default function useAllPokemons() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://127.0.0.1:8000/api/pokemon", {
      headers: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    })
      .then((response) => response.json())
      .then(async (res) => {
        const pokemonData = res.data.data;
        setPokemons(pokemonData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return { pokemons };
}
