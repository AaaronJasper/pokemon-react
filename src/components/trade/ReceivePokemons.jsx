import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../../../public/International_Pokemon_logo.svg.png";
import useAllPokemons from "../../hooks/useAllPokemons";
import { UserContext } from "../../context/UserContext";
import Pagination from "../common/Pagination";
import useSortedData from "../../hooks/useSortedData";
import SelectPokemon from "./SelectPokemon";

export default function ReceivePokemons() {
  const { pokemons } = useAllPokemons();
  const { sortedPokemons, sortKey, sortOrder, handleSort } = useSortedData(
    pokemons,
    "id",
    "desc"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const location = useLocation();
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = currentPage * itemsPerPage;
  const searchRef = useRef();

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPokemons = (sortedPokemons || []).filter((pokemon) => {
    const matchesSearch =
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.race.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.nature.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.ability.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.level.toString().includes(searchQuery);

    const isNotOwnedByUser = pokemon.user !== currentUser.name;

    return matchesSearch && isNotOwnedByUser;
  });

  const pokemonElements = filteredPokemons
    .slice(startIndex, endIndex)
    .map((pokemon) => {
      return (
        <SelectPokemon
          key={pokemon.id}
          pokemon={pokemon}
          type="receive"
          ownPokemon={location.state?.ownPokemon}
        />
      );
    });

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  return (
    <div className="container">
      <header className="header">
        <img src={logo} alt="Pokemon Logo" className="logo" />
        <h1>Choose Pokémon to Receive</h1>

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
            <Link 
              to="/trade" 
              className="no-underline"
              state={{
                ownPokemon: location.state?.ownPokemon,
                receivedPokemon: null
              }}
            >
              <button className={`own-button`}>Back</button>
            </Link>
          </div>
        </div>
      </header>

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
