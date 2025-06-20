import { useNavigate } from "react-router-dom";

export default function PokemonDetailButton({
  isEditing,
  isOwner,
  handleSave,
  handleSkillUpdate,
  handleCancel,
  handleEdit,
  handleDelete,
  showDescription,
}) {
  const navigate = useNavigate();

  return (
    <>
      {isOwner && (
        <div className="action-buttons">
          {isEditing ? (
            <>
              <div className="button-row">
                <button className="save-button" onClick={handleSave}>
                  Update Basic Info
                </button>
                <button className="save-button" onClick={handleSkillUpdate}>
                  Update Skills
                </button>
                <button className="cancel-button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
              <button
                className="pokemon-back-button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </>
          ) : showDescription ? (
            <>
              <button
                className="pokemon-back-button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </>
          ) : (
            <>
              <div className="button-row">
                <button className="edit-button" onClick={handleEdit}>
                  Edit Pokémon
                </button>
                <button className="delete-button" onClick={handleDelete}>
                  Delete Pokémon
                </button>
              </div>
              <button
                className="pokemon-back-button"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
            </>
          )}
        </div>
      )}
      {!isOwner && (
        <div className="action-buttons">
          <button className="pokemon-back-button" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
      )}
    </>
  );
}
