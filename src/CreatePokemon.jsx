import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext";

export default function CreatePokemon() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [formData, setFormData] = useState({
    name: "",
    level: "",
    race: "",
    nature: "",
    ability: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value.toLowerCase(),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/pokemon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.code !== 201) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate(`/pokemon/${data.data.id}`);
    } catch (error) {
      setError("Error creating Pokémon");
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="pokemon-detail">
        <div className="pokemon-detail-card">
          <div className="error-message">Please log in to create a Pokémon</div>
          <div className="action-buttons">
            <button className="back-button" onClick={() => navigate("/")}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pokemon-detail">
      <div className="pokemon-detail-card">
        <h2>Create New Pokémon</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="pokemon-form">
          <div className="pokemon-info">
            <div className="info-section">
              <div className="info-group">
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="info-group">
                <label htmlFor="level">Level:</label>
                <input
                  type="number"
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="edit-input"
                  min="1"
                  max="100"
                  required
                />
              </div>
              <div className="info-group">
                <label htmlFor="race">Race:</label>
                <input
                  type="text"
                  id="race"
                  name="race"
                  value={formData.race}
                  onChange={handleInputChange}
                  className="edit-input"
                  required
                />
              </div>
            </div>
            <div className="info-section">
              <div className="info-group">
                <label htmlFor="nature">Nature:</label>
                <input
                  type="text"
                  id="nature"
                  name="nature"
                  value={formData.nature}
                  onChange={handleInputChange}
                  className="edit-input"
                  required
                />
              </div>
              <div className="info-group">
                <label htmlFor="ability">Ability:</label>
                <input
                  type="text"
                  id="ability"
                  name="ability"
                  value={formData.ability}
                  onChange={handleInputChange}
                  className="edit-input"
                  required
                />
              </div>
            </div>
          </div>
          <div className="action-buttons">
            <div className="button-row">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Creating..." : "Create Pokémon"}
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => navigate("/")}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
