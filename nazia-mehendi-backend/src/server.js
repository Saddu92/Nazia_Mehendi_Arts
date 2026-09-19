import "dotenv/config";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import designRoutes from "./routes/designRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);
const allowedOrigins = new Set([
  ...configuredOrigins,
  "http://localhost:5173",
  "https://nazia-mehendi-arts-y4nq.vercel.app",
  "https://nazia-mehendi-arts-y4nq-johb1zlcc.vercel.app",
]);

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      const isLocalOrigin = /^http:\/\/localhost:\d+$/.test(origin || "");
      const isVercelPreview = /^https:\/\/nazia-mehendi-arts(?:-[\w-]+)?\.vercel\.app$/.test(
        origin || ""
      );

      if (!origin || allowedOrigins.has(origin) || isLocalOrigin || isVercelPreview) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin is not allowed by CORS"));
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/designs", designRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/bookings", bookingRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Nazia Mehendi API is running",
  });
});



// Start server
async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
