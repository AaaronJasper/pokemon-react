import { useState, useEffect } from "react";

export default function useAllPokemons() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pokemon")
      .then((response) => response.json())
      .then(async (res) => {
        const pokemonData = res.data.data;
        setPokemons(pokemonData);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return { pokemons };
}
