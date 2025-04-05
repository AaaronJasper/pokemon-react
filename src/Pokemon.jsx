import { useNavigate } from "react-router-dom";

export default function Pokemon({ pokemon, image }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/pokemon/${pokemon.id}`);
  };

  return (
    <div className="pokemon-card" onClick={handleClick}>
      <img src={image} alt={pokemon.name} />
      <h2>{pokemon.name}</h2>
      <h3>{pokemon.race}</h3>
      <p>Level: {pokemon.level}</p>
      <p>Nature: {pokemon.nature}</p>
      <p>Ability: {pokemon.ability}</p>
      <p>Owner: {pokemon.user}</p>
    </div>
  );
}
