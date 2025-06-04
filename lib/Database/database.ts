import mongoose, { ConnectOptions } from "mongoose";

let isConnected: boolean = false;

export const connectDB = async (): Promise<void> => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "agriconnect",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);

    isConnected = true;
    console.log(" MongoDB connected successfully");
  } catch (error) {
    console.error(" MongoDB connection failed:", error);
    throw new Error("Database connection error");
  }
};
