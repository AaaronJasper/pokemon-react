import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import PokemonDetail from "./PokemonDetail";
import CreatePokemon from "./CreatePokemon";
import { UserContext } from "./UserContext.jsx";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user from session storage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setUser(null);
      }
    }
  }, []); // Empty dependency array means this only runs once on mount

  return (
    <React.StrictMode>
      <BrowserRouter>
        <UserContext.Provider value={[user, setUser]}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pokemon/:id" element={<PokemonDetail />} />
            <Route path="/create_pokemon" element={<CreatePokemon />} />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
