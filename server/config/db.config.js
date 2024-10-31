import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === "production"
        ? process.env.DB_URI
        : "mongodb://localhost:27017/blogit_db"
    );
    console.log("MongoDB has been connected successfully.");
  } catch (err) {
    console.log("Connection error: ", err);
  }
};
