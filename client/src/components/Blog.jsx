import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import useAuth from "../utils/hooks/useAuth";
import useDate from "../utils/hooks/useDate";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useNotify from "../utils/hooks/useNotify";
import Loading from "../components/Loading";
import NotFound from "../pages/NotFound";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Blog = () => {
  const notify = useNotify();
  const date = useDate();
  const { auth } = useAuth();
  const axiosProtected = useAxiosProtected();

  const navigate = useNavigate();
  const { id } = useParams();

  const queryClient = useQueryClient();

  const fetchBlogById = async (blogId) => {
    console.log("[Blog] Fetching Blog by ID...");
    const { data } = await axiosProtected.get(
      `/protected/retrieve/blog/${blogId}`,
      { withCredentials: true }
    );
    return data;
  };

  const deleteBlogbyId = async (blogId) => {
    return await axiosProtected.delete(`/protected/delete/blog/${blogId}`, {
      withCredentials: true,
    });
  };

  // Fetching blog data
  const { data: blog, isLoading } = useQuery({
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

  // Mutation for deleting a blog
  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteBlogbyId,
    onSuccess: () => {
      notify("success", "Blog removed successfully!");
      queryClient.invalidateQueries(["blogs"]);
      navigate(`/dashboard/${blog?.author}`, { replace: true });
    },
    onError: (err) =>{
      notify("error", err?.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    }
  });

  const handleDelete = () => deleteMutate(id);
  const handleEdit = () => navigate(`/edit/${id}`);
  
  if (isLoading) return <Loading />;
  if (!blog){ 
    notify("error", "Blog ID is not valid");
    return <NotFound />;
  }

  return (
    <div className="page blog-page">
      <div className="container">
        <h1 className="title">{blog?.title}</h1>
        <div className="content">
          <ReactMarkdown>{blog?.content}</ReactMarkdown>
        </div>
        <div className="meta-data">
          <span className="date">By: {blog?.author}</span>
          <span className="date">On: {date(blog?.createdAt)}</span>
          <span className="tag">Tag: {blog?.tag}</span>
        </div>
        {auth?.username === blog?.author && (
          <div className="options">
            <button className="edit-btn" onClick={handleEdit}>
              <i className="bx bxs-edit-alt"></i>
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              <i className="bx bxs-trash"></i>
            </button>
            <button className="dashboard-btn" onClick={() => navigate(`/dashboard/${blog?.author}`)}>
              <i className='bx bxs-dashboard'></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
