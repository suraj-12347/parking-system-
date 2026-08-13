import { useEffect, useMemo, useState } from "react";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import Card from "../components/common/Card";

import { getParkingSessions } from "../api/parkingSessionApi";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);

  const [stats, setStats] = useState([
    {
      title: "Total Entries",
      value: 0,
      color: "text-green-600",
    },
    {
      title: "Total Exits",
      value: 0,
      color: "text-blue-600",
    },
    {
      title: "Currently Inside",
      value: 0,
      color: "text-yellow-600",
    },
  ]);

  // ==========================================
  // GET DATE IN INDIA TIMEZONE
  // ==========================================

  const getLocalDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });
  };

  // ==========================================
  // FORMAT TIME
  // ==========================================

  const formatTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // ==========================================
  // LOAD PARKING SESSIONS
  // ==========================================

  const loadSessions = async () => {
    try {
      const response = await getParkingSessions();

      console.log(
        "DATABASE PARKING SESSIONS:",
        response
      );

      // API response:
      // {
      //   sessions: [...]
      // }

      const data = response?.sessions || [];

      setSessions(data);
    } catch (error) {
      console.error(
        "FAILED TO LOAD PARKING SESSIONS:",
        error
      );

      setSessions([]);
    }
  };

  // ==========================================
  // LOAD EVERY SECOND
  // ==========================================

  useEffect(() => {
    loadSessions();

    const interval = setInterval(() => {
      loadSessions();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // ==========================================
  // TODAY'S SESSIONS
  //
  // created_at is ONLY used to determine
  // whether the session belongs to today.
  // ==========================================

  const todaySessions = useMemo(() => {
    const today = getLocalDate(new Date());

    return sessions.filter((session) => {
      const sessionDate = getLocalDate(
        session.created_at ||
          session.createdAt
      );

      return sessionDate === today;
    });
  }, [sessions]);

  // ==========================================
  // STATS
  // ==========================================

  useEffect(() => {
    // ========================================
    // TOTAL ENTRIES
    // Every parking session = one entry
    // ========================================

    const totalEntries =
      todaySessions.length;

    // ========================================
    // TOTAL EXITS
    // ========================================

    const totalExits =
      todaySessions.filter(
        (session) =>
          session.status === "completed" ||
          session.exit_time ||
          session.exitTime
      ).length;

    // ========================================
    // CURRENTLY INSIDE
    // ========================================

    const currentlyInside =
      todaySessions.filter(
        (session) =>
          session.status === "inside"
      ).length;

    // ========================================
    // UPDATE STATS
    // ========================================

    setStats([
      {
        title: "Total Entries",
        value: totalEntries,
        color: "text-green-600",
      },
      {
        title: "Total Exits",
        value: totalExits,
        color: "text-blue-600",
      },
      {
        title: "Currently Inside",
        value: currentlyInside,
        color: "text-yellow-600",
      },
    ]);
  }, [todaySessions]);

  // ==========================================
  // STUDENT-WISE ACTIVITY
  // ==========================================

  const activities = useMemo(() => {
    const activityMap = {};

    todaySessions.forEach((session) => {
      // ======================================
      // STUDENT ID
      // ======================================

      const studentId =
        session.student_id ||
        session.studentId;

      if (!studentId) return;

      // ======================================
      // CREATE STUDENT RECORD
      // ======================================

      if (!activityMap[studentId]) {
        activityMap[studentId] = {
          studentId,

          student:
            session.student_name ||
            session.studentName ||
            studentId,

          vehicle:
            session.vehicle_number ||
            session.vehicleNumber ||
            "—",

          vehicle_type:
            session.vehicle_type ||
            session.vehicleType ||
            "—",

          lastEntry: null,

          lastExit: null,

          visits: 0,
        };
      }

      const student =
        activityMap[studentId];

      // ======================================
      // EVERY SESSION = ONE VISIT
      // ======================================

      student.visits += 1;

      // ======================================
      // ENTRY TIME
      //
      // IMPORTANT:
      // Use entry_time, NOT created_at
      // ======================================

      const entryDate =
        session.entry_time ||
        session.entryTime;

      if (entryDate) {
        const currentEntry =
          new Date(entryDate);

        if (
          !Number.isNaN(
            currentEntry.getTime()
          )
        ) {
          if (
            !student.lastEntry ||
            currentEntry.getTime() >
              new Date(
                student.lastEntry
              ).getTime()
          ) {
            student.lastEntry =
              entryDate;
          }
        }
      }

      // ======================================
      // EXIT TIME
      //
      // IMPORTANT:
      // Use exit_time
      // ======================================

      const exitDate =
        session.exit_time ||
        session.exitTime;

      if (exitDate) {
        const currentExit =
          new Date(exitDate);

        if (
          !Number.isNaN(
            currentExit.getTime()
          )
        ) {
          if (
            !student.lastExit ||
            currentExit.getTime() >
              new Date(
                student.lastExit
              ).getTime()
          ) {
            student.lastExit =
              exitDate;
          }
        }
      }
    });

    // ======================================
    // SORT LATEST ACTIVITY FIRST
    // ======================================

    return Object.values(
      activityMap
    ).sort((a, b) => {
      const aEntryTime = a.lastEntry
        ? new Date(
            a.lastEntry
          ).getTime()
        : 0;

      const aExitTime = a.lastExit
        ? new Date(
            a.lastExit
          ).getTime()
        : 0;

      const bEntryTime = b.lastEntry
        ? new Date(
            b.lastEntry
          ).getTime()
        : 0;

      const bExitTime = b.lastExit
        ? new Date(
            b.lastExit
          ).getTime()
        : 0;

      const aTime = Math.max(
        aEntryTime,
        aExitTime
      );

      const bTime = Math.max(
        bEntryTime,
        bExitTime
      );

      return bTime - aTime;
    });
  }, [todaySessions]);

  // ==========================================
  // UI
  // ==========================================

  return (
    <FullScreenLayout>
      <div className="space-y-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <h1 className="text-3xl font-bold">
          Parking Dashboard
        </h1>

        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

          {stats.map((item) => (
            <Card key={item.title}>

              <p className="text-sm text-slate-500">
                {item.title}
              </p>

              <h2
                className={`mt-3 text-5xl font-bold ${item.color}`}
              >
                {item.value}
              </h2>

            </Card>
          ))}

        </div>

        {/* =====================================
            TODAY'S PARKING ACTIVITY
        ===================================== */}

        <Card title="Today's Parking Activity">

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b text-left">

                  <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                    Student
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                    Vehicle
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                    Last Entry
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-500">
                    Last Exit
                  </th>

                  <th className="px-4 py-4 text-right text-sm font-semibold text-slate-500">
                    Visits Today
                  </th>

                </tr>

              </thead>

              <tbody>

                {activities.length === 0 ? (

                  <tr>

                    <td
                      colSpan="5"
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      No parking activity today
                    </td>

                  </tr>

                ) : (

                  activities.map((item) => (

                    <tr
                      key={item.studentId}
                      className="border-b last:border-0 hover:bg-slate-50"
                    >

                      {/* STUDENT */}

                      <td className="px-4 py-4">

                        <p className="font-semibold text-slate-800">
                          {item.student}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.studentId}
                        </p>

                      </td>

                      {/* VEHICLE */}

                      <td className="px-4 py-4 font-medium text-slate-700">

                        {item.vehicle_type !== "—"
                          ? `${item.vehicle_type} (${item.vehicle})`
                          : item.vehicle}

                      </td>

                      {/* ENTRY */}

                      <td className="px-4 py-4 text-slate-600">

                        {formatTime(
                          item.lastEntry
                        )}

                      </td>

                      {/* EXIT */}

                      <td className="px-4 py-4 text-slate-600">

                        {formatTime(
                          item.lastExit
                        )}

                      </td>

                      {/* VISITS */}

                      <td className="px-4 py-4 text-right">

                        <span className="inline-flex min-w-8 justify-center rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-700">
                          {item.visits}
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </Card>

        {/* =====================================
            SYSTEM STATUS
        ===================================== */}

        <Card title="System Status">

          <div className="space-y-3 text-lg">

            <p>
              🟢 Camera : Online
            </p>

            <p>
              🟢 Entry Gate : Active
            </p>

            <p>
              🟢 Exit Gate : Active
            </p>

            <p>
              🟢 Database : Connected (TiDB)
            </p>

          </div>

        </Card>

      </div>
    </FullScreenLayout>
  );
};

export default Dashboard;