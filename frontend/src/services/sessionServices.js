import { validateEntry } from "./parkingValidation";

export const createEntrySession = async (studentId) => {
  console.log("CREATE ENTRY CALL:", studentId);

  // 1. Validate Student
  const validation = await validateEntry(studentId);

  console.log("VALIDATION RESULT:", validation);

  // 2. Validation fail
  if (validation.status !== "success") {
    return validation;
  }

  // 3. Student Data
  const student = validation.student;

  console.log("STUDENT DATA:", student);

  // 4. Existing Sessions
  const sessions =
    JSON.parse(localStorage.getItem("parkingSessions")) || [];

  // 5. Safety Check - Already Inside
  const activeSession = sessions.find(
    (item) =>
      String(item.studentId).trim() ===
        String(student.enrollment).trim() &&
      item.status === "inside"
  );

  if (activeSession) {
    return {
      status: "danger",
      message: "Student Already Inside",
      student,
      session: activeSession,
    };
  }

  // 6. Current date/time
  const now = new Date();

  // 7. Create New Session
  const newSession = {
    id: `SES${Date.now()}`,

    studentId: student.enrollment,
    studentName: student.name,

    vehicleNumber: student.vehicle,
    vehicle_type: student.vehicle_type,

    department: student.department,

    // Display ke liye
    entryTime: now.toLocaleTimeString("en-IN"),

    // Actual date/time ke liye
    createdAt: now.toISOString(),

    exitTime: null,

    status: "inside",

    parkingSlot: "A-10",

    verifiedBy: "Watchman",

    paymentStatus: "active",
  };

  // 8. Save Session
  sessions.push(newSession);

  localStorage.setItem(
    "parkingSessions",
    JSON.stringify(sessions)
  );

  console.log("NEW SESSION:", newSession);

  console.log(
    "SAVED SESSIONS:",
    JSON.parse(
      localStorage.getItem("parkingSessions")
    )
  );

  return {
    status: "success",
    message: "Entry Allowed",
    student,
    session: newSession,
  };
};