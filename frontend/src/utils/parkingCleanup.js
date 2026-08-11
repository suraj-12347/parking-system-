const getLocalDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
};


const clearParkingSessions = () => {
  try {
    localStorage.setItem(
      "parkingSessions",
      JSON.stringify([])
    );

    localStorage.setItem(
      "parkingSessionsLastCleanup",
      getLocalDate()
    );

    console.log(
      "🌙 12:00 AM - Parking sessions cleaned"
    );

  } catch (error) {
    console.log(
      "❌ Parking cleanup error:",
      error
    );
  }
};


export const cleanupParkingSessions = () => {
  try {
    const today = getLocalDate();

    const lastCleanup = localStorage.getItem(
      "parkingSessionsLastCleanup"
    );

    console.log("🕐 Cleanup check");
    console.log("Today:", today);
    console.log("Last cleanup:", lastCleanup);


    // Agar aaj cleanup already ho chuka hai
    if (lastCleanup === today) {
      console.log("⏭️ Already cleaned today");
      return;
    }


    // App 12 AM ke baad open hui hai
    // to stale sessions clean kar do
    clearParkingSessions();

  } catch (error) {
    console.log(
      "❌ Cleanup check error:",
      error
    );
  }
};


export const startMidnightCleanup = () => {

  const scheduleNextCleanup = () => {

    const now = new Date();

    const nextMidnight = new Date(now);

    // Next day 12:00:00 AM
    nextMidnight.setHours(24, 0, 0, 0);

    const delay =
      nextMidnight.getTime() -
      now.getTime();


    console.log(
      "🌙 Next cleanup:",
      nextMidnight.toLocaleString()
    );


    const timer = setTimeout(() => {

      clearParkingSessions();

      // Next midnight ke liye timer dobara set karo
      scheduleNextCleanup();

    }, delay);


    return timer;
  };


  return scheduleNextCleanup();
};