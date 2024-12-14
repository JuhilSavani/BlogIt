import React from "react";
import Loading from "../components/Loading";
import BlogList from "../components/BlogList";
import useFetchBlogs from "../utils/hooks/controllers/useFetchBlogs";
import useNotify from "../utils/hooks/useNotify";

const Dashboard = () => {
  const notify = useNotify();
  const { data: blogs, isLoading, isFetching } = useFetchBlogs();

  if (isLoading || isFetching) return <Loading />;
  if (!blogs) {
    notify("error", "No Blogs are Available");
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
