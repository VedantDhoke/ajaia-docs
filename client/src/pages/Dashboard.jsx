import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DocumentCard from "../components/DocumentCard";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Upload states
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const loadDocuments = async () => {
    try {
      const response = await api.get("/documents");

      setDocuments(
        response.data.map((doc) => ({
          id: doc._id,
          title: doc.title,
          owner: doc.owner?.name,

          isOwner: doc.owner?._id?.toString() === user?.id?.toString(),

          updatedAt: new Date(doc.updatedAt).toLocaleDateString(),
        })),
      );
    } catch (error) {
      console.error("Failed to load documents", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadDocuments();
    }
  }, [user]);

  const createDocument = async () => {
    try {
      const response = await api.post("/documents", {
        title: "Untitled Document",
        content: "<p></p>",
      });

      navigate(`/documents/${response.data._id}`);
    } catch (error) {
      console.error("Failed to create document", error);
    }
  };

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];

    setUploadError("");

    if (!file) {
      return;
    }

    const allowedTypes = [".txt", ".md"];

    const extension = "." + file.name.split(".").pop().toLowerCase();

    if (!allowedTypes.includes(extension)) {
      setUploadError("Only .txt and .md files are supported.");

      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5 MB.");

      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Upload file
  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Please select a file.");
      return;
    }

    try {
      setUploading(true);
      setUploadError("");

      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await api.post("/documents/upload", formData);

      // Close modal
      setShowUpload(false);

      setSelectedFile(null);

      // Refresh documents
      await loadDocuments();

      // Open uploaded document
      navigate(`/documents/${response.data._id}`);
    } catch (error) {
      console.error("File upload failed", error);

      setUploadError(
        error.response?.data?.message ||
          "File upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app-layout">
      <Navbar />

      <div className="dashboard-layout">
        <Sidebar documents={documents} onCreateDocument={createDocument} />

        <main className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>My Documents</h1>

              <p>Create and manage your documents.</p>
            </div>

            <div className="dashboard-actions">
              <button
                className="upload-btn"
                onClick={() => setShowUpload(true)}
              >
                ↑ Upload File
              </button>

              <button className="new-document-btn" onClick={createDocument}>
                + New Document
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading documents...</div>
          ) : documents.length === 0 ? (
            <div className="empty-state">
              <h2>No documents yet</h2>

              <p>Create or upload your first document to get started.</p>

              <div className="empty-actions">
                <button className="new-document-btn" onClick={createDocument}>
                  + Create Document
                </button>

                <button
                  className="upload-btn"
                  onClick={() => setShowUpload(true)}
                >
                  ↑ Upload File
                </button>
              </div>
            </div>
          ) : (
            <div className="documents-grid">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDelete={(deletedId) => {
                    setDocuments((currentDocuments) =>
                      currentDocuments.filter((doc) => doc.id !== deletedId),
                    );
                  }}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Upload Modal */}

      {showUpload && (
        <div
          className="modal-overlay"
          onClick={() => !uploading && setShowUpload(false)}
        >
          <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Upload Document</h2>

                <p>Import a .txt or .md file as an editable document.</p>
              </div>

              <button
                className="modal-close"
                onClick={() => !uploading && setShowUpload(false)}
              >
                ×
              </button>
            </div>

            <label className="file-upload-area">
              <input
                type="file"
                accept=".txt,.md,text/plain,text/markdown"
                onChange={handleFileChange}
                hidden
              />

              <div className="upload-icon">↑</div>

              {selectedFile ? (
                <>
                  <strong>{selectedFile.name}</strong>

                  <span>{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </>
              ) : (
                <>
                  <strong>Choose a file</strong>

                  <span>.txt or .md • Maximum 5 MB</span>
                </>
              )}
            </label>

            {uploadError && <div className="error-message">{uploadError}</div>}

            <div className="modal-actions">
              <button
                className="cancel-btn"
                onClick={() => !uploading && setShowUpload(false)}
                disabled={uploading}
              >
                Cancel
              </button>

              <button
                className="upload-submit-btn"
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
