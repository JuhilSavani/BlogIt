import React from "react";
import { Link } from "react-router-dom";
import useDate from "../utils/hooks/useDate";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import PropTypes from "prop-types";

const BlogList = ({ blogs }) => {
  const date = useDate();

  return (
    <>
      {blogs.map((b) => (
        <div className="blog" key={b._id}>
          <Link to={`/blog/${b._id}`}>
            <h1 className="title">{b.title}</h1>
            <div className="content">
              <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                {b?.content.replace(/\n/gi, "&nbsp; \n")}
              </ReactMarkdown>
            </div>
            <div className="meta-data">
              <span className="author">By: {b.author}</span>
              <span className="date">On: {date(b.createdAt)}</span>
              <span className="tag">Tag: {b.tag}</span>
            </div>
          </Link>
        </div>
      ))}
    </>
  );
};

BlogList.propTypes = {
  blogs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      tag: PropTypes.string,
    })
  ).isRequired,
};

export default BlogList;
