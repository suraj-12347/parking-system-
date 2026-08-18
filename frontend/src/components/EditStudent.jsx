import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axioInstance";

import {
  ArrowLeft,
  Save,
  Trash2,
  ShieldCheck,
  ShieldBan,
  CalendarDays,
  UserRound,
  AlertTriangle,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";

import { toast } from "react-toastify";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import Card from "../components/common/Card";

import {
  getStudent,
  updateStudentActive,
  updateStudentBlacklist,
  updateSubscription,
  deleteStudent,
  resetStudentPassword,
} from "../api/studentApi";

const EditStudent = () => {
  const { enrollment } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // ========================================
  // PASSWORD STATE
  // ========================================

  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resettingPassword, setResettingPassword] =
    useState(false);

  // ========================================
  // FORM STATE
  // ========================================

  const [formData, setFormData] = useState({
    active: true,
    blacklisted: false,
    subscriptionActive: false,
    validFrom: "",
    validTill: "",
  });

  // ========================================
  // DATE FORMAT
  // ========================================

  const formatInputDate = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value).slice(0, 10);
    }

    const year = date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // ========================================
  // LOAD STUDENT
  // ========================================

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);

        const response =
          await getStudent(enrollment);

        const studentData =
          response?.student || response;

        if (!studentData) {
          toast.error("Student not found");
          navigate("/students");
          return;
        }

        setStudent(studentData);

        setFormData({
          active:
            Number(studentData.active) === 1,

          blacklisted:
            Number(studentData.blacklisted) === 1,

          subscriptionActive:
            Number(
              studentData.subscription_active
            ) === 1,

          validFrom:
            studentData.subscription_valid_from
              ? formatInputDate(
                  studentData.subscription_valid_from
                )
              : "",

          validTill:
            studentData.subscription_valid_till
              ? formatInputDate(
                  studentData.subscription_valid_till
                )
              : "",
        });
      } catch (error) {
        console.error(
          "Failed to load student:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load student"
        );

        navigate("/students");
      } finally {
        setLoading(false);
      }
    };

    if (enrollment) {
      loadStudent();
    }
  }, [enrollment, navigate]);

  // ========================================
  // FORM CHANGE
  // ========================================

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ========================================
  // SAVE CHANGES
  // ========================================

  const handleSave = async (e) => {
    e.preventDefault();

    // ----------------------------------------
    // SUBSCRIPTION DATE VALIDATION
    // ----------------------------------------

    if (
      formData.subscriptionActive &&
      (!formData.validFrom ||
        !formData.validTill)
    ) {
      toast.error(
        "Please select subscription dates."
      );

      return;
    }

    if (
      formData.subscriptionActive &&
      new Date(formData.validTill) <
        new Date(formData.validFrom)
    ) {
      toast.error(
        "Valid Till cannot be before Valid From."
      );

      return;
    }

    try {
      setSaving(true);

      // ======================================
      // UPDATE ACTIVE STATUS
      // ======================================

      await updateStudentActive(
        enrollment,
        formData.active
      );

      // ======================================
      // UPDATE BLACKLIST STATUS
      // ======================================

      await updateStudentBlacklist(
        enrollment,
        formData.blacklisted
      );

      // ======================================
      // UPDATE SUBSCRIPTION
      // ======================================

      await updateSubscription(
        enrollment,
        {
          active:
            formData.subscriptionActive,

          validFrom:
            formData.subscriptionActive
              ? formData.validFrom
              : null,

          validTill:
            formData.subscriptionActive
              ? formData.validTill
              : null,
        }
      );

      // ======================================
      // UPDATE LOCAL STATE
      // ======================================

      setStudent((prev) => ({
        ...prev,

        active:
          formData.active ? 1 : 0,

        blacklisted:
          formData.blacklisted
            ? 1
            : 0,

        subscription_active:
          formData.subscriptionActive
            ? 1
            : 0,

        subscription_valid_from:
          formData.subscriptionActive
            ? formData.validFrom
            : null,

        subscription_valid_till:
          formData.subscriptionActive
            ? formData.validTill
            : null,
      }));

      toast.success(
        "Student updated successfully"
      );
    } catch (error) {
      console.error(
        "Update student error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update student"
      );
    } finally {
      setSaving(false);
    }
  };

  // ========================================
  // RESET STUDENT PASSWORD
  // ========================================

  const handleResetPassword = async () => {
    const password =
      newPassword.trim();

    // ----------------------------------------
    // VALIDATION
    // ----------------------------------------

    if (!password) {
      toast.error(
        "Please enter a new password"
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters"
      );
      return;
    }

    // ----------------------------------------
    // CONFIRMATION
    // ----------------------------------------

    const confirmed =
      window.confirm(
        `Are you sure you want to reset the password for ${student?.name} (${student?.enrollment})?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setResettingPassword(true);

      await resetStudentPassword(
        enrollment,
        password
      );

      toast.success(
        "Student password reset successfully"
      );

      // Clear password
      setNewPassword("");
      setShowPassword(false);

    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to reset student password"
      );
    } finally {
      setResettingPassword(false);
    }
  };

  // ========================================
  // DELETE STUDENT
  // ========================================

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        `Are you sure you want to permanently delete ${student?.name} (${student?.enrollment})?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteStudent(
        enrollment
      );

      toast.success(
        "Student deleted successfully"
      );

      navigate("/students");
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
      setDeleting(false);
    }
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <FullScreenLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading student...
            </p>

          </div>
        </div>
      </FullScreenLayout>
    );
  }

  // ========================================
  // NO STUDENT
  // ========================================

  if (!student) {
    return (
      <FullScreenLayout>
        <div className="flex min-h-[60vh] items-center justify-center">

          <Card>

            <div className="p-8 text-center">

              <h2 className="text-xl font-semibold text-slate-700">
                Student Not Found
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigate("/students")
                }
                className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Back to Students
              </button>

            </div>

          </Card>

        </div>
      </FullScreenLayout>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <FullScreenLayout>

      <div className="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <button
              type="button"
              onClick={() =>
                navigate("/students")
              }
              className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft size={17} />

              Back to Students
            </button>

            <h1 className="text-3xl font-bold text-slate-800">
              Edit Student
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage parking access and subscription
            </p>

          </div>

        </div>

        {/* ========================================
            STUDENT BASIC INFO
        ======================================== */}

        <Card>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

            {/* Avatar */}

            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-100 text-blue-600">

              {student.photo ? (

                <img
                  src={`${axiosInstance.defaults.baseURL.replace(
                    "/api",
                    ""
                  )}/${student.photo.replace(
                    /^\/+/,
                    ""
                  )}`}
                  alt={student.name}
                  className="h-full w-full object-cover"
                />

              ) : (

                <UserRound size={35} />

              )}

            </div>

            {/* Student Info */}

            <div>

              <h2 className="text-2xl font-bold text-slate-800">
                {student.name}
              </h2>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {student.enrollment}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {student.course} •{" "}
                {student.department}
              </p>

            </div>

          </div>

        </Card>

        {/* ========================================
            PARKING ACCESS
        ======================================== */}

        <Card title="Parking Access">

          <div className="grid gap-5 md:grid-cols-2">

            {/* ====================================
                ACTIVE
            ==================================== */}

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      formData.active
                        ? "bg-green-100 text-green-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ShieldCheck size={21} />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Account Status
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Controls whether the student
                      can use parking.
                    </p>

                  </div>

                </div>

                {/* Active Toggle */}

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      active:
                        !prev.active,
                    }))
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    formData.active
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }`}
                  aria-label="Toggle active status"
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      formData.active
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              <div
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  formData.active
                    ? "bg-green-50 text-green-700"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                {formData.active
                  ? "Student is Active"
                  : "Student is Inactive"}
              </div>

            </div>

            {/* ====================================
                BLACKLIST
            ==================================== */}

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      formData.blacklisted
                        ? "bg-red-100 text-red-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <ShieldBan size={21} />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Blacklist
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Blacklisted students cannot
                      enter the parking area.
                    </p>

                  </div>

                </div>

                {/* Blacklist Toggle */}

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      blacklisted:
                        !prev.blacklisted,
                    }))
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    formData.blacklisted
                      ? "bg-red-500"
                      : "bg-slate-300"
                  }`}
                  aria-label="Toggle blacklist"
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      formData.blacklisted
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

              <div
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
                  formData.blacklisted
                    ? "bg-red-50 text-red-700"
                    : "bg-slate-50 text-slate-600"
                }`}
              >
                {formData.blacklisted
                  ? "Student is Blacklisted"
                  : "Student is Not Blacklisted"}
              </div>

            </div>

          </div>

        </Card>

        {/* ========================================
            SUBSCRIPTION
        ======================================== */}

        <Card title="Subscription">

          <div className="space-y-5">

            {/* Subscription Toggle */}

            <div className="rounded-2xl border border-slate-200 p-5">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                      formData.subscriptionActive
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    <CalendarDays size={21} />
                  </div>

                  <div>

                    <h3 className="font-semibold text-slate-800">
                      Parking Subscription
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Enable or disable parking
                      subscription.
                    </p>

                  </div>

                </div>

                {/* Subscription Toggle */}

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      subscriptionActive:
                        !prev.subscriptionActive,
                    }))
                  }
                  className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                    formData.subscriptionActive
                      ? "bg-green-500"
                      : "bg-slate-300"
                  }`}
                  aria-label="Toggle subscription"
                >

                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                      formData.subscriptionActive
                        ? "left-6"
                        : "left-1"
                    }`}
                  />

                </button>

              </div>

            </div>

            {/* Subscription Dates */}

            <div className="grid gap-5 md:grid-cols-2">

              {/* VALID FROM */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valid From
                </label>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="validFrom"
                    value={
                      formData.validFrom
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !formData.subscriptionActive
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />

                </div>

              </div>

              {/* VALID TILL */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valid Till
                </label>

                <div className="relative">

                  <CalendarDays
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    name="validTill"
                    value={
                      formData.validTill
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      !formData.subscriptionActive
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-10 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                  />

                </div>

              </div>

            </div>

            {/* Blacklist Warning */}

            {formData.blacklisted && (

              <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                <AlertTriangle
                  size={20}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>

                  <p className="font-semibold text-red-700">
                    Student is blacklisted
                  </p>

                  <p className="mt-1 text-sm text-red-600">
                    Even with an active subscription,
                    this student will not be allowed
                    to enter the parking area.
                  </p>

                </div>

              </div>

            )}

          </div>

        </Card>

        {/* ========================================
            RESET PASSWORD
        ======================================== */}

        <Card title="Student Password">

          <div className="space-y-5">

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">

              <div className="flex items-start gap-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                  <KeyRound size={21} />
                </div>

                <div>

                  <h3 className="font-semibold text-slate-800">
                    Reset Student Password
                  </h3>

                  <p className="mt-1 text-sm text-slate-600">
                    If the student has forgotten their
                    password, create a new password here.
                  </p>

                </div>

              </div>

              {/* Password Input */}

              <div className="mt-5">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  New Password
                </label>

                <div className="relative">

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={newPassword}
                    onChange={(e) =>
                      setNewPassword(
                        e.target.value
                      )
                    }
                    placeholder="Enter new password"
                    minLength={6}
                    disabled={
                      resettingPassword
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    disabled={
                      resettingPassword
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:cursor-not-allowed"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Minimum 6 characters. The password
                  will be securely encrypted before
                  being stored.
                </p>

              </div>

              {/* Reset Button */}

              <div className="mt-4 flex justify-end">

                <button
                  type="button"
                  onClick={
                    handleResetPassword
                  }
                  disabled={
                    resettingPassword ||
                    saving ||
                    deleting
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {resettingPassword ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-amber-300 border-t-white" />

                      Resetting...
                    </>
                  ) : (
                    <>
                      <KeyRound size={19} />

                      Reset Password
                    </>
                  )}

                </button>

              </div>

            </div>

          </div>

        </Card>

        {/* ========================================
            ACTIONS
        ======================================== */}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">

          {/* DELETE */}

          <button
            type="button"
            onClick={handleDelete}
            disabled={
              saving ||
              deleting ||
              resettingPassword
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >

            {deleting ? (

              <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />

            ) : (

              <Trash2 size={19} />

            )}

            {deleting
              ? "Deleting..."
              : "Delete Student"}

          </button>

          {/* SAVE / CANCEL */}

          <div className="flex gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/students")
              }
              disabled={
                saving ||
                deleting ||
                resettingPassword
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving ||
                deleting ||
                resettingPassword
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (

                <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-white" />

              ) : (

                <Save size={19} />

              )}

              {saving
                ? "Saving..."
                : "Save Changes"}

            </button>

          </div>

        </div>

      </div>

    </FullScreenLayout>
  );
};

export default EditStudent;