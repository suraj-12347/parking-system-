import { Car, GraduationCap, Hash, User } from "lucide-react";
import Card from "../common/Card";
import Badge from "../common/Badge";

const StudentCard = ({ student }) => {
  if (!student) return null;

  return (
    <Card className="rounded-3xl">
      <div className="flex flex-col gap-6 md:flex-row md:items-center">
        {/* Student Photo */}
        <div className="flex justify-center">
          <img
            src={student.photo}
            alt={student.name}
            className="h-36 w-36 rounded-full border-4 border-slate-200 object-cover"
          />
        </div>

        {/* Student Details */}
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">
              {student.name}
            </h2>

            <div className="mt-2">
              <Badge
                variant={student.active ? "success" : "danger"}
              >
                {student.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Hash className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">
                  Enrollment
                </p>
                <p className="font-semibold">
                  {student.enrollment}
                </p>
              </div>
            </div>

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

            <div className="flex items-center gap-3">
              <Car className="text-blue-600" size={20} />
              <div>
                <p className="text-xs text-slate-500">
                  Vehicle Number
                </p>
                <p className="font-semibold">
                  {student.vehicle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="text-blue-600" size={20} />
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