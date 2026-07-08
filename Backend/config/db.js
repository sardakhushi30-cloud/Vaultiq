//This file is for connecting to MongoDB using Mongoose.

import mongoose from "mongoose";
import dns from "node:dns";

const connectDb = async () => {
  try {
    const servers = dns.getServers();
    if (servers.length === 1 && servers[0] === "127.0.0.1") {
      dns.setServers(["1.1.1.1", "8.8.8.8"]);
      console.log("Node DNS fallback: using public DNS servers for MongoDB SRV resolution");
    }

    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "ExpenseTracker",
    });

    console.log("Mongodb connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    throw error;
  }
};

export default connectDb;