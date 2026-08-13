import {
  Car,
  GraduationCap,
  Hash,
  User,
  UserRound,
} from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";
import axiosInstance from "../../api/axioInstance";

const StudentCard = ({ student }) => {
  if (!student) return null;

  // ==========================================
  // STUDENT PHOTO URL
  // ==========================================
  const getPhotoUrl = () => {
    if (!student.photo) {
      return null;
    }

    // Agar photo already full URL hai
    if (
      typeof student.photo === "string" &&
      student.photo.startsWith("http")
    ) {
      return student.photo;
    }

    // API baseURL:
    // http://localhost:4000/api
    //
    // Photo:
    // uploads/students/example.jpg
    //
    // Final:
    // http://localhost:4000/uploads/students/example.jpg

    return `${axiosInstance.defaults.baseURL.replace(
      /\/api\/?$/,
      ""
    )}/${String(student.photo).replace(/^\/+/, "")}`;
  };

  const photoUrl = getPhotoUrl();

  return (
    <Card className="rounded-3xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">

        {/* ======================================
            STUDENT PHOTO
        ====================================== */}
        <div className="flex justify-center">
          <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-4 border-slate-200 bg-blue-100 text-blue-600">

            {photoUrl ? (
              <img
                src={photoUrl}
                alt={student.name || "Student"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  console.error(
                    "Student image failed:",
                    photoUrl
                  );

                  e.currentTarget.style.display =
                    "none";
                }}
              />
            ) : (
              <UserRound size={50} />
            )}

          </div>
        </div>

        {/* ======================================
            STUDENT DETAILS
        ====================================== */}
        <div className="flex-1 space-y-4">

          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {student.name}
            </h2>

            <div className="mt-2">
              <Badge
                variant={
                  student.active
                    ? "success"
                    : "danger"
                }
              >
                {student.active
                  ? "Active"
                  : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">

            {/* Enrollment */}
            <div className="flex items-center gap-3">
              <Hash
                className="text-blue-600"
                size={20}
              />

              <div>
                <p className="text-xs text-slate-500">
                  Enrollment
                </p>

                <p className="font-semibold">
                  {student.enrollment}
                </p>
              </div>
            </div>

            {/* Course */}
            <div className="flex items-center gap-3">
              <GraduationCap
                className="text-blue-600"
                size={20}
              />

              <div>
                <p className="text-xs text-slate-500">
                  Course
                </p>

                <p className="font-semibold">
                  {student.course}
                </p>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-center gap-3">
              <Car
                className="text-blue-600"
                size={20}
              />

              <div>
                <p className="text-xs text-slate-500">
                  Vehicle Number
                </p>

                <p className="font-semibold">
                  {student.vehicle}
                </p>
              </div>
            </div>

            {/* Department */}
            <div className="flex items-center gap-3">
              <User
                className="text-blue-600"
                size={20}
              />

              <div>
                <p className="text-xs text-slate-500">
                  Department
                </p>

                <p className="font-semibold">
                  {student.department}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Card>
  );
};

export default StudentCard;