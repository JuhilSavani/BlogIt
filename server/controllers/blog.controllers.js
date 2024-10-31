import { Blog } from "../models/blog.model.js";
import mongoose from "mongoose";

// Retrieve Blogs by Author
export const retreiveMany = async (req, res) => {
  try {
    const { username } = req.params; 
    const blogs = await Blog.find({ author: username });
    if (!blogs.length) return res.sendStatus(204);
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Retrieve Single Blog by ID
export const retreiveOne = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.sendStatus(204);
    }
    const blog = await Blog.findById(id);
    if (!blog) return res.sendStatus(204);
    return res.status(200).json(blog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Publish Blog
export const publish = async (req, res) => {
  const { title, content, tag } = req.body;
  if (!title || !content || !tag)
    return res.status(400).json({
      message: "Please provide full details to publish the blog.",
    });

  try {
    await Blog.create({
      title,
      content,
      tag,
      author: req.user.username,
    });
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Edit Blog
export const edit = async (req, res) => {
  const { title, content, tag } = req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the logged-in user is the author
    if (blog.author !== req.user.username)
      return res.status(403).json({
        message: "You are not authorized to edit this blog",
      });
    // Update blog fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tag = tag || blog.tag;
    blog.updatedAt = Date.now(); // Update the updatedAt timestamp

    await blog.save();
    return res.sendStatus(200);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Delete Blog
export const deleteOne = async (req, res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the logged-in user is the author
    if (blog.author !== req.user.username)
      return res.status(403).json({
        message: "You are not authorized to delete this blog",
      });

    // Delete the blog
    await Blog.deleteOne({ _id: blogId });
    return res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
