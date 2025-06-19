import React, { useEffect, useState } from "react";

export default function PokemonDescription({ pokemon }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pokemon?.id) return;

    setLoading(true);
    setError(null);

    fetch("http://127.0.0.1:8000/api/pokemon/describe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pokemon_id: pokemon.id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res);
        return res.json();
      })
      .then((data) => {
        setDescription(data.data.original.description || "");
      })
      .catch((err) => {
        setError(err.message);
        setDescription("");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pokemon]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return (
      <div className="pokemon-describe-loading-card">
        <div className="loading-message">
          <h2>Loading Pokémon Description...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-describe-card">
      <h3 className="pokemon-describe-title">{pokemon.name} Description</h3>
      <p className="pokemon-describe-content">
        {description || "No description available."}
      </p>
    </div>
  );
}
