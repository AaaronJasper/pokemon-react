import useAvailableSkills from "../../hooks/useAvailableSkills";

export default function PokemonDetailInfo({
  pokemon,
  editedPokemon,
  isEditing,
  id,
  handleInputChange,
}) {
  const {
    availableSkills,
    loading: skillsLoading,
    error: skillsError,
  } = useAvailableSkills(id);

  return (
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
              onChange={(e) =>
                handleInputChange("level", parseInt(e.target.value))
              }
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
              {(!editedPokemon.skill1 ||
                editedPokemon.skill1 === "Not Learned") && (
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
              {(!editedPokemon.skill2 ||
                editedPokemon.skill2 === "Not Learned") && (
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
              {(!editedPokemon.skill3 ||
                editedPokemon.skill3 === "Not Learned") && (
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
              {(!editedPokemon.skill4 ||
                editedPokemon.skill4 === "Not Learned") && (
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
  );
}
