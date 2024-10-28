import mongoose from "mongoose";

export const connectMongo = async () =>{
  try{
    await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log("MongoDB has been connected successfully.");
  }catch(error){
    console.log('Connection error: ', error);
  }
}
