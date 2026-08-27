function EditorToolbar() {
  const format = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="editor-toolbar">
      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => format("bold")}
      >
        <b>B</b>
      </button>

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => format("italic")}
      >
        <i>I</i>
      </button>

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => format("underline")}
      >
        <u>U</u>
      </button>

      <select
        defaultValue=""
        onChange={(e) => {
          if (e.target.value) {
            format("formatBlock", e.target.value);
            e.target.value = "";
          }
        }}
      >
        <option value="">Text</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="p">Paragraph</option>
      </select>

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => format("insertUnorderedList")}
      >
        • List
      </button>

      <button
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => format("insertOrderedList")}
      >
        1. List
      </button>
    </div>
  );
}

export default EditorToolbar;
