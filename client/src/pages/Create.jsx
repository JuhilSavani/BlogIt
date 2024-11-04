import React, { useRef } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useAuth from "../utils/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useNotify from "../utils/hooks/useNotify";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Create = () => {
  const editorRef = useRef();
  const { auth } = useAuth();

  const axiosProtected = useAxiosProtected();
  const navigate = useNavigate();
  const notify = useNotify();

  const queryClient = useQueryClient();

  const publishBlog = async (blogPost) => {
    return await axiosProtected.post("/protected/publish/blog", blogPost, {
      withCredentials: true,
    });
  };

  const { mutate: publishMutate, isLoading } = useMutation({
    mutationFn: publishBlog,
    onSuccess: () => {
      navigate(`/dashboard/${auth?.username}`);
      notify("success", "Blog published successfully! 🎉");
      queryClient.invalidateQueries(["blogs"]);
    },
    onError: (err) => {
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const editorContent = editorRef.current.getInstance().getMarkdown();
    const blogPost = Object.fromEntries(formData.entries());
    if (!editorContent.trim()) {
      notify("error", "Blog content cannot be empty!");
      return;
    }
    blogPost.content = editorContent;
    publishMutate(blogPost);
  };

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
