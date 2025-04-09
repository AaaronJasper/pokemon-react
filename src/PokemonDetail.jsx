import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useCurrentUser from "./hooks/useCurrentUser";
import useAvailableSkills from "./hooks/useAvailableSkills";
import usePokemonDetail from "./hooks/usePokemonDetail";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState(null);
  const currentUser = useCurrentUser();
  const { 
    pokemon, 
    loading, 
    error, 
    pokemonImage,
    updatePokemon,
    updatePokemonSkills,
    deletePokemon
  } = usePokemonDetail(id);
  const { availableSkills, loading: skillsLoading, error: skillsError } = useAvailableSkills(id);

  // Set editedPokemon when pokemon data is loaded
  useEffect(() => {
    if (pokemon) {
      setEditedPokemon(pokemon);
    }
  }, [pokemon]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPokemon(pokemon);
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
        skill4: editedPokemon.skill4 || null
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

  const handleInputChange = (field, value) => {
    setEditedPokemon(prev => ({
      ...prev,
      [field]: value === "" ? null : value
    }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Pokémon?")) {
      try {
        await deletePokemon();
        navigate("/");
      } catch (error) {
        console.error("Error deleting Pokémon:", error);
        // Error is already set in the hook
      }
    }
  };

  if (loading) {
    return (
      <div className="pokemon-detail">
        <div className="loading">Loading...</div>
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

  if (!pokemon) {
    return (
      <div className="pokemon-detail">
        <div className="pokemon-detail-card">
          <div className="error-message">Pokémon not found</div>
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

  const isOwner = currentUser && currentUser.id === pokemon.user_id;

  return (
    <div className="pokemon-detail">
      <div className="pokemon-detail-card">
        <h2>{pokemon.name}</h2>
        {pokemonImage && (
          <img 
            src={pokemonImage} 
            alt={pokemon.name} 
          />
        )}
        <div className="pokemon-info">
          <div className="info-section">
            <div className="info-group">
              <label>Race:</label>
              <span>{pokemon.race}</span>
            </div>
            <div className="info-group">
              <label>Level:</label>
              {isEditing ? (
                <input
                  type="number"
                  value={editedPokemon?.level || ""}
                  onChange={(e) => handleInputChange("level", parseInt(e.target.value))}
                  className="edit-input"
                />
              ) : (
                <span>{pokemon.level}</span>
              )}
            </div>
            <div className="info-group">
              <label>Nature:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPokemon?.nature || ""}
                  onChange={(e) => handleInputChange("nature", e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{pokemon.nature}</span>
              )}
            </div>
            <div className="info-group">
              <label>Ability:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editedPokemon.ability}
                  onChange={(e) => handleInputChange("ability", e.target.value)}
                  className="edit-input"
                />
              ) : (
                <span>{pokemon.ability}</span>
              )}
            </div>
            <div className="info-group">
              <label>Owner:</label>
              <span>{pokemon.user}</span>
            </div>
          </div>
          <div className="info-section">
            <div className="info-group">
              <label>Skill 1:</label>
              {isEditing ? (
                <select
                  value={editedPokemon.skill1 || ""}
                  onChange={(e) => handleInputChange("skill1", e.target.value)}
                  className="edit-input"
                >
                  {(!editedPokemon.skill1 || editedPokemon.skill1 === "Not Learned") && (
                    <option value="">Not Learned</option>
                  )}
                  {availableSkills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{pokemon.skill1 ? pokemon.skill1 : "Not Learned"}</span>
              )}
            </div>
            <div className="info-group">
              <label>Skill 2:</label>
              {isEditing ? (
                <select
                  value={editedPokemon.skill2 || ""}
                  onChange={(e) => handleInputChange("skill2", e.target.value)}
                  className="edit-input"
                >
                  {(!editedPokemon.skill2 || editedPokemon.skill2 === "Not Learned") && (
                    <option value="">Not Learned</option>
                  )}
                  {availableSkills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{pokemon.skill2 ? pokemon.skill2 : "Not Learned"}</span>
              )}
            </div>
            <div className="info-group">
              <label>Skill 3:</label>
              {isEditing ? (
                <select
                  value={editedPokemon.skill3 || ""}
                  onChange={(e) => handleInputChange("skill3", e.target.value)}
                  className="edit-input"
                >
                  {(!editedPokemon.skill3 || editedPokemon.skill3 === "Not Learned") && (
                    <option value="">Not Learned</option>
                  )}
                  {availableSkills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{pokemon.skill3 ? pokemon.skill3 : "Not Learned"}</span>
              )}
            </div>
            <div className="info-group">
              <label>Skill 4:</label>
              {isEditing ? (
                <select
                  value={editedPokemon.skill4 || ""}
                  onChange={(e) => handleInputChange("skill4", e.target.value)}
                  className="edit-input"
                >
                  {(!editedPokemon.skill4 || editedPokemon.skill4 === "Not Learned") && (
                    <option value="">Not Learned</option>
                  )}
                  {availableSkills.map((skill, index) => (
                    <option key={index} value={skill}>
                      {skill}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{pokemon.skill4 ? pokemon.skill4 : "Not Learned"}</span>
              )}
            </div>
          </div>
        </div>
        {isOwner && (
          <div className="action-buttons">
            {isEditing ? (
              <>
                <div className="button-row">
                  <button className="save-button" onClick={handleSave}>Update Basic Info</button>
                  <button className="save-button" onClick={handleSkillUpdate}>Update Skills</button>
                  <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                </div>
                <button className="back-button" onClick={() => navigate('/')}>
                  Back
                </button>
              </>
            ) : (
              <>
                <div className="button-row">
                  <button className="edit-button" onClick={handleEdit}>Edit Pokémon</button>
                  <button className="delete-button" onClick={handleDelete} >Delete Pokémon</button>
                </div>
                <button className="back-button" onClick={() => navigate('/')}>
                  Back
                </button>
              </>
            )}
          </div>
        )}
        {!isOwner && (
          <div className="action-buttons">
            <button className="back-button" onClick={() => navigate('/')}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
