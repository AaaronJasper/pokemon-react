import { useNavigate, Link } from "react-router-dom";

export default function AccomplishedTrade({ trade }) {
  const navigate = useNavigate();
  const date = new Date(trade.updated_at);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  const formatted = `${year}-${month}-${day}`;

  return (
    <div className="trade-history-record">
      <div className="trade-history-content">
        <div className="trade-history-pokemon sender">
          <Link to={`/pokemon/${trade.sender_pokemon_id}`}>
            <img
              src={trade.sender_pokemon.image_url}
              alt={trade.sender_pokemon.name}
              className="trade-history-pokemon-image"
            />
          </Link>
        </div>
        <div className="trade-history-details">
          <div className="trade-history-pokemon-info">
            <p className="trade-history-pokemon-name">
              Name: {trade.sender_pokemon.name}
            </p>
            <p className="trade-history-pokemon-owner">
              Owner: {trade.sender.name}
            </p>
            <span className="trade-history-role-badge">Initiator</span>
          </div>
          <div className="trade-history-arrow">⇄</div>
          <div className="trade-history-pokemon-info">
            <p className="trade-history-pokemon-name">
              Name: {trade.receiver_pokemon.name}
            </p>
            <p className="trade-history-pokemon-owner">
              Owner: {trade.receiver.name}
            </p>
            <span className="trade-history-role-badge">Receiver</span>
          </div>
        </div>
        <div className="trade-history-pokemon receiver">
          <Link to={`/pokemon/${trade.receiver_pokemon_id}`}>
            <img
              src={trade.receiver_pokemon.image_url}
              alt={trade.receiver_pokemon.name}
              className="trade-history-pokemon-image"
            />
          </Link>
        </div>
      </div>
      <div className="trade-history-time">
        <p>{formatted}</p>
      </div>
    </div>
  );
}
