import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import grantRoutes from "./routes/grantRoutes.js";

dotenv.config();


const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/grants", grantRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: mongoose.connection.readyState === 1 ? "connected" : "not connected" });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));