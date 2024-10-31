/* eslint-disable react/prop-types */
import React from "react";
import { Link } from "react-router-dom";
import useDate from "../utils/hooks/useDate";
import ReactMarkdown from 'react-markdown';

const BlogList = ({ blogs }) => {
  const date = useDate();

  return (
    <>
      {blogs.map((b) => (
        <div className="blog" key={b._id}>
          <Link to={`/blog/${b._id}`}>
            <h1 className="title">{b.title}</h1>
            <div className="content"><ReactMarkdown>{b.content}</ReactMarkdown></div>
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

export default BlogList;
