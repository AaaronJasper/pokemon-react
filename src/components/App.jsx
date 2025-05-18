import React from "react";
import useAuthUser from "../hooks/useAuthUser.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pokemon/Home.jsx";
import Login from "./auth/Login.jsx";
import Register from "./auth/Register.jsx";
import PokemonDetail from "./pokemon/PokemonDetail";
import CreatePokemon from "./pokemon/CreatePokemon";
import { UserContext } from "../context/UserContext.jsx";
import ResetPassword from "./auth/ResetPassword.jsx";
import SendResetPasswordEmail from "./auth/SendResetPasswordEmail.jsx";
import VerifyEmail from "./auth/VerifyEmail.jsx";

export default function App() {
  const [user, setUser] = useAuthUser();

  return (
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
        <Route path="/verify_email/:token" element={<VerifyEmail />}></Route>
      </Routes>
    </UserContext.Provider>
  );
}
