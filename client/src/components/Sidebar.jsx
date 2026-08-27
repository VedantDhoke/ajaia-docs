import { useNavigate } from "react-router-dom";

function Sidebar({ documents, onCreateDocument }) {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <button className="new-document-btn" onClick={onCreateDocument}>
        + New Document
      </button>

      <div className="sidebar-section">
        <h3>My Documents</h3>

        {documents
          .filter((doc) => doc.isOwner)
          .map((doc) => (
            <button
              key={doc.id}
              className="sidebar-document"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              📄 {doc.title}
            </button>
          ))}
      </div>

      <div className="sidebar-section">
        <h3>Shared With Me</h3>

        {documents
          .filter((doc) => !doc.isOwner)
          .map((doc) => (
            <button
              key={doc.id}
              className="sidebar-document"
              onClick={() => navigate(`/documents/${doc.id}`)}
            >
              👥 {doc.title}
            </button>
          ))}
      </div>
    </aside>
  );
}

export default Sidebar;
