import React from "react";
import useAuthUser from "./hooks/useAuthUser.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import PokemonDetail from "./PokemonDetail";
import CreatePokemon from "./CreatePokemon";
import { UserContext } from "./UserContext.jsx";
import ResetPassword from "./ResetPassword.jsx";
import SendResetPasswordEmail from "./SendResetPasswordEmail.jsx";

export default function App() {
  const [user, setUser] = useAuthUser();

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
            <Route path="/reset_password/:token" element={<ResetPassword />} />
            <Route
              path="/send_reset_password_email"
              element={<SendResetPasswordEmail />}
            />
          </Routes>
        </UserContext.Provider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
