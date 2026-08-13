
import { useEffect, useState } from "react";
import axiosInstance from "../api/axioInstance";
import {
  Edit,
  Trash2,
  Ban,
  Search,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import Card from "../components/common/Card";

import {
  getStudents,
  updateStudentBlacklist,
    deleteStudent,
} from "../api/studentApi";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [blacklistLoading, setBlacklistLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ========================================
  // LOAD STUDENTS
  // ========================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await getStudents();

      const studentList =
        response?.students || response || [];

      setStudents(studentList);
    } catch (error) {
      console.error(
        "Failed to load students:",
        error
      );

      setStudents([]);
      console.log("students:", students);

      toast.error(
        error.response?.data?.message ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ========================================
  // BLACKLIST / REMOVE BLACKLIST
  // ========================================

  const handleBlacklist = async (student) => {
    const isBlacklisted =
      Number(student.blacklisted) === 1;

    const newBlacklistStatus = !isBlacklisted;

    try {
      setBlacklistLoading(student.enrollment);

      await updateStudentBlacklist(
        student.enrollment,
        newBlacklistStatus
      );
      

      // Local state immediately update
      setStudents((prevStudents) =>
        prevStudents.map((item) =>
          item.enrollment === student.enrollment
            ? {
                ...item,
                blacklisted:
                  newBlacklistStatus ? 1 : 0,
              }
            : item
        )
      );

      toast.success(
        newBlacklistStatus
          ? "Student blacklisted successfully"
          : "Student removed from blacklist"
      );
    } catch (error) {
      console.error(
        "Blacklist update error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update blacklist status"
      );
    } finally {
      setBlacklistLoading(null);
    }
  };


  const handleDelete = async (student) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete ${student.name} (${student.enrollment})?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setDeleteLoading(student.enrollment);

    await deleteStudent(student.enrollment);

    // UI se immediately remove
    setStudents((prevStudents) =>
      prevStudents.filter(
        (item) =>
          item.enrollment !== student.enrollment
      )
    );

    toast.success(
      `${student.name} deleted successfully`
    );
  } catch (error) {
    console.error(
      "Delete student error:",
      error
    );

    toast.error(
      error.response?.data?.message ||
        "Failed to delete student"
    );
  } finally {
    setDeleteLoading(null);
  }
};

  // ========================================
  // SEARCH
  // ========================================

  const filteredStudents = students.filter(
    (student) => {
      const query = search
        .toLowerCase()
        .trim();

      return (
        student.name
          ?.toLowerCase()
          .includes(query) ||
        student.enrollment
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  // ========================================
  // RENDER
  // ========================================

  return (
    <FullScreenLayout>
      <div className="w-full space-y-6">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Students
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage registered parking students
            </p>
          </div>

          {/* Search */}

          <div className="relative w-full sm:w-80">

            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* ========================================
            STUDENTS LIST
        ======================================== */}

        <Card>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[800px]">

              {/* TABLE HEADER */}

              <thead>

                <tr className="border-b border-slate-200 text-left">

                  <th className="px-5 py-4 text-sm font-semibold text-slate-500">
                    Student
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-500">
                    Roll No.
                  </th>

                  <th className="px-5 py-4 text-sm font-semibold text-slate-500">
                    Subscription
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-500">
                    Edit
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-500">
                    Delete
                  </th>

                  <th className="px-5 py-4 text-center text-sm font-semibold text-slate-500">
                    Blacklist
                  </th>

                </tr>

              </thead>

              {/* TABLE BODY */}

              <tbody>

                {/* LOADING */}

                {loading ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading Students...
            </p>
          </div>
        </div>
                    </td>

                  </tr>

                ) : filteredStudents.length === 0 ? (

                  /* EMPTY */

                  <tr>

                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-slate-400"
                    >

                      <UserRound
                        size={35}
                        className="mx-auto mb-2 opacity-50"
                      />

                      No students found

                    </td>

                  </tr>

                ) : (

                  /* STUDENTS */

                  filteredStudents.map(
                    (student) => {

                      const isBlacklisted =
                        Number(
                          student.blacklisted
                        ) === 1;

                      const isActive =
                        Number(
                          student.active
                        ) === 1;

                      const isBlacklistLoading =
                        blacklistLoading ===
                        student.enrollment;

                      return (

                        <tr
                          key={student.enrollment}
                          className={`border-b border-slate-100 last:border-0 transition hover:bg-slate-50 ${
                            isBlacklisted
                              ? "bg-red-50/30"
                              : ""
                          }`}
                        >

                          {/* ========================================
                              STUDENT
                          ======================================== */}

                          <td className="px-5 py-4">

                            <div className="flex items-center gap-3">

                              {/* PHOTO */}

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700">

                                {student.photo ? (

<img
  src={`${axiosInstance.defaults.baseURL.replace(
    /\/api\/?$/,
    ""
  )}/${student.photo.replace(/^\/+/, "")}`}
  alt={student.name}
  className="h-full w-full object-cover"
/>
                                ) : (

                                  <UserRound
                                    size={19}
                                  />

                                )}

                              </div>

                              {/* NAME */}

                              <div>

                                <Link
                                  to={`/students/${student.enrollment}`}
                                  className="font-semibold text-slate-800 hover:text-blue-600 hover:underline"
                                >
                                  {student.name}
                                </Link>

                                {isBlacklisted && (

                                  <div className="text-xs font-medium text-red-500">
                                    Blacklisted
                                  </div>

                                )}

                                {!isBlacklisted &&
                                  !isActive && (

                                    <div className="text-xs font-medium text-slate-400">
                                      Inactive
                                    </div>

                                  )}

                              </div>

                            </div>

                          </td>

                          {/* ========================================
                              ROLL NO
                          ======================================== */}

                          <td className="px-5 py-4 font-medium text-slate-600">

                            {student.enrollment}

                          </td>

                          {/* ========================================
                              SUBSCRIPTION
                          ======================================== */}

                          <td className="px-5 py-4">

                            {Number(
                              student.subscription_active
                            ) === 1 ? (

                              <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                Subscribed
                              </span>

                            ) : (

                              <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                                Non-Subscribed
                              </span>

                            )}

                          </td>

                          {/* ========================================
                              EDIT
                          ======================================== */}

                          <td className="px-5 py-4 text-center">

                            <Link
                              to={`/students/${student.enrollment}/edit`}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-50"
                              title="Edit Student"
                            >

                              <Edit size={18} />

                            </Link>

                          </td>

                          {/* ========================================
                              DELETE
                          ======================================== */}

                          <td className="px-5 py-4 text-center">

                            <button
  type="button"
  disabled={
    deleteLoading === student.enrollment
  }
  onClick={() => handleDelete(student)}
  className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
  title="Delete Student"
>
  {deleteLoading === student.enrollment ? (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
  ) : (
    <Trash2 size={18} />
  )}
</button>

                          </td>

                          {/* ========================================
                              BLACKLIST
                          ======================================== */}

                          <td className="px-5 py-4 text-center">

                            <button
                              type="button"
                              disabled={
                                isBlacklistLoading
                              }
                              onClick={() =>
                                handleBlacklist(
                                  student
                                )
                              }
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                isBlacklisted
                                  ? "bg-red-100 text-red-600 hover:bg-red-200"
                                  : "text-slate-500 hover:bg-red-50 hover:text-red-600"
                              }`}
                              title={
                                isBlacklisted
                                  ? "Remove from Blacklist"
                                  : "Blacklist Student"
                              }
                            >

                              {isBlacklistLoading ? (

                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />

                              ) : (

                                <Ban size={18} />

                              )}

                            </button>

                          </td>

                        </tr>

                      );
                    }
                  )

                )}

              </tbody>

            </table>

          </div>

        </Card>

      </div>
    </FullScreenLayout>
  );
};

export default Students;

