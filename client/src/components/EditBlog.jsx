import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import useNotify from "../utils/hooks/useNotify";
import Loading from "../components/Loading";
import NotFound from "../pages/NotFound";
import useFetchBlogById from "../utils/hooks/controllers/useFetchBlogById";
import useEditBlog from "../utils/hooks/controllers/useEditBlog";

const EditBlog = () => {
  const editorRef = useRef();
  const { id } = useParams();
  const notify = useNotify();



  // Fetch blog data using react-query
  const { data: blog, isLoading: isBlogLoading, isFetching: isBlogFetching } = useFetchBlogById();

  // Mutation for updating the blog
  const { mutate: editMutate, isLoading, isFetching } = useEditBlog();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const editorContent = editorRef.current.getInstance().getMarkdown();
    if (!editorContent.trim()) {
      notify("error", "Blog content cannot be empty!");
      return;
    }
    const blog = {
      title: formData.get("edited-title"),
      content: editorContent,
      tag: formData.get("edited-tag"),
    };
    editMutate({ blogId: id, editedBlog: blog });
  };

  if (isBlogLoading || isBlogFetching) return <Loading />;
  if (!blog){
    notify("error", "Blog ID is not valid");
    return <NotFound />;
  }

  return (
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
              initialValue={blog?.content || "hello, world"}
              ref={editorRef}
            />
          </div>
          <div>
            <label>
              <input
                className="taglist"
                list="edited-tag"
                name="edited-tag"
                placeholder="Tag"
                defaultValue={blog.tag || ""}
                required
              />
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
              {isLoading || isFetching ? "Loading" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
