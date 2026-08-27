import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function DocumentCard({ document, onDelete }) {
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();

    try {
      setDeleting(true);

      await api.delete(`/documents/${document.id}`);

      setShowConfirm(false);

      // Tell Dashboard to remove the card
      if (onDelete) {
        onDelete(document.id);
      }
    } catch (error) {
      console.error("Failed to delete document:", error);

      alert(error.response?.data?.message || "Failed to delete document.");
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteConfirmation = (e) => {
    e.stopPropagation();
    setShowConfirm(true);
  };

  const closeDeleteConfirmation = (e) => {
    e.stopPropagation();

    if (!deleting) {
      setShowConfirm(false);
    }
  };

  return (
    <>
      <div
        className="document-card"
        onClick={() => navigate(`/documents/${document.id}`)}
      >
        <div className="document-icon">📄</div>

        <h3>{document.title}</h3>

        <p>
          {document.isOwner ? "Owned by you" : `Shared by ${document.owner}`}
        </p>

        <small>Updated {document.updatedAt}</small>

        {/* Delete only for owner */}
        {document.isOwner && (
          <button
            className="delete-document-btn"
            onClick={openDeleteConfirmation}
          >
            🗑 Delete
          </button>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="delete-modal-overlay" onClick={closeDeleteConfirmation}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">🗑️</div>

            <h2>Delete document?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{document.title}"</strong>?
            </p>

            <p className="delete-warning">This action cannot be undone.</p>

            <div className="delete-modal-actions">
              <button
                className="cancel-delete-btn"
                onClick={closeDeleteConfirmation}
                disabled={deleting}
              >
                Cancel
              </button>

              <button
                className="confirm-delete-btn"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DocumentCard;
