import { useEffect, useState, useContext } from "react";
import logo from "../../../public/International_Pokemon_logo.svg.png";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { RefreshCcw } from "lucide-react";
import useAllPokemons from "../../hooks/useAllPokemons";
import { UserContext } from "../../context/UserContext";

export default function TradePokemon() {
  const { pokemons } = useAllPokemons();
  const [trade, setTrade] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [tradePokemon, setTradePokemon] = useState(null);
  const [partnerPokemon, setPartnerPokemon] = useState(null);

  function setUpTradeDetail(data) {
    const sender = pokemons.find((p) => p.id === data.sender_pokemon_id);
    const receiver = pokemons.find((p) => p.id === data.receiver_pokemon_id);

    if (currentUser.id === data.sender_id) {
      if (sender) {
        setTradePokemon(sender);
      }
      if (receiver) {
        setPartnerPokemon(receiver);
      }
    } else {
      if (receiver) {
        setTradePokemon(receiver);
      }
      if (sender) {
        setPartnerPokemon(sender);
      }
    }
  }

  const handleTrade = async () => {
    if (!tradePokemon || !partnerPokemon) return;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender_pokemon_id: tradePokemon.id,
          receiver_pokemon_id: partnerPokemon.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Trade failed");
      }

      const result = await response.json();
      console.log(result);

      if (result.code !== 201) {
        alert(result.message);
        return;
      }

      setTrade({
        id: result.data.id,
        sender_id: result.data.sender_id,
        receiver_id: result.data.receiver_id,
        sender_pokemon_id: result.data.sender_pokemon_id,
        receiver_pokemon_id: result.data.receiver_pokemon_id,
      });
      alert("Initiate trade successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  const acceptTrade = async () => {
    if (!tradePokemon || !partnerPokemon) return;
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/trade/${trade.id}/accept`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Trade failed");
      }

      const result = await response.json();
      if (result.code !== 200) {
        setError(result.message);
        return;
      }
      setTrade({});
      setTradePokemon(null);
      setPartnerPokemon(null);
      setLoading(false);
      alert("Trade accomplished!");
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };

  const rejectTrade = async () => {
    if (!tradePokemon || !partnerPokemon) return;
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/trade/${trade.id}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Trade failed");
      }

      const result = await response.json();
      if (result.code !== 200) {
        setError(result.message);
        return;
      }
      setTrade({});
      setTradePokemon(null);
      setPartnerPokemon(null);
      setLoading(false);
      alert("Trade rejected!");
    } catch (err) {
      setLoading(false);
      alert(err.message);
    }
  };

  useEffect(() => {
    if (location.state?.ownPokemon) {
      setTradePokemon(location.state.ownPokemon);
    }
    if (location.state?.receivedPokemon) {
      setPartnerPokemon(location.state.receivedPokemon);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchTrade = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const res = await fetch("http://127.0.0.1:8000/api/trade", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          return;
        }

        const result = await res.json();

        setTrade({
          id: result.data.id,
          sender_id: result.data.sender_id,
          receiver_id: result.data.receiver_id,
          sender_pokemon_id: result.data.sender_pokemon_id,
          receiver_pokemon_id: result.data.receiver_pokemon_id,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrade();
  }, []);

  useEffect(() => {
    if (trade && trade.id !== undefined && pokemons.length > 0) {
      setUpTradeDetail(trade);
    }
  }, [trade, pokemons]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (loading) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="loading-message">
            <h2>Loading Trade Pokémon...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <img src={logo} alt="Pokemon Logo" className="logo" />
      <h1>Trade Pokémon</h1>
      <div className="trade-container">
        {!trade || trade.id === undefined ? (
          <>
            {tradePokemon && tradePokemon.image_url ? (
              <Link
                to="/choose_own_pokemon"
                className="no-underline"
                state={{
                  ownPokemon: tradePokemon,
                  receivedPokemon: partnerPokemon,
                }}
              >
                <div className="trade-pokemon-card">
                  <img src={tradePokemon.image_url} alt={tradePokemon.name} />
                  <h2>{tradePokemon.name}</h2>
                  <h3>{tradePokemon.race}</h3>
                  <p>Level: {tradePokemon.level}</p>
                  <p>Nature: {tradePokemon.nature}</p>
                  <p>Ability: {tradePokemon.ability}</p>
                  <p>Owner: {tradePokemon.user}</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/choose_own_pokemon"
                className="no-underline"
                state={{
                  ownPokemon: null,
                  receivedPokemon: partnerPokemon,
                }}
              >
                <div className="pokemon-card empty-card">
                  <div className="empty-card-content">
                    <h2>Select Your Pokémon</h2>
                    <p>Choose a Pokémon to trade</p>
                  </div>
                </div>
              </Link>
            )}
            {tradePokemon && partnerPokemon ? (
              <button className="trade-button" onClick={handleTrade}>
                <RefreshCcw size={40} />
              </button>
            ) : null}
            {partnerPokemon && partnerPokemon.image_url ? (
              <Link
                to="/choose_receive_pokemon"
                className="no-underline"
                state={{
                  ownPokemon: tradePokemon,
                  receivedPokemon: partnerPokemon,
                }}
              >
                <div className="trade-pokemon-card">
                  <img
                    src={partnerPokemon.image_url}
                    alt={partnerPokemon.name}
                  />
                  <h2>{partnerPokemon.name}</h2>
                  <h3>{partnerPokemon.race}</h3>
                  <p>Level: {partnerPokemon.level}</p>
                  <p>Nature: {partnerPokemon.nature}</p>
                  <p>Ability: {partnerPokemon.ability}</p>
                  <p>Owner: {partnerPokemon.user}</p>
                </div>
              </Link>
            ) : (
              <Link
                to="/choose_receive_pokemon"
                className="no-underline"
                state={{
                  ownPokemon: tradePokemon,
                  receivedPokemon: null,
                }}
              >
                <div className="pokemon-card empty-card">
                  <div className="empty-card-content">
                    <h2>Select Partner's Pokémon</h2>
                    <p>Choose a Pokémon to receive</p>
                  </div>
                </div>
              </Link>
            )}
          </>
        ) : (
          <>
            {tradePokemon && (
              <div className="trade-pokemon-card">
                <img src={tradePokemon.image_url} alt={tradePokemon.name} />
                <h2>{tradePokemon.name}</h2>
                <h3>{tradePokemon.race}</h3>
                <p>Level: {tradePokemon.level}</p>
                <p>Nature: {tradePokemon.nature}</p>
                <p>Ability: {tradePokemon.ability}</p>
                <p>Owner: {tradePokemon.user}</p>
              </div>
            )}
            {currentUser.id == trade.receiver_id ? (
              <div className="trade-button-group">
                <button
                  className="trade-button accept-button"
                  onClick={acceptTrade}
                >
                  Accept
                </button>
                <button
                  className="trade-button reject-button"
                  onClick={rejectTrade}
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="pending-container">
                <p className="pending-text">Waiting...</p>
              </div>
            )}
            {partnerPokemon && (
              <div className="trade-pokemon-card">
                <img src={partnerPokemon.image_url} alt={partnerPokemon.name} />
                <h2>{partnerPokemon.name}</h2>
                <h3>{partnerPokemon.race}</h3>
                <p>Level: {partnerPokemon.level}</p>
                <p>Nature: {partnerPokemon.nature}</p>
                <p>Ability: {partnerPokemon.ability}</p>
                <p>Owner: {partnerPokemon.user}</p>
              </div>
            )}
          </>
        )}
      </div>
      <div className="button-container">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
