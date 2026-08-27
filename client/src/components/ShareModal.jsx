import { useState } from "react";

function ShareModal({ onClose, onShare }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    onShare(email);

    setEmail("");
  };

  return (
    <div className="modal-overlay">
      <div className="share-modal">
        <div className="modal-header">
          <h2>Share document</h2>

          <button onClick={onClose}>✕</button>
        </div>

        <p>
          Enter the email address of the user you want to share this document
          with.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" className="share-btn">
            Share
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShareModal;
