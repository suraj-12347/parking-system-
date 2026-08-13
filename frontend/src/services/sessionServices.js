import { validateEntry } from "./parkingValidation";

import {
  getParkingSessions,
  createParkingSession,
} from "../api/parkingSessionApi";

export const createEntrySession = async (studentId) => {
  try {
    console.log(
      "CREATE ENTRY CALL:",
      studentId
    );

    // ==========================================
    // 1. VALIDATE STUDENT
    // ==========================================

    const validation =
      await validateEntry(studentId);

    console.log(
      "VALIDATION RESULT:",
      validation
    );

    // ==========================================
    // 2. VALIDATION FAILED
    // ==========================================

    if (
      validation.status !== "success"
    ) {
      return validation;
    }

    // ==========================================
    // 3. STUDENT DATA
    // ==========================================

    const student =
      validation.student;

    if (!student) {
      return {
        status: "danger",
        message: "Student Not Found",
      };
    }

    console.log(
      "STUDENT DATA:",
      student
    );

    // ==========================================
    // 4. GET EXISTING SESSIONS
    // ==========================================

    const response =
      await getParkingSessions();

    const sessions =
      response?.sessions || [];

    console.log(
      "DATABASE SESSIONS:",
      sessions
    );

    // ==========================================
    // 5. CHECK ALREADY INSIDE
    // ==========================================

    const activeSession =
      sessions.find((item) => {
        const sessionStudentId =
          item.student_id ||
          item.studentId;

        return (
          String(sessionStudentId).trim() ===
            String(
              student.enrollment
            ).trim() &&
          item.status === "inside"
        );
      });

    if (activeSession) {
      return {
        status: "danger",

        message:
          "Student Already Inside",

        student,

        session:
          activeSession,
      };
    }

    // ==========================================
    // 6. CURRENT DATE / TIME
    // ==========================================

    const now =
      new Date();

    // ==========================================
    // 7. CREATE SESSION DATA
    // ==========================================

   // ==========================================
// 7. CREATE SESSION DATA
// ==========================================

const newSession = {
  id: `SES${Date.now()}`,

  studentId: student.enrollment,

  studentName: student.name,

  vehicleNumber:
    student.vehicle || null,

  vehicle_type:
    student.vehicle_type || null,

  department:
    student.department,

  // Actual entry timestamp
  entryTime:
    now.toISOString(),

  // Record creation timestamp
  createdAt:
    now.toISOString(),

  // Exit abhi nahi hua
  exitTime: null,

  // Student currently inside
  status: "inside",

  parkingSlot: "A-10",

  verifiedBy: "Watchman",

  paymentStatus: "active",

  completedDate: null,
};

    console.log(
      "NEW SESSION:",
      newSession
    );

    // ==========================================
    // 8. SAVE SESSION TO DATABASE
    // ==========================================

    const createResponse =
      await createParkingSession(
        newSession
      );

    console.log(
      "CREATE SESSION RESPONSE:",
      createResponse
    );

    // ==========================================
    // 9. CHECK API RESPONSE
    // ==========================================

    if (
      createResponse?.success === false
    ) {
      return {
        status: "danger",

        message:
          createResponse?.message ||
          "Failed to create parking session",
      };
    }

    // ==========================================
    // 10. SAVED SESSION
    // ==========================================

    const savedSession =
      createResponse?.session ||
      createResponse?.parkingSession ||
      newSession;

    // ==========================================
    // 11. SUCCESS
    // ==========================================

    return {
      status: "success",

      message:
        "Entry Allowed",

      student,

      session:
        savedSession,
    };

  } catch (error) {

    console.error(
      "CREATE ENTRY SESSION ERROR:",
      error
    );

    return {
      status: "danger",

      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create parking session",
    };
  }
};