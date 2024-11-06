import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import useAuth from "../utils/hooks/useAuth";
import useDate from "../utils/hooks/useDate";
import useNotify from "../utils/hooks/useNotify";
import Loading from "../components/Loading";
import NotFound from "../pages/NotFound";
import useFetchBlogById from "../utils/hooks/controllers/useFetchBlogById";
import useDeleteBlog from "../utils/hooks/controllers/useDeleteBlog";

const Blog = () => {
  const { id } = useParams();
  const { auth } = useAuth();
  const notify = useNotify();
  const date = useDate();
  const navigate = useNavigate();

  // Fetching blog data
  const { data: blog, isLoading, isFetching } = useFetchBlogById();

  // Mutation for deleting a blog
  const { mutate: deleteMutate } = useDeleteBlog();

  const handleDelete = () => deleteMutate(id);
  const handleEdit = () => navigate(`/edit/${id}`);

  if (isLoading || isFetching) return <Loading />;
  if (!blog) {
    notify("error", "Blog ID is not valid");
    return <NotFound />;
  }

  return (
    <div className="page blog-page">
      <div className="container">
        <h1 className="title">{blog?.title}</h1>
        <div className="content">
          <ReactMarkdown remarkPlugins={[remarkBreaks]}>
            {blog?.content.replace(/\n/gi, "&nbsp; \n")}
          </ReactMarkdown>
        </div>
        <div className="meta-data">
          <span className="date">By: {blog?.author}</span>
          <span className="date">On: {date(blog?.createdAt)}</span>
          <span className="tag">Tag: {blog?.tag}</span>
        </div>
        <div className="options">
          {auth?.username === blog?.author && (
            <>
              <button className="edit-btn" onClick={handleEdit}>
                <i className="bx bxs-edit-alt"></i>
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                <i className="bx bxs-trash"></i>
              </button>
            </>
          )}
          <button
            className="dashboard-btn"
            onClick={() => navigate(`/dashboard/${blog?.author}`)}
          >
            <i className="bx bxs-dashboard"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
