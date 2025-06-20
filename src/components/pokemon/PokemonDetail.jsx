import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import usePokemonDetail from "../../hooks/usePokemonDetail";
import PokemonDescription from "./PokemonDescription.jsx";
import PokemonDetailInfo from "./PokemonDetailInfo.jsx";
import PokemonDetailButton from "./PokemonDetailButton.jsx";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState(null);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const {
    pokemon,
    loading,
    error,
    pokemonImage,
    updatePokemon,
    updatePokemonSkills,
    deletePokemon,
    clearError,
  } = usePokemonDetail(id);

  // Set editedPokemon when pokemon data is loaded
  useEffect(() => {
    if (pokemon) {
      setEditedPokemon(pokemon);
    }
  }, [pokemon]);

  const isOwner = currentUser && currentUser.id === pokemon.user_id;

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPokemon(pokemon);
  };

  const handleInputChange = (field, value) => {
    setEditedPokemon((prev) => ({
      ...prev,
      [field]: value === "" ? null : value,
    }));
  };

  const handleSave = async () => {
    try {
      // Create a copy of editedPokemon without skills
      const { skill1, skill2, skill3, skill4, ...pokemonData } = editedPokemon;

      // Update Pokémon basic info
      await updatePokemon(pokemonData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating Pokémon:", error);
      // Error is already set in the hook
    }
  };

  const handleSkillUpdate = async () => {
    try {
      // Create skills object
      const skills = {
        skill1: editedPokemon.skill1 || null,
        skill2: editedPokemon.skill2 || null,
        skill3: editedPokemon.skill3 || null,
        skill4: editedPokemon.skill4 || null,
      };

      // Update Pokémon skills
      await updatePokemonSkills(skills);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating skills:", error);
      // Error is already set in the hook
      // Revert to original skills
      setEditedPokemon(pokemon);
    }
  };

  const handleCancel = () => {
    setEditedPokemon(pokemon);
    setIsEditing(false);
  };

  const handleBack = () => {
    clearError();
    navigate(`/pokemon/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Pokémon?")) {
      try {
        await deletePokemon();
        navigate("/");
      } catch (error) {
        console.error("Error deleting Pokémon:", error);
      }
    }
  };

  const toggleDescription = () => {
    setShowDescription((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="verify-email-container">
        <div className="verify-email-card">
          <div className="loading-message">
            <h2>Loading...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pokemon && error) {
    return (
      <div className="pokemon-detail">
        <div className="pokemon-detail-card">
          <div className="error-message">Error: {error}</div>
          <div className="action-buttons">
            <div className="button-row">
              <button className="back-button" onClick={() => navigate("/")}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pokemon-detail">
        <div className="pokemon-detail-card">
          <div className="error-message">Error: {error}</div>
          <div className="action-buttons">
            <div className="button-row">
              <button className="back-button" onClick={handleBack}>
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-detail">
      <div className="pokemon-detail-card">
        {pokemon.is_liked && <div className="pokemon-liked-icon">❤️</div>}
        {!isEditing && (
          <div className="pokemon-description-icon">
            <button
              onClick={toggleDescription}
              className={`description-toggle-button ${
                showDescription ? "transparent" : "colored"
              }`}
            >
              {showDescription ? "👁️‍🗨️ Hide Info" : "👁️ Show Info"}
            </button>
          </div>
        )}
        {isEditing ? (
          <input
            type="text"
            value={editedPokemon?.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="h2-like-input"
          />
        ) : (
          <h2>{pokemon.name}</h2>
        )}
        {pokemonImage && <img src={pokemonImage} alt={pokemon.name} />}
        {showDescription && !isEditing ? (
          <PokemonDescription key={pokemon.id} pokemon={pokemon} />
        ) : (
          <PokemonDetailInfo
            pokemon={pokemon}
            editedPokemon={editedPokemon}
            isEditing={isEditing}
            id={id}
            handleInputChange={handleInputChange}
          />
        )}
        <PokemonDetailButton
          isEditing={isEditing}
          isOwner={isOwner}
          handleSave={handleSave}
          handleSkillUpdate={handleSkillUpdate}
          handleCancel={handleCancel}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          showDescription={showDescription}
        />
      </div>
    </div>
  );
}
