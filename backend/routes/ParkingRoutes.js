import express from "express";

import {
  createParkingLog,
  getParkingLogs,
  getParkingLog,
  getStudentParkingLogs,
  updateParkingLog,
  deleteParkingLog,
} from "../controllers/parkingController.js";

const router = express.Router();

// ==========================================
// CREATE LOG
// ==========================================

router.post(
  "/",
  createParkingLog
);

// ==========================================
// GET ALL LOGS
// ==========================================

router.get(
  "/",
  getParkingLogs
);

// ==========================================
// GET SINGLE LOG
// ==========================================

router.get(
  "/:id",
  getParkingLog
);

// ==========================================
// GET STUDENT LOGS
// ==========================================

router.get(
  "/student/:studentId",
  getStudentParkingLogs
);

// ==========================================
// DELETE LOG
// ==========================================

router.delete(
  "/:id",
  deleteParkingLog
);

router.patch(
  "/:id",
  updateParkingLog
);

export default router;