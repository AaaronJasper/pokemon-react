export default function Pokemon({ pokemon, image }) {
  return (
    <div className="pokemon-card">
      <img src={image} alt={pokemon.race} />
      <h2>{pokemon.name}</h2>
      <h3>Level: {pokemon.level}</h3>
      <p>Race: {pokemon.race}</p>
      <p>Nature: {pokemon.nature}</p>
      <p>Ability: {pokemon.ability}</p>
      <p>Trainer: {pokemon.user}</p>
    </div>
  );
}
