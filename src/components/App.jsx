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
import OAuthCallback from "./auth/OAuthCallback.jsx";
import CreatePokemonTrait from "./pokemon/CreatePokemonTrait.jsx";
import TradePokemon from "./trade/TradePokemon.jsx";
import OwnPokemons from "./trade/OwnPokemons.jsx";
import ReceivePokemons from "./trade/ReceivePokemons.jsx";
import TradeHistory from "./trade/TradeHistory.jsx";
import PokemonLikeRanking from "./pokemon/PokemonLikeRanking.jsx";

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
        <Route path="/verify_email/:token" element={<VerifyEmail />} />
        <Route path="/OAuthCallback/:code" element={<OAuthCallback />} />
        <Route
          path="/create_pokemon_trait/:trait"
          element={<CreatePokemonTrait />}
        />
        <Route path="/trade" element={<TradePokemon />} />
        <Route path="/choose_own_pokemon" element={<OwnPokemons />} />
        <Route path="/choose_receive_pokemon" element={<ReceivePokemons />} />
        <Route path="/trade_history" element={<TradeHistory />} />
        <Route path="/ranking" element={<PokemonLikeRanking />} />
      </Routes>
    </UserContext.Provider>
  );
}
