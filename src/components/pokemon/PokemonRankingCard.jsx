export default function PokemonRankingCard({ pokemon, rank }) {
  const handleClick = () => {
    if (pokemon && pokemon.id) {
      window.location.href = `/pokemon/${pokemon.id}`;
    }
  };
  return (
    <div
      className="pokemon-card"
      onClick={handleClick}
      style={{ cursor: "pointer", position: "relative" }}
    >
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background:
            rank === 1
              ? "#FFD700"
              : rank === 2
              ? "#b0b0b0"
              : rank === 3
              ? "#cd7f32"
              : "#703fec",
          color: rank === 1 ? "#703fec" : "white",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: 18,
          boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
          zIndex: 2,
          border: rank === 1 ? "2px solid #fff" : undefined,
        }}
      >
        {rank}
      </div>
      <img src={pokemon.image_url} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
      <h3>{pokemon.race}</h3>
      <p>Owner: {pokemon.user.name}</p>
      <p style={{ fontWeight: 500, color: "#703fec", marginTop: 8 }}>
        ❤️ {pokemon.liked_by_users_count ?? 0} Likes
      </p>
    </div>
  );
}
