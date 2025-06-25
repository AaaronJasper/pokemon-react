import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../../../public/International_Pokemon_logo.svg.png";
import "../../styles/components/pokemonCard.css";
import PokemonRankingCard from "./PokemonRankingCard";

export default function PokemonLikeRanking() {
  const [topPokemons, setTopPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/ranking/top-liked")
      .then((res) => res.json())
      .then((res) => {
        setTopPokemons(Array.isArray(res.data) ? res.data.slice(0, 10) : []);
        setLoading(false);
      })
      .catch((error) => {
        setError("Failed to fetch ranking");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="loading-message">
            <h2>Loading Pokemon Ranking...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  // Podium logic
  const podium = topPokemons.slice(0, 3);
  const rest = topPokemons.slice(3);

  return (
    <div className="container">
      <header className="header">
        <Link to="/">
          <img src={logo} alt="Pokemon Logo" className="pokemon-ranking-logo" />
        </Link>
        <h1 style={{ textAlign: "center", marginBottom: 24 }}>
          Most Liked Pokémon
        </h1>

        <div className="pokemon-ranking-stage">
          <div className="pokemon-ranking-podium-row">
            <div className="pokemon-ranking-podium-slot pokemon-ranking-slot-left">
              {podium[1] && (
                <div className="pokemon-ranking-card-wrapper pokemon-ranking-card-second">
                  <PokemonRankingCard pokemon={podium[1]} rank={2} />
                </div>
              )}
            </div>
            <div className="pokemon-ranking-podium-slot pokemon-ranking-slot-center">
              {podium[0] && (
                <div className="pokemon-ranking-card-wrapper pokemon-ranking-card-first">
                  <PokemonRankingCard pokemon={podium[0]} rank={1} />
                </div>
              )}
            </div>
            <div className="pokemon-ranking-podium-slot pokemon-ranking-slot-right">
              {podium[2] && (
                <div className="pokemon-ranking-card-wrapper pokemon-ranking-card-third">
                  <PokemonRankingCard pokemon={podium[2]} rank={3} />
                </div>
              )}
            </div>
          </div>

          {rest.length > 0 && (
            <div className="pokemon-ranking-rest-row">
              {rest.map((pokemon, idx) => (
                <div key={pokemon.id} className="pokemon-ranking-rest-card">
                  <PokemonRankingCard pokemon={pokemon} rank={idx + 4} />
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}
