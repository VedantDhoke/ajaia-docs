import { useEffect, useRef } from "react";
import EditorToolbar from "./EditorToolbar";

function RichTextEditor({ content, onChange, readOnly = false }) {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content]);

  const handleInput = (event) => {
    onChange(event.currentTarget.innerHTML);
  };

  return (
    <div className="editor-container">
      {!readOnly && <EditorToolbar />}

      <div
        ref={editorRef}
        className="rich-editor"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder="Start writing your document..."
      />
    </div>
  );
}

export default RichTextEditor;
