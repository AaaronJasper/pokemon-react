import { useNavigate } from "react-router-dom";

export default function SelectPokemon({
  pokemon,
  type,
  ownPokemon,
  receivedPokemon,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/trade", {
      state: {
        ownPokemon: type === "own" ? pokemon : ownPokemon,
        receivedPokemon: type === "receive" ? pokemon : receivedPokemon,
      },
    });
  };

  return (
    <div className="pokemon-card" onClick={handleClick}>
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
