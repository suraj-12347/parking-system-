
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  QrCode,
  Car,
  GraduationCap,
  CalendarDays,
  ShieldCheck,
  ShieldBan,
} from "lucide-react";

import FullScreenLayout from "../components/layout/FullScreenLayout";
import Card from "../components/common/Card";
import { getStudent } from "../api/studentApi";
import axiosInstance from "../api/axioInstance";

// Backend server
const API_BASE_URL = "http://localhost:4000";

const StudentProfile = () => {
  const { enrollment } = useParams();

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // LOAD STUDENT
  // ========================================

  useEffect(() => {
    const loadStudent = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getStudent(enrollment);

        console.log("STUDENT PROFILE RESPONSE:", response);

        const studentData =
          response?.student || response?.data?.student || response;

        if (!studentData) {
          throw new Error("Student data not found");
        }

        setStudent(studentData);
      } catch (error) {
        console.error(
          "Failed to load student:",
          error
        );

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load student profile"
        );
      } finally {
        setLoading(false);
      }
    };

    if (enrollment) {
      loadStudent();
    } else {
      setLoading(false);
      setError("Student enrollment not found");
    }
  }, [enrollment]);

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ========================================
  // PHOTO URL
  // ========================================

  const getPhotoUrl = () => {
    if (!student?.photo) {
      return null;
    }

    if (
      typeof student.photo === "string" &&
      student.photo.startsWith("http")
    ) {
      return student.photo;
    }

    if (typeof student.photo === "string") {
      return `${API_BASE_URL}/${student.photo.replace(
        /^\/+/,
        ""
      )}`;
    }

    return null;
  };

  // ========================================
  // QR URL
  // ========================================

  const getQrUrl = () => {
    if (!student?.qr_code) {
      return null;
    }

    if (
      typeof student.qr_code === "string" &&
      student.qr_code.startsWith("http")
    ) {
      return student.qr_code;
    }

    if (typeof student.qr_code === "string") {
      return `${API_BASE_URL}/${student.qr_code.replace(
        /^\/+/,
        ""
      )}`;
    }

    return null;
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <FullScreenLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-sm text-slate-500">
              Loading student profile...
            </p>
          </div>
        </div>
      </FullScreenLayout>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !student) {
    return (
      <FullScreenLayout>
        <div className="w-full space-y-6">

          <Link
            to="/students"
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
          >
            <ArrowLeft size={18} />
            Back to Students
          </Link>

          <Card>
            <div className="py-16 text-center">

              <UserRound
                size={50}
                className="mx-auto mb-4 text-slate-300"
              />

              <h2 className="text-xl font-semibold text-slate-700">
                Student Not Found
              </h2>

              <p className="mt-2 text-sm text-red-500">
                {error ||
                  "Unable to find this student"}
              </p>

            </div>
          </Card>

        </div>
      </FullScreenLayout>
    );
  }

  const photoUrl = getPhotoUrl();
  const qrUrl = getQrUrl();

  const isActive =
    Number(student.active) === 1 ||
    student.active === true;

  const isBlacklisted =
    Number(student.blacklisted) === 1 ||
    student.blacklisted === true;

  const isSubscribed =
    Number(student.subscription_active) === 1 ||
    student.subscription_active === true;

  return (
    <FullScreenLayout>
      <div className="w-full space-y-6">

        {/* ========================================
            BACK
        ======================================== */}

        <Link
          to="/students"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          <ArrowLeft size={18} />
          Back to Students
        </Link>

        {/* ========================================
            PROFILE HEADER
        ======================================== */}

        <Card>
          <div className="flex flex-col gap-8 lg:flex-row">

            {/* ================================
                PHOTO
            ================================= */}

            <div className="flex justify-center lg:justify-start">

              <div className="flex h-64 w-64 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">

                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={student.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      console.error(
                        "Student photo failed:",
                        photoUrl
                      );

                      e.currentTarget.style.display =
                        "none";
                    }}
                  />
                ) : (
                  <UserRound
                    size={90}
                    className="text-slate-300"
                  />
                )}

              </div>

            </div>

            {/* ================================
                BASIC INFORMATION
            ================================= */}

            <div className="flex-1">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <h1 className="text-3xl font-bold text-slate-800">
                    {student.name}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {student.enrollment}
                  </p>

                </div>

                {/* STATUS */}

                <div className="flex flex-wrap gap-2">

                  {isActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700">
                      <ShieldCheck size={15} />
                      Active
                    </span>
                  )}

                  {!isActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                      Inactive
                    </span>
                  )}

                  {isBlacklisted && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700">
                      <ShieldBan size={15} />
                      Blacklisted
                    </span>
                  )}

                </div>

              </div>

              {/* COURSE / DEPARTMENT */}

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <GraduationCap size={18} />
                    Course
                  </div>

                  <p className="mt-1 font-semibold text-slate-800">
                    {student.course || "—"}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <GraduationCap size={18} />
                    Department
                  </div>

                  <p className="mt-1 font-semibold text-slate-800">
                    {student.department || "—"}
                  </p>

                </div>

              </div>

            </div>

            {/* ================================
                QR
            ================================= */}

           {/* QR */}

