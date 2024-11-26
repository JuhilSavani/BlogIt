import express from "express";
import passport from "passport";
import { retreiveMany, retreiveOne, publish, edit, deleteOne } from "../controllers/blog.controllers.js";

const router = express.Router();

// Retrieve Blogs
router.get(
  "/retrieve/blogs/:username",
  retreiveMany
);

// Retrieve Blog
router.get(
  "/retrieve/blog/:id",
  retreiveOne
);

// Publish Blog
router.post(
  "/publish/blog",
  passport.authenticate("jwt", { session: false }),
  publish
);

// Edit Blog
router.put(
  "/edit/blog/:id",
  passport.authenticate("jwt", { session: false }),
  edit
);

// Delete Blog
router.delete(
  "/delete/blog/:id",
  passport.authenticate("jwt", { session: false }),
  deleteOne
);

export default router;
