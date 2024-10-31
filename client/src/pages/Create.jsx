import React, { useRef, useState, useEffect } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useAuth from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useNotify from "../utils/hooks/useNotify";

const Create = () => {
  const editorRef = useRef();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const axiosProtected = useAxiosProtected();
  const navigate = useNavigate();
  const notify = useNotify();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const editorContent = editorRef.current.getInstance().getMarkdown();
    data.content = editorContent;

    try {
      await axiosProtected.post("/protected/publish/blog", data, {
        withCredentials: true,
      });
      notify("success", "Blog published successfully! 🎉");
      navigate(`/dashboard/${auth.username}`);
    } catch (err) {
      setError(err?.response?.data ? err.response.data.message : err.message);
      navigate(-1, { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(error){
      notify("error", error);
      setError("");
    }
  }, [error, notify]);

  return (
    <div className="page create">
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              name="title"
              id="title"
              placeholder="Title"
              required
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
              <input
                className="taglist"
                list="tag"
                name="tag"
                placeholder="Tag"
                required
              />
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
            <button type="submit" className="post-btn">
              {isLoading ? "Loading" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
