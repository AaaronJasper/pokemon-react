import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import Pokemon from "./Pokemon";
import logo from "./assets/International_Pokémon_logo.svg.png";
import useAllPokemons from "./hooks/useAllPokemons";
import { UserContext } from "./UserContext";
import Pagination from "./Pagination";
import SendVerifyEmail from "./SendVerifyEmail";

export default function App() {
  const { pokemons, pokemonImages } = useAllPokemons();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  console.log(currentUser);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRegister = () => {
    navigate("/register");
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
        // Clear all user data from local storage
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId"); // Remove user ID specifically if it exists
        // Update state
        setCurrentUser(null);
        // Redirect to home page
        navigate("/");
      })
      .catch((error) => {
        // Even if the API call fails, we still want to clear the local local
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("userId"); // Remove user ID specifically if it exists
        setCurrentUser(null);
        navigate("/");
      });
  };

  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.race.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.nature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.ability.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.level.toString().includes(searchQuery)
  );

  const pokemonElements = filteredPokemons
    .slice(startIndex, endIndex)
    .map((pokemon) => {
      return (
        <Pokemon
          key={pokemon.id}
          pokemon={pokemon}
          image={pokemonImages[pokemon.race]}
        />
      );
    });

  return (
    <div className="container">
      <header className="header">
        <div className="auth-buttons">
          {currentUser ? (
            <>
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
            </>
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
          />
        </div>
      </header>

      {currentUser && (
        <div className="create-pokemon-button-container">
          <Link to="/create_pokemon">
            <button className="create-pokemon-button">
              Create New Pokémon
            </button>
          </Link>
        </div>
      )}

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
