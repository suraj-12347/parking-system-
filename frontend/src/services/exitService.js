import { getStudent } from "../api/studentApi";

import {
  getParkingSessions,
  updateParkingSession,
} from "../api/parkingSessionApi";

import {
  createParkingLog,
} from "../api/parkignLogApi";

export const completeExitSession = async (studentId) => {
  try {
    // ==========================================
    // 1. GET STUDENT
    // ==========================================

    const response = await getStudent(studentId);

    const student =
      response?.student || response;

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
    // 2. GET PARKING SESSIONS
    // ==========================================

    const sessionsResponse =
      await getParkingSessions();

    const sessions =
      sessionsResponse?.sessions || [];

    console.log(
      "DATABASE PARKING SESSIONS:",
      sessions
    );

    // ==========================================
    // 3. FIND ACTIVE SESSION
    // ==========================================

    const activeSession = sessions.find(
      (session) => {
        const sessionStudentId =
          session.student_id ||
          session.studentId;

        return (
          String(sessionStudentId).trim() ===
            String(student.enrollment).trim() &&
          session.status === "inside"
        );
      }
    );

    // ==========================================
    // 4. NO ACTIVE SESSION
    // ==========================================

    if (!activeSession) {
      return {
        status: "danger",
        message: "No Active Parking Session",
        student,
      };
    }

    console.log(
      "ACTIVE SESSION FOUND:",
      activeSession
    );

    // ==========================================
    // 5. DATE / TIME
    // ==========================================

    const now = new Date();

    const exitTime =
      now.toISOString();

    const completedDate =
      now.toISOString();

    const displayExitTime =
      now.toLocaleTimeString(
        "en-IN",
        {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }
      );

    // ==========================================
    // 6. GET ORIGINAL ENTRY TIME
    // ==========================================

    const entryTime =
      activeSession.entry_time ||
      activeSession.entryTime ||
      activeSession.created_at ||
      activeSession.createdAt ||
      null;

    console.log(
      "ENTRY TIME FROM SESSION:",
      entryTime
    );

    // ==========================================
    // 7. GET VEHICLE DATA
    // ==========================================

    const vehicleNumber =
      activeSession.vehicle_number ||
      activeSession.vehicleNumber ||
      student.vehicle_number ||
      student.vehicleNumber ||
      student.vehicle ||
      null;

    const vehicleType =
      activeSession.vehicle_type ||
      activeSession.vehicleType ||
      student.vehicle_type ||
      student.vehicleType ||
      null;

    console.log(
      "========== VEHICLE DEBUG =========="
    );

    console.log(
      "ACTIVE SESSION:",
      {
        vehicle_number:
          activeSession.vehicle_number,

        vehicleNumber:
          activeSession.vehicleNumber,

        vehicle_type:
          activeSession.vehicle_type,

        vehicleType:
          activeSession.vehicleType,
      }
    );

    console.log(
      "STUDENT:",
      {
        vehicle:
          student.vehicle,

        vehicle_number:
          student.vehicle_number,

        vehicleNumber:
          student.vehicleNumber,

        vehicle_type:
          student.vehicle_type,

        vehicleType:
          student.vehicleType,
      }
    );

    console.log(
      "FINAL VEHICLE NUMBER:",
      vehicleNumber
    );

    console.log(
      "FINAL VEHICLE TYPE:",
      vehicleType
    );

    console.log(
      "==================================="
    );

    // ==========================================
    // 8. CREATE UNIQUE LOG ID
    // ==========================================

    const logId =
      `LOG${Date.now()}${Math.floor(
        Math.random() * 1000
      )}`;

    // ==========================================
    // 9. CREATE PARKING LOG
    // ==========================================

    const logData = {
      // ========================================
      // LOG ID
      // ========================================

      id: logId,

      // ========================================
      // SESSION ID
      // ========================================

      sessionId:
        activeSession.id,

      // ========================================
      // STUDENT
      // ========================================

      studentId:
        activeSession.student_id ||
        activeSession.studentId ||
        student.enrollment,

      studentName:
        activeSession.student_name ||
        activeSession.studentName ||
        student.name,

      // ========================================
      // VEHICLE
      // IMPORTANT:
      // Backend expects vehicle_type
      // ========================================

      vehicleNumber,

      vehicle_type:
        vehicleType,

      // ========================================
      // DEPARTMENT
      // ========================================

      department:
        activeSession.department ||
        student.department ||
        null,

      // ========================================
      // ENTRY TIME
      // ========================================

      entryTime,

      // ========================================
      // EXIT TIME
      // ========================================

      exitTime,

      // ========================================
      // STATUS
      // ========================================

      status: "completed",

      // ========================================
      // PARKING SLOT
      // ========================================

      parkingSlot:
        activeSession.parking_slot ||
        activeSession.parkingSlot ||
        null,

      // ========================================
      // VERIFIED BY
      // ========================================

      verifiedBy:
        activeSession.verified_by ||
        activeSession.verifiedBy ||
        "Watchman",

      // ========================================
      // PAYMENT
      // ========================================

      paymentStatus:
        activeSession.payment_status ||
        activeSession.paymentStatus ||
        "active",

      // ========================================
      // CREATED AT
      // ========================================

      createdAt:
        activeSession.created_at ||
        activeSession.createdAt ||
        entryTime,

      // ========================================
      // COMPLETED DATE
      // ========================================

      completedDate,
    };

    console.log(
      "FINAL LOG DATA:",
      logData
    );

    // ==========================================
    // 10. SAVE LOG TO DATABASE
    // ==========================================

    const logResponse =
      await createParkingLog(logData);

    console.log(
      "CREATE PARKING LOG RESPONSE:",
      logResponse
    );

    if (
      logResponse?.success === false
    ) {
      throw new Error(
        logResponse?.message ||
          "Failed to create parking log"
      );
    }

    const savedLog =
      logResponse?.log ||
      logResponse?.parkingLog ||
      logData;

    console.log(
      "PARKING LOG SAVED:",
      savedLog
    );

    // ==========================================
    // 11. UPDATE PARKING SESSION
    // ==========================================

    const sessionUpdate = {
      exitTime,
      status: "completed",
      completedDate,
    };

    console.log(
      "UPDATING PARKING SESSION:",
      sessionUpdate
    );

    const sessionResponse =
      await updateParkingSession(
        activeSession.id,
        sessionUpdate
      );

    console.log(
      "UPDATED SESSION RESPONSE:",
      sessionResponse
    );

    // ==========================================
    // 12. COMPLETED SESSION
    // ==========================================

    const completedSession =
      sessionResponse?.session ||
      sessionResponse?.parkingSession ||
      {
        ...activeSession,

        exit_time:
          exitTime,

        exitTime:
          displayExitTime,

        status:
          "completed",

        completed_date:
          completedDate,

        completedDate:
          completedDate,
      };

    // ==========================================
    // 13. SUCCESS
    // ==========================================

    return {
      status: "success",

      message:
        "Exit Successful",

      student,

      session:
        completedSession,

      log:
        savedLog,
    };

  } catch (error) {

    console.error(
      "COMPLETE EXIT ERROR:",
      error
    );

    return {
      status: "danger",

      message:
        error.response?.data?.message ||
        error.message ||
        "Exit Failed",
    };
  }
};