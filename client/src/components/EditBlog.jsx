import React, { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "./Loading";
import useNotify from "../utils/hooks/useNotify";

const EditBlog = () => {
  const [blog, setBlog] = useState({});
  const [error, setError] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const editorRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();

  const notify = useNotify();
  const axiosProtected = useAxiosProtected();
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const editorContent = editorRef.current.getInstance().getMarkdown();
    const editedData = {
      title: formData.get("edited-title"),
      content: editorContent,
      tag: formData.get("edited-tag")
    };
    try {
      await axiosProtected.put(`/protected/edit/blog/${id}`, editedData, {
        withCredentials: true,
      });
      navigate(`/dashboard/${blog.author}`, { replace: true });
    } catch (err) {
      setBlog(err.response ? err.response.data : err.message);
      navigate(-1, { replace: true });
    }
  };

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await axiosProtected.get(
          `/protected/retrieve/blog/${id}`,
          { withCredentials: true }
        );
        setBlog(response.data);
        if(!response.data.length) setError("Blog ID is not valid");
      } catch (err) {
        setError(err?.response?.data ? err.response.data.message : err.message);
        navigate(-1, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [axiosProtected, id, navigate]);

  useEffect(()=>{
    if(error){
      notify("error", error);
      setError("");
    }
  }, [error, notify]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="page edit-blog">
          <div className="container">
            <h2>&ldquo;{blog.title}&rdquo;</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="edited-title"
                  id="edited-title"
                  placeholder="Title"
                  defaultValue={blog.title || ""} 
                  required
                />
              </div>
              <div className="rich-text-editor">
                <Editor
                  theme="dark"
                  previewStyle="vertical"
                  height="500px"
                  initialEditType="markdown"
                  initialValue={blog.content || "hello, world"}
                  ref={editorRef}
                />
              </div>
              <div>
                <label>
                    <input className="taglist" list="edited-tag"
                    name="edited-tag" placeholder="Tag" 
                    defaultValue={blog.tag || ""} required />
                </label>
                <datalist id="edited-tag">
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
                  {isLoading ? "Loading" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditBlog;
