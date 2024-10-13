import React, { useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";

const Create = () => {
  const editorRef = useRef();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, "") // Remove invalid characters
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/--+/g, "-") // Replace multiple dashes with a single dash
      .slice(0, 100); // Limit slug length (optional)
  };

  return (
    <div className="page create">
      <div className="container">
        <form action="">
          <div>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              value={title}
              onChange={handleTitleChange} // Update title and slug on change
              required
            />
            <input
              type="text"
              name="slug"
              id="slug"
              placeholder="Slug"
              value={slug}
              disabled // Slug field is disabled
            />
          </div>
          <div className="rich-text-editor">
            <Editor
              theme="dark"
              previewStyle="vertical"
              height="500px"
              initialEditType="markdown"
              initialValue="hello, world"
              ref={editorRef}
            />
          </div>
          <div>
            <label>
              On:
              <input className="taglist" list="tag" name="tag" placeholder="Tag" required />
            </label>
            <datalist id="tag">
              <option value="Personal">Personal</option>
              <option value="Fashion">Fashion</option>
              <option value="Travel">Travel</option>
              <option value="Food">Food</option>
              <option value="Health">Health</option>
              <option value="Photography">Photography</option>
              <option value="Art">Art</option>
              <option value="Music">Music</option>
              <option value="Sports">Sports</option>
              <option value="Tech">Tech</option>
              <option value="Finance">Finance</option>
              <option value="Political">Political</option>
            </datalist>
            <button type="submit" className="post-btn">Post</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
