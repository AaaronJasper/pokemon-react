import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pokemon from "./Pokemon";
import logo from "../../../public/International_Pokemon_logo.svg.png";
import useAllPokemons from "../../hooks/useAllPokemons";
import { UserContext } from "../../context/UserContext";
import { TradeNotificationContext } from "../../context/TradeNotificationContext";
import Pagination from "../common/Pagination";
import SendVerifyEmail from "../auth/SendVerifyEmail";
import useSortedData from "../../hooks/useSortedData";
import PokemonActionButtons from "./PokemonActionButtons";
import socket from "../socket";

export default function App() {
  const { pokemons } = useAllPokemons();
  const [ownPokemons, setOwnPokemons] = useState(false);
  const [likePokemons, setLikePokemons] = useState(false);
  const { sortedPokemons, sortKey, sortOrder, handleSort } = useSortedData(
    pokemons,
    "id",
    "desc"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [latestTradeUpdate, setLatestTradeUpdate] = useContext(
    TradeNotificationContext
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const searchRef = useRef();
  const tradeUpdated =
    localStorage.getItem("hasTradeNotification") === "true" &&
    latestTradeUpdate !== null;

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    // Get the token from local storage
    const token = localStorage.getItem("token");

    // Call the logout API endpoint
    fetch("http://127.0.0.1:8000/api/user/logout", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Logout failed");
        }
        return response.json();
      })
      .then((data) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("expiry");
        localStorage.removeItem("userId");
        // Update state
        setCurrentUser(null);
        setOwnPokemons(false);
        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setCurrentUser(null);
        setOwnPokemons(false);
        navigate("/");
      });
  };

  const filteredPokemons = (sortedPokemons || []).filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.race.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.nature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.ability.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.level.toString().includes(searchQuery);

    //if only want user's pokemon, then check pokemon's user and user.name
    //if user want to show all pokemons and !ownPokemons will be true, so all pokemon can be shown
    const isOwnedByUser =
      !ownPokemons ||
      (currentUser !== null && pokemon.user === currentUser.name);

    const isLikedFilterPassed = !likePokemons || pokemon.is_liked === true;

    return matchesSearch && isOwnedByUser && isLikedFilterPassed;
  });

  const pokemonElements = filteredPokemons
    .slice(startIndex, endIndex)
    .map((pokemon) => {
      return <Pokemon key={pokemon.id} pokemon={pokemon} user={currentUser} />;
    });

  useEffect(() => {
    if (latestTradeUpdate && latestTradeUpdate.status) {
      localStorage.setItem("hasTradeNotification", "true");
    }
  }, [latestTradeUpdate]);

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <div className="auth-buttons">
          {currentUser ? (
            <div className="user-info">
              <span className="user-name">Welcome, {currentUser.name}</span>
              <button
                className="auth-button logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
              {!currentUser.isVerify && <SendVerifyEmail />}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button className="auth-button login-button">Login</button>
              </Link>
              <Link to="/register">
                <button className="auth-button register-button">
                  Register
                </button>
              </Link>
            </>
          )}
        </div>

        <img src={logo} alt="Pokemon Logo" className="logo" />
        <h1>Pokémon Collection</h1>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search by name, race, nature, ability, user, or level..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-input"
            ref={searchRef}
          />
          <div className="sort-buttons">
            <button
              className={`sort-button ${sortKey === "id" ? "active" : ""}`}
              onClick={() => handleSort("id")}
            >
              Sort {sortKey === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              className={`sort-button ${sortKey === "level" ? "active" : ""}`}
              onClick={() => handleSort("level")}
            >
              Level{" "}
              {sortKey === "level" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </button>
            <button
              className={`own-button ${ownPokemons ? "active" : ""}`}
              onClick={() => {
                setOwnPokemons((prev) => !prev);
                setCurrentPage(1);
              }}
              disabled={!currentUser}
            >
              Own
            </button>
            <button
              className={`own-button ${likePokemons ? "active" : ""}`}
              onClick={() => {
                setLikePokemons((prev) => !prev);
                setCurrentPage(1);
              }}
            >
              ❤️
            </button>
          </div>
        </div>
      </header>

      {
        <PokemonActionButtons
          currentUser={currentUser}
          tradeUpdated={tradeUpdated}
        />
      }

      {filteredPokemons.length === 0 ? (
        <div className="no-results">
          <h2>No Pokémon Found</h2>
          <p>
            Try searching by:
            <ul>
              <li>Pokémon name</li>
              <li>Race</li>
              <li>Nature</li>
              <li>Ability</li>
              <li>User</li>
              <li>Level</li>
            </ul>
            Check if there are any typos or try different search terms.
          </p>
        </div>
      ) : (
        <div className="pokemon-grid">{pokemonElements}</div>
      )}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalPokemons={filteredPokemons.length}
      />
    </div>
  );
}
