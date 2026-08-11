
import { useState } from "react";
import { Upload, UserPlus, X } from "lucide-react";
import { toast } from "react-toastify";

import Card from "../components/common/Card";
import axiosInstance from "../api/axioInstance";

const initialFormData = {
  enrollment: "",
  name: "",
  course: "B.Tech",
  department: "Computer Science & Engineering",
  vehicle: "",
  vehicle_type: "Bike",
  validFrom: "",
  validTill: "",
};

const AddStudent = () => {
  const [formData, setFormData] = useState(initialFormData);

  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  // ============================
  // INPUT CHANGE
  // ============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================
  // PHOTO CHANGE
  // ============================

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Image check
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    // 5 MB check
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Photo must be less than 5 MB.");
      e.target.value = "";
      return;
    }

    // Old preview cleanup
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  // ============================
  // REMOVE PHOTO
  // ============================

  const removePhoto = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPhoto(null);
    setPreview("");

    const fileInput =
      document.getElementById("student-photo");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // ============================
  // SUBMIT
  // ============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ----------------------------
    // Validation
    // ----------------------------

    if (!formData.enrollment.trim()) {
      toast.error("Enrollment / Roll No. is required.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Student name is required.");
      return;
    }

    if (!formData.course) {
      toast.error("Please select course.");
      return;
    }

    if (!formData.department.trim()) {
      toast.error("Department is required.");
      return;
    }

    if (!formData.vehicle.trim()) {
      toast.error("Vehicle number is required.");
      return;
    }

    if (!formData.validFrom) {
      toast.error("Please select Valid From date.");
      return;
    }

    if (!formData.validTill) {
      toast.error("Please select Valid Till date.");
      return;
    }

    if (
      new Date(formData.validTill) <
      new Date(formData.validFrom)
    ) {
      toast.error(
        "Valid Till date cannot be before Valid From."
      );
      return;
    }

    try {
      setLoading(true);

      // ============================
      // FORM DATA
      // ============================

      const data = new FormData();

      // Student
      data.append(
        "enrollment",
        formData.enrollment
          .trim()
          .toUpperCase()
      );

      data.append(
        "name",
        formData.name.trim()
      );

      data.append(
        "course",
        formData.course
      );

      data.append(
        "department",
        formData.department.trim()
      );

      // Vehicle
      data.append(
        "vehicle",
        formData.vehicle
          .trim()
          .toUpperCase()
      );

      data.append(
        "vehicle_type",
        formData.vehicle_type
      );

      // Default status
      data.append("active", "true");
      data.append("blacklisted", "false");

      // Subscription
      data.append(
        "subscription",
        JSON.stringify({
          active: true,
          validFrom: formData.validFrom,
          validTill: formData.validTill,
        })
      );

      // Photo
      if (photo) {
        data.append("photo", photo);
      }

      // ============================
      // DEBUG
      // ============================

      console.log(
        "FORM DATA:"
      );

      for (const [key, value] of data.entries()) {
        console.log(
          key,
          value
        );
      }

      // ============================
      // API CALL
      // ============================

      const response =
        await axiosInstance.post(
          "/students",
          data
        );

      console.log(
        "CREATE STUDENT RESPONSE:",
        response.data
      );

      // ============================
      // SUCCESS
      // ============================

      toast.success(
        response.data?.message ||
          "Student added successfully!"
      );

      // Reset
      setFormData(initialFormData);

      removePhoto();

    } catch (error) {
      console.error(
        "CREATE STUDENT ERROR:",
        error
      );

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to add student.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">

      {/* ============================
          HEADER
      ============================ */}

      <div className="px-4 pt-2">
        <h1 className="text-3xl font-bold text-slate-800">
          Add New Student
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Register a new student for the parking system
        </p>
      </div>

      {/* ============================
          FORM CARD
      ============================ */}

      <Card>

        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* ============================
              PHOTO
          ============================ */}

          <section>

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Student Photo
            </h2>

            <div className="flex flex-wrap items-center gap-5">

              {/* Preview */}

              <div className="relative">

                <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                  {preview ? (

                    <img
                      src={preview}
                      alt="Student preview"
                      className="h-full w-full object-cover"
                    />

                  ) : (

                    <UserPlus
                      size={34}
                      className="text-slate-400"
                    />

                  )}

                </div>

                {photo && (
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600"
                  >
                    <X size={15} />
                  </button>
                )}

              </div>

              {/* Upload */}

              <div>

                <label
                  htmlFor="student-photo"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >

                  <Upload size={18} />

                  {photo
                    ? "Change Photo"
                    : "Choose Photo"}

                </label>

                <input
                  id="student-photo"
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                {photo && (
                  <p className="mt-2 max-w-xs truncate text-sm text-slate-500">
                    {photo.name}
                  </p>
                )}

                <p className="mt-2 text-xs text-slate-400">
                  JPG, PNG or WEBP • Maximum 5 MB
                </p>

              </div>

            </div>

          </section>

          {/* ============================
              STUDENT INFORMATION
          ============================ */}

          <section>

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Student Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Enrollment */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Enrollment / Roll No.
                </label>

                <input
                  type="text"
                  name="enrollment"
                  value={formData.enrollment}
                  onChange={handleChange}
                  placeholder="IPS2024006"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Student Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Jay"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Course */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Course
                </label>

                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="B.Tech">
                    B.Tech
                  </option>

                  <option value="M.Tech">
                    M.Tech
                  </option>

                  <option value="BCA">
                    BCA
                  </option>

                  <option value="MCA">
                    MCA
                  </option>

                  <option value="BBA">
                    BBA
                  </option>

                  <option value="MBA">
                    MBA
                  </option>

                  <option value="B.Pharm">
                    B.Pharm
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              {/* Department */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Department
                </label>

                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Computer Science & Engineering"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

          {/* ============================
              VEHICLE
          ============================ */}

          <section>

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Vehicle Information
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Vehicle */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Vehicle Number
                </label>

                <input
                  type="text"
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  placeholder="MP07AB1238"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 uppercase outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Vehicle Type */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Vehicle Type
                </label>

                <select
                  name="vehicle_type"
                  value={formData.vehicle_type}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="Bike">
                    Bike
                  </option>

                  <option value="Car">
                    Car
                  </option>

                  <option value="Scooty">
                    Scooty
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

            </div>

          </section>

          {/* ============================
              SUBSCRIPTION
          ============================ */}

          <section>

            <h2 className="mb-4 text-lg font-semibold text-slate-800">
              Subscription
            </h2>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Valid From */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valid From
                </label>

                <input
                  type="date"
                  name="validFrom"
                  value={formData.validFrom}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

              {/* Valid Till */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Valid Till
                </label>

                <input
                  type="date"
                  name="validTill"
                  value={formData.validTill}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>

          </section>

          {/* ============================
              DEFAULT STATUS
          ============================ */}

          <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">

            <p className="text-sm text-blue-800">

              <span className="font-semibold">
                Account Status:
              </span>{" "}

              New student will automatically be added as{" "}

              <span className="font-semibold">
                Active
              </span>{" "}

              and{" "}

              <span className="font-semibold">
                Not Blacklisted
              </span>
              .

            </p>

          </div>

          {/* ============================
              SUBMIT
          ============================ */}

          <div className="flex justify-end border-t border-slate-100 pt-5">

            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <UserPlus size={19} />

              {loading
                ? "Adding Student..."
                : "Add Student"}

            </button>

          </div>

        </form>

      </Card>

    </div>
  );
};

export default AddStudent;

