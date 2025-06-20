import { Link } from "react-router-dom";

export default function PokemonDetailButtons() {
  return (
    <div className="create-buttons-container">
      <Link to="/create_pokemon" className="create-button">
        Create New Pokémon {"\u002B"}
      </Link>
      <Link to="/create_pokemon_trait/nature" className="create-button">
        Create New Nature {"\u002B"}
      </Link>
      <Link to="/create_pokemon_trait/ability" className="create-button">
        Create New Ability {"\u002B"}
      </Link>
      <Link to="/trade" className="create-trade-button">
        Trade {"\u002B"}
      </Link>
      <Link to="/trade_history" className="create-trade-button">
        Trade History
      </Link>
    </div>
  );
}
