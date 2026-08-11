import { getStudent } from "../api/studentApi";
import {
  createParkingLog,
  updateParkingLog, 
} from "../api/parkignLogApi";

export const completeExitSession = async (
  studentId
) => {
  try {
    // ==========================================
    // 1. GET STUDENT
    // ==========================================

    const response =
      await getStudent(studentId);

    const student =
      response?.student || response;

    if (!student) {
      return {
        status: "danger",
        message: "Student Not Found",
      };
    }

    // ==========================================
    // 2. GET ACTIVE SESSION FROM LOCALSTORAGE
    // ==========================================

    const sessions =
      JSON.parse(
        localStorage.getItem(
          "parkingSessions"
        )
      ) || [];

    const sessionIndex =
      sessions.findIndex(
        (session) =>
          String(
            session.studentId
          ).trim() ===
            String(
              student.enrollment
            ).trim() &&
          session.status === "inside"
      );

    // ==========================================
    // 3. NO ACTIVE SESSION
    // ==========================================

    if (sessionIndex === -1) {
      return {
        status: "danger",
        message:
          "No Active Parking Session",
        student,
      };
    }

    // ==========================================
    // 4. GET SESSION
    // ==========================================

    const activeSession =
      sessions[sessionIndex];

    // ==========================================
    // 5. EXIT DATE/TIME
    // ==========================================

    const now = new Date();

    const exitTime =
      now.toISOString();

    const completedDate =
      now.toISOString();

    // ==========================================
    // 6. COMPLETE LOCAL SESSION
    // ==========================================

    const completedSession = {
      ...activeSession,

      status: "completed",

      exitTime:
        now.toLocaleTimeString("en-IN"),

      completedDate,
    };

    // ==========================================
    // 7. UPDATE LOCAL SESSION
    // ==========================================

    sessions[sessionIndex] =
      completedSession;

    localStorage.setItem(
      "parkingSessions",
      JSON.stringify(sessions)
    );

    // ==========================================
    // 8. SAVE/UPDATE PARKING LOG IN DATABASE
    // ==========================================

    /*
      Abhi database log ka ID
      local session me nahi hai.

      Isliye agar entry ke waqt DB log
      create nahi hua hai, to yahan
      createParkingLog use karenge.
    */

    const logData = {
      id: activeSession.id,

      studentId:
        student.enrollment,

      studentName:
        student.name,

      vehicleNumber:
        activeSession.vehicleNumber ||
        student.vehicle ||
        null,

      vehicleType:
        activeSession.vehicle_type ||
        student.vehicle_type ||
        null,

      department:
        student.department,

      entryTime:
        activeSession.createdAt,

      exitTime,

      status: "completed",

      parkingSlot:
        activeSession.parkingSlot ||
        null,

      verifiedBy:
        activeSession.verifiedBy ||
        "Watchman",

      paymentStatus:
        activeSession.paymentStatus ||
        "active",

      createdAt:
        activeSession.createdAt,

      completedDate,
    };

    console.log(
      "PARKING LOG TO DATABASE:",
      logData
    );

    // ==========================================
    // 9. CREATE LOG IN DATABASE
    // ==========================================

    const logResponse =
      await createParkingLog(
        logData
      );

    const savedLog =
      logResponse?.log ||
      logResponse?.parkingLog ||
      logData;

    // ==========================================
    // 10. SUCCESS
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
        "Exit Failed",
    };
  }
};