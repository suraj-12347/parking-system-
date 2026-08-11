import express from "express";

import {
  getStudents,
  getStudent,
  createStudent,
  updateSubscription,
  updateActive,
  updateBlacklist,
  deleteStudent,
} from "../controllers/studentController.js";

const router = express.Router();


// ========================================
// STUDENTS
// ========================================

router.get(
  "/",
  getStudents
);

router.get(
  "/:enrollment",
  getStudent
);

router.post(
  "/",

  createStudent
);


// ========================================
// ACTIVE STATUS
// ========================================

router.patch(
  "/:enrollment/active",
  updateActive
);


// ========================================
// BLACKLIST STATUS
// ========================================

router.patch(
  "/:enrollment/blacklist",
  updateBlacklist
);


// ========================================
// SUBSCRIPTION
// ========================================

router.put(
  "/:enrollment/subscription",
  updateSubscription
);


// ========================================
// DELETE
// ========================================

router.delete(
  "/:enrollment",
  deleteStudent
);


export default router;