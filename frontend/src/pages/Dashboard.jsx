
import { useEffect, useState } from "react";
import FullScreenLayout from "../components/layout/FullScreenLayout";
import Card from "../components/common/Card";

const Dashboard = () => {
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
    // {
    //   title: "Expired Subscriptions",
    //   value: 0,
    //   color: "text-red-600",
    // },
  ]);

  const [todaySessions, setTodaySessions] = useState([]);

  const loadStats = () => {
    const parkingSessions =
      JSON.parse(localStorage.getItem("parkingSessions")) || [];

    const today = new Date().toLocaleDateString();

    const todaySessionsData = parkingSessions.filter((session) => {
      const sessionDate = new Date(
        session.createdAt || Date.now()
      ).toLocaleDateString();

      return sessionDate === today;
    });

    setTodaySessions(todaySessionsData);

    const totalEntries = todaySessionsData.length;

    const totalExits = todaySessionsData.filter(
      (session) => session.status === "completed"
    ).length;

    const currentlyInside = todaySessionsData.filter(
      (session) => session.status === "inside"
    ).length;

    const expiredSubscriptions = todaySessionsData.filter(
      (session) => session.paymentStatus === "expired"
    ).length;

    console.log({
      todaySessions: todaySessionsData,
      totalEntries,
      totalExits,
      currentlyInside,
      expiredSubscriptions,
    });

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
      // {
      //   title: "Expired Subscriptions",
      //   value: expiredSubscriptions,
      //   color: "text-red-600",
      // },
    ]);
  };

  useEffect(() => {
    loadStats();

    const interval = setInterval(loadStats, 1000);

    return () => clearInterval(interval);
  }, []);

  // Student-wise activity
  const activityMap = {};

  todaySessions.forEach((session) => {
    const studentId =
      session.studentId || session.enrollment;

    if (!studentId) return;

    if (!activityMap[studentId]) {
      activityMap[studentId] = {
        studentId,

        student:
          session.studentName ||
          session.name ||
          studentId,

        vehicle:
          session.vehicle ||
          session.vehicleNumber ||
          "—",
         
          vehicle_type:
          session.vehicle_type ||
          "—",

        lastEntry: null,
        lastExit: null,
        visits: 0,
      };
    }

    const student = activityMap[studentId];

    // Har session = ek visit
    student.visits += 1;

    // Last Entry
    if (session.entryTime) {
      if (
        !student.lastEntry ||
        new Date(session.entryTime) >
          new Date(student.lastEntry)
      ) {
        student.lastEntry = session.entryTime;
      }
    }

    // Last Exit
    if (session.exitTime) {
      if (
        !student.lastExit ||
        new Date(session.exitTime) >
          new Date(student.lastExit)
      ) {
        student.lastExit = session.exitTime;
      }
    }
  });

  const activities = Object.values(activityMap).sort(
    (a, b) => {
      const aTime = new Date(
        a.lastExit || a.lastEntry || 0
      ).getTime();

      const bTime = new Date(
        b.lastExit || b.lastEntry || 0
      ).getTime();

      return bTime - aTime;
    }
  );

  const formatTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <FullScreenLayout>
      <div className="space-y-6">

        <h1 className="text-3xl font-bold">
          Parking Dashboard
        </h1>

        {/* Stats */}
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

        {/* Today's Parking Activity */}
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

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">
                          {item.student}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.studentId}
                        </p>
                      </td>

                      
<td className="px-4 py-4 font-medium text-slate-700">
  {item.vehicle_type
    ? `${item.vehicle_type} (${item.vehicle})`
    : item.vehicleNumber}
</td>



                      <td className="px-4 py-4 text-slate-600">
                        {formatTime(item.lastEntry)}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {formatTime(item.lastExit)}
                      </td>

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

        {/* System Status */}
        <Card title="System Status">

          <div className="space-y-3 text-lg">
            <p>🟢 Camera : Online</p>
            <p>🟢 Entry Gate : Active</p>
            <p>🟢 Exit Gate : Active</p>
            <p>🟢 Database : Connected (LocalStorage)</p>
          </div>

        </Card>

      </div>
    </FullScreenLayout>
  );
};

export default Dashboard;

