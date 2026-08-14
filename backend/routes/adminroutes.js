import express from "express";

import {
  adminLogin,
  getCurrentAdmin,
} from "../controllers/adminController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// ==========================================
// ADMIN LOGIN
// POST /api/admin/login
// ==========================================
router.post(
  "/login",
  adminLogin
);

// ==========================================
// CURRENT ADMIN
// GET /api/admin/me
// ==========================================
router.get(
  "/me",
  adminAuth,
  getCurrentAdmin
);

export default router;