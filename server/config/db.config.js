import mongoose from "mongoose";

export const connectMongo = async () =>{
  try{
    await mongoose.connect(process.env.DB_URI)
    console.log("MongoDB has been connected successfully.");
  }catch(err){
    console.log('Connection error: ', err);
  }
}
