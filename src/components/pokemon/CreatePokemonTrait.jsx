import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function CreatePokemonTrait() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [currentUser, setCurrentUser] = useContext(UserContext);
  const [formData, setFormData] = useState({
    nature: "",
    ability: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const { trait } = useParams();

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
    setSuccess(null);

    try {
      if (trait === "nature" && !formData.nature) {
        setError("Nature is required");
        setLoading(false);
        return;
      }

      if (trait === "ability" && !formData.ability) {
        setError("Ability is required");
        setLoading(false);
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/" + trait, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ [trait]: formData[trait] }),
      });

      const data = await response.json();

      if (data.code !== 201) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setFormData({
        nature: "",
        ability: "",
      });

      inputRef.current?.focus();

      setSuccess(data.message);
      setLoading(false);
    } catch (error) {
      setError("Error creating trait");
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);

    return () => clearTimeout(timer);
  }, [trait]);

  if (!currentUser) {
    return (
      <div className="pokemon-detail">
        <div className="pokemon-detail-card">
          <div className="error-message">Please log in to create trait</div>
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
        <h2></h2>
        {success && <div className="success-message"> {success}</div>}
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit} className="pokemon-form">
          <div className="pokemon-info">
            <div className="info-section">
              {trait === "nature" && (
                <div className="info-group">
                  <label htmlFor="nature">Nature:</label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="nature"
                    name="nature"
                    value={formData.nature}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                </div>
              )}

              {trait === "ability" && (
                <div className="info-group">
                  <label htmlFor="ability">Ability:</label>
                  <input
                    ref={inputRef}
                    type="text"
                    id="ability"
                    name="ability"
                    value={formData.ability}
                    onChange={handleInputChange}
                    className="edit-input"
                    required
                  />
                </div>
              )}
            </div>
          </div>
          <div className="action-buttons">
            <div className="button-row">
              <button type="submit" className="save-button" disabled={loading}>
                {loading ? "Adding..." : "Add " + trait}
              </button>
              <Link to="/">
                <button type="button" className="cancel-button">
                  Back home
                </button>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
