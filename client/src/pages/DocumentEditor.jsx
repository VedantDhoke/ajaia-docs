import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import RichTextEditor from "../components/RichTextEditor";
import ShareModal from "../components/ShareModal";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function DocumentEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [document, setDocument] = useState(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [showShareModal, setShowShareModal] = useState(false);

  const [saveStatus, setSaveStatus] = useState("Loading...");

  const loadDocument = async () => {
    try {
      const response = await api.get(`/documents/${id}`);

      setDocument(response.data);
      setTitle(response.data.title);
      setContent(response.data.content || "");

      setSaveStatus("Saved");
    } catch (error) {
      console.error("Failed to load document", error);
    }
  };

  useEffect(() => {
    loadDocument();
  }, [id]);

  const saveDocument = async (updatedContent = content) => {
    try {
      setSaveStatus("Saving...");

      await api.patch(`/documents/${id}`, {
        title,
        content: updatedContent,
      });

      setSaveStatus("Saved");
    } catch (error) {
      console.error("Failed to save document", error);

      setSaveStatus("Save failed");
    }
  };

  const handleContentChange = (newContent) => {
    setContent(newContent);

    clearTimeout(window.saveTimer);

    window.saveTimer = setTimeout(() => {
      saveDocument(newContent);
    }, 800);
  };

  const handleRename = async () => {
    if (!title.trim()) {
      return;
    }

    await saveDocument(content);
  };

  const handleShare = async (email) => {
    try {
      await api.post(`/documents/${id}/share`, { email });

      setShowShareModal(false);

      await loadDocument();
    } catch (error) {
      console.error("Failed to share document", error);
    }
  };

  if (!document) {
    return (
      <div>
        <Navbar />

        <div className="loading">Loading document...</div>
      </div>
    );
  }

  const isOwner =
    document.owner?._id === user?.id || document.owner?._id === user?._id;

  return (
    <div className="editor-page">
      <Navbar />

      <div className="editor-header">
        <div className="editor-title-area">
          <button className="back-btn" onClick={() => navigate("/")}>
            ←
          </button>

          <input
            className="document-title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleRename}
            disabled={!isOwner}
          />

          <span className="save-status">{saveStatus}</span>
        </div>

        {isOwner && (
          <button
            className="share-button"
            onClick={() => setShowShareModal(true)}
          >
            Share
          </button>
        )}
      </div>

      <main className="editor-workspace">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          readOnly={!isOwner && !document.canEdit}
        />
      </main>

      {showShareModal && (
        <ShareModal
          onClose={() => setShowShareModal(false)}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default DocumentEditor;
