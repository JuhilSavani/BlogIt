import React, { useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "@toast-ui/editor/dist/toastui-editor.css";
import "@toast-ui/editor/dist/theme/toastui-editor-dark.css";
import { Editor } from "@toast-ui/react-editor";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useNotify from "../utils/hooks/useNotify";
import Loading from "../components/Loading";
import NotFound from "../pages/NotFound";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const EditBlog = () => {
  const editorRef = useRef();
  const { id } = useParams();
  const navigate = useNavigate();

  const notify = useNotify();
  const axiosProtected = useAxiosProtected();

  const queryClient = useQueryClient();

  const fetchBlogById = async (blogId) => {
    console.log("[EditBlog] Fetching Blog by ID...");
    const { data } = await axiosProtected.get(
      `/protected/retrieve/blog/${blogId}`,
      { withCredentials: true }
    );
    return data;
  };

  const editBlogByID = async ({ blogId, editedBlog }) => {
    return await axiosProtected.put(`/protected/edit/blog/${blogId}`, editedBlog, {
      withCredentials: true,
    });
  };

  // Fetch blog data using react-query
  const { data: blog, isLoading: isPageLoading } = useQuery({
    queryFn: () => fetchBlogById(id),
    queryKey: ["blog", id],
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
    onError: (err) => {
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });

  // Mutation for updating the blog
  const { mutate: editMutate, isLoading } = useMutation({
    mutationFn: editBlogByID,
    onSuccess: () => {
      notify("success", "Blog updated successfully! 🎉");
      queryClient.invalidateQueries(["blogs"]);
      navigate(`/blog/${id}`, { replace: true });
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
    const blog = {
      title: formData.get("edited-title"),
      content: editorContent,
      tag: formData.get("edited-tag"),
    };
    editMutate({ blogId: id, editedBlog: blog });
  };

  if (isPageLoading) return <Loading />;
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
              initialValue={blog.content || "hello, world"}
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
              {isLoading ? "Loading" : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlog;
