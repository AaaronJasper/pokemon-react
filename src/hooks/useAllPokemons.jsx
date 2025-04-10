import { useState, useEffect } from "react";

export default function useAllPokemons() {
    const [pokemons, setPokemons] = useState([]);
    const [pokemonImages, setPokemonImages] = useState({});

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

      return { pokemons, pokemonImages };
}