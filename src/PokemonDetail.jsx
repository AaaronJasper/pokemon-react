import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonImage, setPokemonImage] = useState(null);

  useEffect(() => {
    // Fetch Pokémon details
    fetch(`http://127.0.0.1:8000/api/pokemon/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokemon not found");
        }
        return response.json();
      })
      .then((res) => {
        const pokemonData = res.data;
        setPokemon(pokemonData);
        console.log(pokemonData);
        // Fetch Pokémon image from PokeAPI
        return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.race}`);
      })
      .then((response) => response.json())
      .then((pokeData) => {
        setPokemonImage(pokeData.sprites.other["official-artwork"].front_default);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pokemon-detail">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-detail">
        <div className="error-message">Error: {error}</div>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="pokemon-detail">
        <div className="error-message">Pokémon not found</div>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="pokemon-detail">
      <div className="pokemon-detail-card">
        <h2>{pokemon.name}</h2>
        {pokemonImage && (
          <img 
            src={pokemonImage} 
            alt={pokemon.name} 
          />
        )}
        <div className="pokemon-info">
          <div className="info-section">
            <div className="info-group">
              <label>Race:</label>
              <span>{pokemon.race}</span>
            </div>
            <div className="info-group">
              <label>Level:</label>
              <span>{pokemon.level}</span>
            </div>
            <div className="info-group">
              <label>Nature:</label>
              <span>{pokemon.nature}</span>
            </div>
            <div className="info-group">
              <label>Ability:</label>
              <span>{pokemon.ability}</span>
            </div>
            <div className="info-group">
              <label>Owner:</label>
              <span>{pokemon.user}</span>
            </div>
          </div>
          <div className="info-section">
            <div className="info-group">
              <label>Skill 1:</label>
              <span>{pokemon.skill1 ? pokemon.skill1 : "Not Learned"}</span>
            </div>
            <div className="info-group">
              <label>Skill 2:</label>
              <span>{pokemon.skill2 ? pokemon.skill2 : "Not Learned"}</span>
            </div>
            <div className="info-group">
              <label>Skill 3:</label>
              <span>{pokemon.skill3 ? pokemon.skill3 : "Not Learned"}</span>
            </div>
            <div className="info-group">
              <label>Skill 4:</label>
              <span>{pokemon.skill4 ? pokemon.skill4 : "Not Learned"}</span>
            </div>
          </div>
        </div>
        <button className="back-button" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    </div>
  );
} 