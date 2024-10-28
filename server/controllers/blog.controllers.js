import { Blog } from "../models/blog.model";

// Retrieve Blog(s)
export const retreive = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Publish Blog
export const publish = async (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content)
    return res.status(400).json({
      message: "Please provide both title and content to publish the blog.",
    });

  try {
    const savedBlog = await Blog.create({
      title,
      content,
      tags,
      author: req.user.id,
    });
    return res.status(201).json(savedBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Edit Blog
export const edit = async (req, res) => {
  const { title, content, tags } = req.body;
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Check if the logged-in user is the author
    if (blog.author.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this blog" });
    }

    // Update blog fields
    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.updatedAt = Date.now(); // Update the updatedAt timestamp

    const updatedBlog = await blog.save();
    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
