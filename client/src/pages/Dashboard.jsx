import React from "react";
import Loading from "../components/Loading";
import BlogList from "../components/BlogList";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosProtected from "../utils/hooks/useAxiosProtected";
import useNotify from "../utils/hooks/useNotify";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const axiosProtected = useAxiosProtected();

  // Fetch function moved outside of component
  const fetchBlogs = async (blogAuthor) => {
    const { data } = await axiosProtected.get(
      `/protected/retrieve/blogs/${blogAuthor}`,
      { withCredentials: true }
    );
    if(!data) notify("error", "No Blogs are Available");
    return data;
  };

  // React Query for fetching blogs
  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", username], // unique query key based on the username
    queryFn: () => fetchBlogs(username),
    enabled: Boolean(username), // nullish coalescing 
    staleTime: 1000 * 60 * 60,
    onError: (err) => {
      notify("error", err.response?.data?.message || err.message);
      navigate(-1, { replace: true });
    },
  });

  if (isLoading) return <Loading />;
  if (!blogs) {
    return (
      <div className="page">
        <div className="container">
          <h1>No Blogs are Available</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="page dashboard">
      <div className="container">
        <div className="blogs">
          <BlogList blogs={blogs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
