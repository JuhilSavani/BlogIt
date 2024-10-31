import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlogList from "../components/BlogList";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useNotify from "../utils/hooks/useNotify";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState({});

  const { username } = useParams();
  const navigate = useNavigate();

  const notify = useNotify();
  const axiosProtected = useAxiosProtected();

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const response = await axiosProtected.get(
          `/protected/retrieve/blogs/${username}`,
          { withCredentials: true }
        );
        setBlogs(response?.data);
        if (!response?.data?.length) setError("No Blogs are Available");
      } catch (err) {
        setError(err?.response?.data ? err.response.data.message : err.message);
        navigate(-1, { replace: true });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [axiosProtected, navigate, username]);

  useEffect(() => {
    if (error) {
      notify("error", error);
      setError("");
    }
  }, [error, notify]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="page dashboard">
          <div className="container">
            <div className="blogs">
              {blogs.length ? (
                <BlogList blogs={blogs} />
              ) : (
                <h1>No Blogs are Available</h1>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
