import React from "react";
import Loading from "../components/Loading";
import BlogList from "../components/BlogList";
import useFetchBlogs from "../utils/hooks/controllers/useFetchBlogs";

const Dashboard = () => {
  const { data: blogs, isLoading, isFetching } = useFetchBlogs();

  if (isLoading || isFetching) return <Loading />;
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
