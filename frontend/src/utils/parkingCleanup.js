import { clearParkingSessions } from "../api/parkingSessionApi.js";

// ==========================================
// GET LOCAL DATE
// ==========================================

const getLocalDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;
};

// ==========================================
// CLEAR PARKING SESSIONS FROM DATABASE
// ==========================================

const clearSessionsFromDatabase = async () => {
  try {
    console.log(
      "🌙 Clearing parking sessions from database..."
    );

    const response =
      await clearParkingSessions();

    console.log(
      "✅ PARKING SESSIONS CLEARED:",
      response
    );

    // Last cleanup date save karenge
    localStorage.setItem(
      "parkingSessionsLastCleanup",
      getLocalDate()
    );

    return response;

  } catch (error) {
    console.error(
      "❌ DATABASE PARKING SESSION CLEANUP ERROR:",
      error
    );

    return null;
  }
};

// ==========================================
// CHECK WHETHER CLEANUP IS REQUIRED
// ==========================================

export const cleanupParkingSessions = async () => {
  try {
    const today = getLocalDate();

    const lastCleanup =
      localStorage.getItem(
        "parkingSessionsLastCleanup"
      );

    console.log("🕐 PARKING SESSION CLEANUP CHECK");
    console.log("Today:", today);
    console.log(
      "Last cleanup:",
      lastCleanup
    );

    // ========================================
    // ALREADY CLEANED TODAY
    // ========================================

    if (lastCleanup === today) {
      console.log(
        "⏭️ Parking sessions already cleaned today"
      );

      return;
    }

    // ========================================
    // NEW DATE
    // ========================================

    console.log(
      "🌙 New date detected - clearing database sessions"
    );

    await clearSessionsFromDatabase();

  } catch (error) {
    console.error(
      "❌ CLEANUP CHECK ERROR:",
      error
    );
  }
};

// ==========================================
// MIDNIGHT AUTO CLEANUP
// ==========================================

export const startMidnightCleanup = () => {
  const scheduleNextCleanup = () => {
    const now = new Date();

    const nextMidnight = new Date(now);

    // Next day 12:00 AM
    nextMidnight.setHours(
      24,
      0,
      0,
      0
    );

    const delay =
      nextMidnight.getTime() -
      now.getTime();

    console.log(
      "🌙 NEXT PARKING SESSION CLEANUP:",
      nextMidnight.toLocaleString("en-IN")
    );

    const timer = setTimeout(
      async () => {
        // Database se sessions clear
        await clearSessionsFromDatabase();

        // Next midnight ka timer
        scheduleNextCleanup();
      },
      delay
    );

    return timer;
  };

  return scheduleNextCleanup();
};