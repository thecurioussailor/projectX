import express from "express";
import { router } from "./routes/index.js";
import cors from "cors";
const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Allow the frontend URL
  credentials: true, // Allow cookies to be sent with requests
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/v1", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
