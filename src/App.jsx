import { useEffect, useState } from "react";
import Pokemon from "./Pokemon";
import logo from "./assets/International_Pokémon_logo.svg.png";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [pokemonImages, setPokemonImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Get initial search query from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("query") || "";
    setSearchQuery(query);
  }, []);

  // Update URL when search changes
  useEffect(() => {
    const newUrl = searchQuery
      ? `${window.location.pathname}?query=${encodeURIComponent(searchQuery)}`
      : window.location.pathname;
    window.history.pushState({}, "", newUrl);
  }, [searchQuery]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/pokemon")
      .then((response) => response.json())
      .then(async (res) => {
        const pokemonData = res.data.data;
        setPokemons(pokemonData);

        // 批量請求所有 Pokémon 的圖片
        const imageRequests = pokemonData.map((pokemon) =>
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.race}`)
            .then((res) => res.json())
            .then((pokeData) => ({
              race: pokemon.race,
              image: pokeData.sprites.other["official-artwork"].front_default,
            }))
        );

        // 等待所有請求完成
        const images = await Promise.all(imageRequests);

        // 轉換成 { name: imageUrl } 格式
        const imageMap = images.reduce((acc, item) => {
          acc[item.race] = item.image;
          return acc;
        }, {});

        setPokemonImages(imageMap);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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

  const pokemonElements = filteredPokemons.map((pokemon) => {
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
        <img src={logo} alt="Pokemon Logo" className="logo" />
        <h1>My Pokémon Collection</h1>
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
    </div>
  );
}
