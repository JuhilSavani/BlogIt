import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import useAuth from "../utils/hooks/useAuth";
import useDate from "../utils/hooks/useDate";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import Loading from "../components/Loading";
import NotFound from "../pages/NotFound";
import useNotify from "../utils/hooks/useNotify";

const Blog = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [blog, setBlog] = useState([]);
  const [error, setError] = useState({});
  
  const notify = useNotify();
  const date = useDate();
  const { auth } = useAuth();
  const axiosProtected = useAxiosProtected();

  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

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

  const handleDelete = async () => {
    try{
      await axiosProtected.delete(`/protected/delete/blog/${id}`, {
        withCredentials: true
      });
      navigate(-1, { replace: true });
    }catch(err){
      setError(err?.response?.data ? err.response.data.message : err.message);
    }
  };

  const handleEdit = () => {
    const blogId = location.pathname.split("/")[2];
    navigate(`/edit/${blogId}`);
  };

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : blog.length ? (
        <div className="page blog-page">
          <div className="container">
            <h1 className="title">{blog.title}</h1>
            <div className="content">
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            </div>
            <div className="meta-data">
              <span className="date">By: {blog.author}</span>
              <span className="date">On: {date(blog.createdAt)}</span>
              <span className="tag">Tag: {blog.tag}</span>
            </div>
            {auth.username === blog.author ? (
              <div className="options">
                <button className="edit-btn" onClick={handleEdit}>
                  <i className="bx bxs-edit-alt"></i>
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  <i className='bx bxs-trash'></i>
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      ) : (<NotFound/>)}
    </>
  );
};

export default Blog;
