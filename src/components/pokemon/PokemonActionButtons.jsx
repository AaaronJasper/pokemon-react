import { Link } from "react-router-dom";

export default function PokemonDetailButtons({ currentUser, tradeUpdated }) {
  console.log(tradeUpdated);
  return (
    <div className="create-buttons-container">
      {currentUser ? (
        <>
          <Link to="/create_pokemon" className="create-button">
            Create New Pokémon {"\u002B"}
          </Link>
          <Link to="/create_pokemon_trait/nature" className="create-button">
            Create New Nature {"\u002B"}
          </Link>
          <Link to="/create_pokemon_trait/ability" className="create-button">
            Create New Ability {"\u002B"}
          </Link>
          <Link
            to="/trade"
            className="create-trade-button"
            onClick={() => {
              localStorage.setItem("hasTradeNotification", "false");
            }}
          >
            Trade {"\u002B"}
            {tradeUpdated && <span className="red-dot" />}
          </Link>
          <Link to="/trade_history" className="create-trade-button">
            Trade History
          </Link>
        </>
      ) : null}

      <Link to="/ranking" className="ranking-button">
        Ranking
      </Link>
    </div>
  );
}
