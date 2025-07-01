import express from "express";
import { router } from "./routes/index.js";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1", router);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running on port 3000");
});
