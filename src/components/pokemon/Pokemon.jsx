import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Pokemon({ pokemon, user }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(pokemon.is_liked);

  const handleLikeClick = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to like a Pokémon.");
      return;
    }

    const prevLiked = liked;
    setLiked(!liked);

    const url = liked
      ? "http://127.0.0.1:8000/api/unlike"
      : "http://127.0.0.1:8000/api/like";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pokemon_id: pokemon.id }),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      pokemon.is_liked = !pokemon.is_liked;
    } catch (error) {
      console.error("Error while sending like request:", error);
      alert("Action failed, please try again later.");
      // Revert UI if request fails
      setLiked(prevLiked);
    }
  };

  const handleClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="pokemon-card" onClick={handleClick}>
      {user && (
        <button
          className={`pokemon-like-button ${liked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            handleLikeClick(pokemon.id);
          }}
        >
          {liked ? "❤️" : "🤍"}
        </button>
      )}

      <img src={pokemon.image_url} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
      <h3>{pokemon.race}</h3>
      <p>Level: {pokemon.level}</p>
      <p>Nature: {pokemon.nature}</p>
      <p>Ability: {pokemon.ability}</p>
      <p>Owner: {pokemon.user}</p>
    </div>
  );
}
