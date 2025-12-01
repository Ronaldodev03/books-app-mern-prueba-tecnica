import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import { corsConfig } from "./config/cors.js";
import bookRoutes from "./routes/bookRoutes.js";

connectDB();

const app = express();

app.use(cors(corsConfig));

app.use(express.json());

app.use("/api/books", bookRoutes);

export default app;
