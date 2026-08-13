import express from "express";

import {
  getParkingSessions,
  getParkingSession,
  getActiveParkingSession,
  createParkingSession,
  updateParkingSession,
  deleteParkingSession,
  clearParkingSessions,
} from "../controllers/parkingSessionController.js";

const router = express.Router();


// ==========================================
// GET ALL
// ==========================================

router.get(
  "/",
  getParkingSessions
);


router.delete(
  "/clear",
  clearParkingSessions
);


// ==========================================
// GET ACTIVE SESSION BY STUDENT
// IMPORTANT: isko /:id se pehle rakho
// ==========================================

router.get(
  "/active/:studentId",
  getActiveParkingSession
);


// ==========================================
// GET SINGLE
// ==========================================

router.get(
  "/:id",
  getParkingSession
);


// ==========================================
// CREATE
// ==========================================

router.post(
  "/",
  createParkingSession
);


// ==========================================
// UPDATE
// ==========================================

router.patch(
  "/:id",
  updateParkingSession
);


// ==========================================
// DELETE
// ==========================================

router.delete(
  "/:id",
  deleteParkingSession
);

export default router;