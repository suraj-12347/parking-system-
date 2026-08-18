import express from "express";
import { configDotenv } from "dotenv";
import pool from "./config/db.js";
import studentRoutes from "./routes/studentRoutes.js";
import cors from "cors";
import path from "path";
import parkingLogRoutes from "./routes/ParkingRoutes.js";
import parkingSessionRoutes from "./routes/parkingSessionRoutes.js";
import adminRoutes from "./routes/adminroutes.js";




configDotenv();

const app = express();

const PORT = process.env.PORT || 4000;

// ================================
// DATABASE CONNECTION
// ================================

try {
  await pool.query("SELECT 1");
  console.log("✅ Database Connected Successfully");
} catch (err) {
  console.error("❌ Database Connection Failed");
  console.error(err);
}

// ================================
// CORS
// ================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      'https://parking-system2.onrender.com',
      "https://parkingsystem1234.netlify.app",
    ],
    credentials: true,
  })
);

// ================================
// MIDDLEWARES
// ================================

app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ================================
// STATIC UPLOADS
// ================================

// Student photos
// http://localhost:4000/uploads/students/photo.jpg

// Student QR
// http://localhost:4000/uploads/qr/IPS2024010.png




// ================================
// ROUTES
// ================================

app.use("/api/students", studentRoutes);
app.use(
  "/api/parking-logs",
  parkingLogRoutes
);
app.use(
  "/api/parking-sessions",
  parkingSessionRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);

// ================================
// TEST ROUTE
// ================================

app.get("/", (req, res) => {
  res.send("Parking System API is running");
});

// ================================
// SERVER
// ================================

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});