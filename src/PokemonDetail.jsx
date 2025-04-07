import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pokemonImage, setPokemonImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPokemon, setEditedPokemon] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [availableSkills, setAvailableSkills] = useState([]);

  useEffect(() => {
    // Get current user from session storage
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Fetch Pokémon details
    fetch(`http://127.0.0.1:8000/api/pokemon/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pokemon not found");
        }
        return response.json();
      })
      .then((res) => {
        const pokemonData = res.data;
        setPokemon(pokemonData);
        setEditedPokemon(pokemonData);
        // Fetch Pokémon image from PokeAPI
        return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonData.race}`);
      })
      .then((response) => response.json())
      .then((pokeData) => {
        setPokemonImage(pokeData.sprites.other["official-artwork"].front_default);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error.message);
        setLoading(false);
      });

    // Fetch available skills
    const token = sessionStorage.getItem("token");
    fetch(`http://127.0.0.1:8000/api/pokemon/${id}/enableSkill`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to fetch available skills");
        }
        return response.json();
      })
      .then(data => {
        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("Invalid skills data format:", data);
          setAvailableSkills([]);
          return;
        }
        
        setAvailableSkills(data);
      })
      .catch(error => {
        console.error("Error fetching available skills:", error);
        setAvailableSkills([]); // Set empty array on error
      });
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPokemon(pokemon);
  };

  const handleSave = () => {
    const token = sessionStorage.getItem("token");
    
    // Create a copy of editedPokemon without skills
    const { skill1, skill2, skill3, skill4, ...pokemonData } = editedPokemon;

    fetch(`http://127.0.0.1:8000/api/pokemon/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(pokemonData)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to update Pokémon");
        }
        return response.json();
      })
      .then(data => {
        setPokemon(data.data);
        setIsEditing(false);
        setError(null);
      })
      .catch(error => {
        console.error("Error updating Pokémon:", error);
        setError("Failed to update Pokémon");
        setIsEditing(true);  // Keep editing mode active
      });
  };

  const handleSkillUpdate = () => {
    const token = sessionStorage.getItem("token");
    
    // Create skills object
    const skills = {
      skill1: editedPokemon.skill1 || null,
      skill2: editedPokemon.skill2 || null,
      skill3: editedPokemon.skill3 || null,
      skill4: editedPokemon.skill4 || null
    };

    fetch(`http://127.0.0.1:8000/api/pokemon/${id}/skill`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(skills)
    })
      .then(response => response.json())
      .then(data => {
        if (data.code !== 201) {
          // Revert to original skills
          setEditedPokemon(pokemon);
          throw new Error(data.message || "Failed to update skills");
        }
        setPokemon(prev => ({
          ...prev,
          ...data.data
        }));
        setIsEditing(false);
        setError(null);
      })
      .catch(error => {
        console.error("Error updating skills:", error);
        setError(error.message);
        // Revert to original skills and exit edit mode
        setEditedPokemon(pokemon);
        setIsEditing(false);
      });
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
    setError(null);
    setIsEditing(false);
    setEditedPokemon(null);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this Pokémon? This action cannot be undone.")) {
      const token = sessionStorage.getItem("token");
      
      fetch(`http://127.0.0.1:8000/api/pokemon/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to delete Pokémon");
          }
          navigate('/'); // Redirect to home page after successful deletion
        })
        .catch(error => {
          console.error("Error deleting Pokémon:", error);
          setError("Failed to delete Pokémon");
        });
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
