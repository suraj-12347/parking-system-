
import { useEffect, useMemo, useState } from "react";
import {
  Search,
  CalendarDays,
  UserRound,
  Car,
  Bike,
  Clock3,
  ParkingSquare,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import Card from "../components/common/Card";

import { getParkingLogs } from "../api/parkignLogApi.js";

const ParkingLogs = () => {
  // ==========================================
  // STATE
  // ==========================================

  const [logs, setLogs] = useState([]);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedStudent, setSelectedStudent] =
    useState("");

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);


  // ==========================================
  // LOAD PARKING LOGS
  // ==========================================

  const loadLogs = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getParkingLogs();

      console.log(
        "PARKING LOG API RESPONSE:",
        response
      );

      const parkingLogs =
        response?.logs || [];

      console.log(
        "PARKING LOGS:",
        parkingLogs
      );

      setLogs(
        Array.isArray(parkingLogs)
          ? parkingLogs
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load parking logs:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load parking logs"
      );

      setLogs([]);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadLogs();
  }, []);


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const getDate = (value) => {
    if (!value) return null;

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString(
      "en-CA",
      {
        timeZone: "Asia/Kolkata",
      }
    );
  };


  // ==========================================
  // FORMAT DATE + TIME
  // ==========================================

  const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      }
    );
  };


  // ==========================================
  // STUDENTS FROM LOGS
  // ==========================================

  const students = useMemo(() => {
    const map = new Map();

    logs.forEach((log) => {
      if (!log.student_id) return;

      if (!map.has(log.student_id)) {
        map.set(log.student_id, {
          studentId: log.student_id,

          studentName:
            log.student_name ||
            log.student_id,
        });
      }
    });

    return Array.from(
      map.values()
    ).sort((a, b) =>
      a.studentName.localeCompare(
        b.studentName
      )
    );
  }, [logs]);


  // ==========================================
  // FILTER LOGS
  // ==========================================

  const filteredLogs = useMemo(() => {
    return logs
      .filter((log) => {

        // --------------------------------------
        // DATE
        // --------------------------------------

        if (selectedDate) {
          const logDate = getDate(
            log.created_at ||
              log.completed_date ||
              log.entry_time
          );

          if (logDate !== selectedDate) {
            return false;
          }
        }


        // --------------------------------------
        // STUDENT
        // --------------------------------------

        if (
          selectedStudent &&
          log.student_id !==
            selectedStudent
        ) {
          return false;
        }


        // --------------------------------------
        // SEARCH
        // --------------------------------------

        if (search.trim()) {
          const query =
            search
              .toLowerCase()
              .trim();

          const studentName =
            log.student_name
              ?.toLowerCase() || "";

          const studentId =
            log.student_id
              ?.toLowerCase() || "";

          const vehicleNumber =
            log.vehicle_number
              ?.toLowerCase() || "";

          const vehicleType =
            log.vehicle_type
              ?.toLowerCase() || "";

          const parkingSlot =
            log.parking_slot
              ?.toLowerCase() || "";

          const matches =
            studentName.includes(query) ||
            studentId.includes(query) ||
            vehicleNumber.includes(query) ||
            vehicleType.includes(query) ||
            parkingSlot.includes(query);

          if (!matches) {
            return false;
          }
        }

        return true;
      })

      // --------------------------------------
      // LATEST FIRST
      // --------------------------------------

      .sort((a, b) => {
        const aDate =
          new Date(
            a.created_at ||
              a.completed_date ||
              a.entry_time ||
              0
          ).getTime();

        const bDate =
          new Date(
            b.created_at ||
              b.completed_date ||
              b.entry_time ||
              0
          ).getTime();

        return bDate - aDate;
      });

  }, [
    logs,
    selectedDate,
    selectedStudent,
    search,
  ]);


  // ==========================================
  // TODAY'S LOGS
  // ==========================================

  const today =
    getDate(new Date());

  const todayLogs = logs.filter(
    (log) =>
      getDate(
        log.created_at ||
          log.completed_date ||
          log.entry_time
      ) === today
  );


  // ==========================================
  // FILTER STATUS
  // ==========================================

  const isFilterApplied =
    Boolean(
      selectedDate ||
        selectedStudent ||
        search.trim()
    );


  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const clearFilters = () => {
    setSelectedDate("");
    setSelectedStudent("");
    setSearch("");
  };


  // ==========================================
  // VEHICLE ICON
  // ==========================================

  const VehicleIcon = ({
    type,
  }) => {
    const vehicleType =
      type?.toLowerCase();

    if (
      vehicleType === "bike" ||
      vehicleType === "motorcycle"
    ) {
      return <Bike size={18} />;
    }

    return <Car size={18} />;
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <FullScreenLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading parking logs...
            </p>
          </div>
        </div>
      </FullScreenLayout>
    );
  }


  // ==========================================
  // RENDER
  // ==========================================

  return (
    <FullScreenLayout>
      <div className="space-y-6">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Parking Logs
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              View all parking entry and exit records.
            </p>
          </div>


          <button
            type="button"
            onClick={() =>
              loadLogs(true)
            }
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>


        {/* =====================================
            STATS
        ===================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <Card>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                <ParkingSquare size={21} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Total Logs
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {logs.length}
                </p>
              </div>

            </div>
          </Card>


          <Card>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <Clock3 size={21} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Today's Logs
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {todayLogs.length}
                </p>
              </div>

            </div>
          </Card>


          <Card>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <UserRound size={21} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Students
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {students.length}
                </p>
              </div>

            </div>
          </Card>


          <Card>
            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <Car size={21} />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Filtered Logs
                </p>

                <p className="text-2xl font-bold text-slate-800">
                  {filteredLogs.length}
                </p>
              </div>

            </div>
          </Card>

        </div>


        {/* =====================================
            FILTERS
        ===================================== */}

        <Card>

          <div className="grid gap-4 lg:grid-cols-4">

            {/* SEARCH */}

            <div className="relative lg:col-span-2">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search student, vehicle or slot..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* DATE */}

            <div className="relative">

              <CalendarDays
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>


            {/* STUDENT */}

            <select
              value={selectedStudent}
              onChange={(e) =>
                setSelectedStudent(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="">
                All Students
              </option>

              {students.map(
                (student) => (
                  <option
                    key={
                      student.studentId
                    }
                    value={
                      student.studentId
                    }
                  >
                    {student.studentName} (
                    {student.studentId})
                  </option>
                )
              )}
            </select>

          </div>


          {/* CLEAR */}

          {isFilterApplied && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200"
            >
              <X size={16} />

              Clear Filters
            </button>
          )}

        </Card>


        {/* =====================================
            LOG TABLE
        ===================================== */}

        <Card>

          <div className="mb-5 flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Parking Records
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Showing{" "}
                {filteredLogs.length}{" "}
                of {logs.length} records
              </p>
            </div>

          </div>


          {filteredLogs.length === 0 ? (

            <div className="flex min-h-[250px] items-center justify-center text-center">

              <div>

                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                  <ParkingSquare
                    size={26}
                  />
                </div>

                <h3 className="font-semibold text-slate-700">
                  No parking logs found
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Try changing your filters.
                </p>

              </div>

            </div>

          ) : (

            <div className="w-full">

              <table className="w-full  text-left">

                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">

                    <th className="px-2 py-3">
                      Student
                    </th>

                    <th className="px-2 py-3">
                      Vehicle
                    </th>
{/* 
                    <th className="px-2 py-3">
                      Parking Slot
                    </th> */}

                    <th className="px-2 py-3">
                      Entry
                    </th>

                    <th className="px-2 py-3">
                      Exit
                    </th>

                    <th className="px-2 py-3">
                      Status
                    </th>

                    {/* <th className="px-4 py-3">
                      Verified By
                    </th> */}

                  </tr>
                </thead>


                <tbody>

                  {filteredLogs.map(
                    (log) => (

                      <tr
                        key={log.id}
                        className="border-b border-slate-100 transition hover:bg-slate-50"
                      >

                        {/* STUDENT */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                              <UserRound
                                size={18}
                              />
                            </div>

                            <div>

                              <p className="font-semibold text-slate-800">
                                {log.student_name ||
                                  "Unknown Student"}
                              </p>

                              <p className="mt-0.5 text-xs text-slate-500">
                                {log.student_id ||
                                  "—"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* VEHICLE */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                              <VehicleIcon
                                type={
                                  log.vehicle_type
                                }
                              />
                            </div>

                            <div>

                              <p className="font-semibold uppercase text-slate-700">
                                {log.vehicle_number ||
                                  "—"}
                              </p>

                              <p className="text-xs capitalize text-slate-500">
                                {log.vehicle_type ||
                                  "—"}
                              </p>

                            </div>

                          </div>

                        </td>


                        {/* SLOT */}

                        {/* <td className="px-4 py-4">

                          <span className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">

                            <ParkingSquare
                              size={15}
                            />

                            {log.parking_slot ||
                              "—"}

                          </span>

                        </td> */}


                        {/* ENTRY */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <Clock3
                              size={15}
                              className="text-green-500"
                            />

                            <span>
                              {formatDateTime(
                                log.entry_time
                              )}
                            </span>

                          </div>

                        </td>


                        {/* EXIT */}

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-2 text-sm text-slate-600">

                            <Clock3
                              size={15}
                              className="text-red-500"
                            />

                            <span>
                              {formatDateTime(
                                log.exit_time
                              )}
                            </span>

                          </div>

                        </td>


                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              log.status ===
                              "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {log.status ||
                              "—"}
                          </span>

                        </td>


                        {/* VERIFIED */}

                        {/* <td className="px-4 py-4">

                          <span className="text-sm font-medium text-slate-600">
                            {log.verified_by ||
                              "—"}
                          </span>

                        </td> */}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </Card>

      </div>
    </FullScreenLayout>
  );
};

export default ParkingLogs;

