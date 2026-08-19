import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";

import axiosInstance from "../../api/axioInstance";
import { getLoggedInStudent } from "../../api/studentApi";

const StudentEnter = () => {
  const [student, setStudent] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  const STUDENT_STORAGE_KEY = "student";
  const QR_STORAGE_KEY = "studentQR";

  // ==========================================
  // BACKEND BASE URL
  // ==========================================

  const getBaseUrl = () => {
    return (axiosInstance.defaults.baseURL || "")
      .replace(/\/api\/?$/, "")
      .replace(/\/$/, "");
  };

  // ==========================================
  // QR URL
  // ==========================================

  const getQrUrl = (studentData) => {
    if (!studentData?.qr_code) {
      return null;
    }

    if (
      typeof studentData.qr_code === "string" &&
      studentData.qr_code.startsWith("http")
    ) {
      return studentData.qr_code;
    }

    const baseUrl = getBaseUrl();

    return `${baseUrl}/${studentData.qr_code.replace(/^\/+/, "")}`;
  };

  // ==========================================
  // DOWNLOAD QR AS BASE64
  // ==========================================

  const downloadQrAsBase64 = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(
          `QR download failed: ${response.status}`
        );
      }

      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          resolve(reader.result);
        };

        reader.onerror = () => {
          reject(
            new Error("Failed to convert QR image")
          );
        };

        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error("QR DOWNLOAD ERROR:", error);
      return null;
    }
  };

  // ==========================================
  // LOAD STUDENT
  // ==========================================

  useEffect(() => {
    const loadStudent = async () => {
      try {
        const savedStudent =
          localStorage.getItem(
            STUDENT_STORAGE_KEY
          );

        const savedQR =
          localStorage.getItem(
            QR_STORAGE_KEY
          );

        // --------------------------------------
        // LOCAL STUDENT
        // --------------------------------------

        if (savedStudent) {
          try {
            const parsedStudent =
              JSON.parse(savedStudent);

            setStudent(parsedStudent);
          } catch (error) {
            console.error(
              "LOCAL STUDENT PARSE ERROR:",
              error
            );
          }
        }

        // --------------------------------------
        // LOCAL QR
        // --------------------------------------

        if (savedQR) {
          setQrUrl(savedQR);
        }

        // --------------------------------------
        // OFFLINE
        // --------------------------------------

        if (!navigator.onLine) {
          console.log(
            "OFFLINE - USING SAVED DATA"
          );

          return;
        }

        // --------------------------------------
        // API
        // --------------------------------------

        const response =
          await getLoggedInStudent();

        if (
          !response?.success ||
          !response?.student
        ) {
          return;
        }

        const freshStudent =
          response.student;

        // Save student

        localStorage.setItem(
          STUDENT_STORAGE_KEY,
          JSON.stringify(freshStudent)
        );

        setStudent(freshStudent);

        // --------------------------------------
        // QR
        // --------------------------------------

        const backendQrUrl =
          getQrUrl(freshStudent);

        if (!backendQrUrl) {
          return;
        }

        // Already saved

        if (savedQR) {
          return;
        }

        // Download

        const base64QR =
          await downloadQrAsBase64(
            backendQrUrl
          );

        if (!base64QR) {
          return;
        }

        // Save offline

        localStorage.setItem(
          QR_STORAGE_KEY,
          base64QR
        );

        setQrUrl(base64QR);

        console.log(
          "QR SAVED FOR OFFLINE USE"
        );
      } catch (error) {
        console.error(
          "STUDENT LOAD ERROR:",
          error
        );

        // --------------------------------------
        // FALLBACK
        // --------------------------------------

        const savedStudent =
          localStorage.getItem(
            STUDENT_STORAGE_KEY
          );

        const savedQR =
          localStorage.getItem(
            QR_STORAGE_KEY
          );

        if (savedStudent) {
          try {
            setStudent(
              JSON.parse(savedStudent)
            );
          } catch (error) {
            console.error(
              "LOCAL STUDENT ERROR:",
              error
            );
          }
        }

        if (savedQR) {
          setQrUrl(savedQR);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStudent();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading && !student) {
    return (
      <div className="flex h-[calc(100dvh-72px)] items-center justify-center overflow-hidden">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  // ==========================================
  // NO STUDENT
  // ==========================================

  if (!student) {
    return (
      <div className="flex h-[calc(100dvh-72px)] items-center justify-center overflow-hidden px-5 ">
        <div className="text-center">
          <QrCode
            size={45}
            className="mx-auto text-slate-300"
          />

          <p className="mt-3 text-sm font-medium text-slate-600">
            Student information not found
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI - FIXED
  // ==========================================

  return (
    <div className="h-[calc(100dvh-72px)] overflow-hidden px-4">

      <div className="mx-auto flex h-full w-full max-w-sm flex-col items-center justify-center text-center">

        {/* TITLE */}

        <div className="shrink-0">

          <h1 className="text-xl font-bold text-slate-800">
            Parking Entry
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Show your QR code at the entry gate
          </p>

        </div>

        {/* QR */}

        {/* QR */}

<div className="mt-3 shrink-0 rounded-2xl ">

  {qrUrl ? (
    <img
      src={qrUrl}
      alt="Student Parking QR"
      className="
        h-[calc(100vw-48px)]
        w-[calc(100vw-48px)]
       
        object-contain
        max-h-[360px]
        max-w-[360px]
        rounded-xl
       
      "
    />
  ) : (
    <div
      className="
        flex
        h-[calc(100vw-48px)]
        w-[calc(100vw-48px)]
        max-h-[360px]
        max-w-[360px]
        items-center
        justify-center
        rounded-xl
        bg-white
        px-6
        text-center
      "
    >
      <p className="text-sm font-medium leading-5 text-slate-500">
        Your parking QR code is not available.
        <br />
        Please contact the administration.
      </p>
    </div>
  )}

</div>

        {/* STUDENT */}

        <div className="mt-2 shrink-0">

          <h2 className="text-base font-bold text-slate-800">
            {student.name}
          </h2>

          <p className="mt-0.5 text-[10px] text-slate-400">
            {student.enrollment}
          </p>

        </div>

        {/* INSTRUCTION */}

        <div className="mt-3 shrink-0">

          <p className="text-xs font-medium text-slate-700">
            Show this QR to the parking camera
          </p>

          <p className="mx-auto mt-0.5 max-w-[280px] text-[10px] leading-4 text-slate-400">
            Keep your phone screen bright and hold
            the QR steady in front of the camera.
          </p>

        </div>

        {/* STATUS */}

        <div className="mt-2 flex shrink-0 items-center justify-center gap-1.5">

          <span
            className={`h-1.5 w-1.5 rounded-full ${
              student.active
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          <span className="text-[10px] font-medium text-slate-500">
            {student.active
              ? "Account Active"
              : "Account Inactive"}
          </span>

        </div>

      </div>

    </div>
  );
};

export default StudentEnter;