<div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 p-5">

  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-600">
    <QrCode size={18} />
    Student QR
  </div>

  <div className="flex h-44 w-44 items-center justify-center rounded-xl border bg-white p-3">


{qrUrl ? (
  <a
    href={qrUrl}
    download={`${student.enrollment}-QR.png`}
    title="Click to download QR"
    className="block h-full w-full cursor-pointer"
  >
    <img
      src={qrUrl}
      alt={`${student.name} QR`}
      className="h-full w-full object-contain transition hover:scale-105"
    />
  </a>
) : (
  <QrCode
    size={80}
    className="text-slate-300"
  />
)}


  </div>

  <p className="mt-3 text-xs text-slate-400">
    Click QR to download
  </p>

  <p className="mt-1 text-xs font-medium text-slate-500">
    {student.enrollment}
  </p>

</div>


          </div>
        </Card>

        {/* ========================================
            DETAILS
        ======================================== */}

        <div className="grid gap-6 lg:grid-cols-2">

          {/* STUDENT INFORMATION */}

          <Card title="Student Information">

            <div className="divide-y divide-slate-100">

              <DetailRow
                label="Full Name"
                value={student.name}
              />

              <DetailRow
                label="Enrollment / Roll No."
                value={student.enrollment}
              />

              <DetailRow
                label="Course"
                value={student.course}
              />

              <DetailRow
                label="Department"
                value={student.department}
              />

              <DetailRow
                label="Registered On"
                value={formatDate(
                  student.created_at
                )}
              />

            </div>

          </Card>

          {/* VEHICLE */}

          <Card title="Vehicle Information">

            <div className="divide-y divide-slate-100">

              <DetailRow
                label="Vehicle Number"
                value={student.vehicle}
                icon={<Car size={17} />}
              />

              <DetailRow
                label="Vehicle Type"
                value={student.vehicle_type}
                icon={<Car size={17} />}
              />

              <DetailRow
                label="Parking Status"
                value={
                  isBlacklisted
                    ? "Blacklisted"
                    : isActive
                    ? "Allowed"
                    : "Inactive"
                }
              />

            </div>

          </Card>

        </div>

        {/* ========================================
            SUBSCRIPTION
        ======================================== */}

        <Card title="Subscription">

          <div className="grid gap-4 sm:grid-cols-3">

            {/* STATUS */}

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-sm text-slate-500">
                Status
              </p>

              <p
                className={`mt-1 font-semibold ${
                  isSubscribed
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isSubscribed
                  ? "Subscribed"
                  : "Non-Subscribed"}
              </p>

            </div>

            {/* VALID FROM */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={17} />
                Valid From
              </div>

              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(
                  student.subscription_valid_from
                )}
              </p>

            </div>

            {/* VALID TILL */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="flex items-center gap-2 text-sm text-slate-500">
                <CalendarDays size={17} />
                Valid Till
              </div>

              <p className="mt-1 font-semibold text-slate-800">
                {formatDate(
                  student.subscription_valid_till
                )}
              </p>

            </div>

          </div>

        </Card>

      </div>
    </FullScreenLayout>
  );
};

// ========================================
// DETAIL ROW
// ========================================

const DetailRow = ({
  label,
  value,
  icon,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">

      <div className="flex items-center gap-2 text-sm text-slate-500">
        {icon}
        <span>{label}</span>
      </div>

      <p className="text-right text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>

    </div>
  );
};

export default StudentProfile;

