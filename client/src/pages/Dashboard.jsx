import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import BlogList from "../components/BlogList";
import { useNavigate, useParams } from "react-router-dom";
import useLogout from "../utils/hooks/useLogout";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useAuth from "../utils/hooks/useAuth";
import useNotify from "../utils/hooks/useNotify";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);

  const { username } = useParams();

  const { auth } = useAuth();
  const logout = useLogout();
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
        setBlogs(response.data);
        if(!response?.data?.length) setError("No Blogs are Available");
      } catch (err) {
        setError(err?.response?.data ? err.response.data.message : err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, [axiosProtected, username]);

  useEffect(()=>{
    if(error){
      notify("error", error);
      setError("");
    }
  }, [error, notify]);

  const handleLogout = async () => {
    try {
      await logout();
      notify("success", "Logged out! See you next time!");
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data ? err.response.data.message : err.message);
    }
  };
  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="page dashboard">
          <div className="container">
            {username === auth.username ? (
              <div className="settings">
                <button
                  className={`btn ${showDropdown ? "active" : ""}`}
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <i className="bx bxs-cog"></i>
                </button>
                {showDropdown && (
                  <div className="dropdown">
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
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
