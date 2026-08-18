import express from "express";

import {
  getStudents,
  getStudent,
  createStudent,
  updateSubscription,
  updateActive,
  updateBlacklist,
  deleteStudent,
  resetStudentPassword,
  studentLogin,
  getLoggedInStudent,
} from "../controllers/studentController.js";
import { uploadStudentPhoto } from "../middleware/studentMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminAuth from "../middleware/adminAuth.js";



const router = express.Router();

router.post(
  "/login",
  studentLogin
);
// ========================================
// STUDENTS
// ========================================

router.get(
  "/",
  getStudents
);
router.get(
  "/me",
  authMiddleware,
  getLoggedInStudent
);


router.get(
  "/:enrollment",
  getStudent
);

router.post(
  "/",
  uploadStudentPhoto.single("photo"),
  createStudent,
  adminAuth
);


// ========================================
// ACTIVE STATUS
// ========================================

router.patch(
  "/:enrollment/active",
  updateActive,
  adminAuth
);


// ========================================
// BLACKLIST STATUS
// ========================================

router.patch(
  "/:enrollment/blacklist",
  updateBlacklist,
  adminAuth
);


// ========================================
// SUBSCRIPTION
// ========================================

router.put(
  "/:enrollment/subscription",
  updateSubscription,
  adminAuth
);


// ========================================
// DELETE
// ========================================

router.delete(
  "/:enrollment",
  deleteStudent,
  adminAuth
);


router.patch(
  "/:enrollment/reset-password",
  resetStudentPassword,
  adminAuth
);


// ========================================
// LOGGED-IN STUDENT
// ========================================


export default router;