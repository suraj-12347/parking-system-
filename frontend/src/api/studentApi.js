import axiosInstance from "./axioInstance";

// ================================
// GET ALL STUDENTS
// ================================
export const getStudents = async () => {
  const response = await axiosInstance.get(
    "/students"
  );

  return response.data;
};

// ================================
// GET SINGLE STUDENT
// ================================
export const getStudent = async (enrollment) => {
  const response = await axiosInstance.get(
    `/students/${enrollment}`
  );

  return response.data;
};

// ================================
// CREATE STUDENT
// ================================
export const createStudent = async (formData) => {
  const response = await axiosInstance.post(
    "/students",
    formData
  );

  return response.data;
};

// ================================
// UPDATE SUBSCRIPTION
// ================================
export const updateSubscription = async (
  enrollment,
  subscription
) => {
  const response = await axiosInstance.put(
    `/students/${enrollment}/subscription`,
    {
      subscription,
    }
  );

  return response.data;
};

// ================================
// UPDATE BLACKLIST
// ================================
export const updateStudentBlacklist = async (
  enrollment,
  blacklisted
) => {
  const response = await axiosInstance.patch(
    `/students/${enrollment}/blacklist`,
    {
      blacklisted,
    }
  );

  return response.data;
};

// ================================
// UPDATE ACTIVE
// ================================
export const updateStudentActive = async (
  enrollment,
  active
) => {
  const response = await axiosInstance.patch(
    `/students/${enrollment}/active`,
    {
      active,
    }
  );

  return response.data;
};

// ================================
// RESET STUDENT PASSWORD
// ================================
export const resetStudentPassword = async (
  enrollment,
  newPassword
) => {
  const response = await axiosInstance.patch(
    `/students/${enrollment}/reset-password`,
    {
      newPassword,
    }
  );

  return response.data;
};

// ================================
// DELETE STUDENT
// ================================
export const deleteStudent = async (enrollment) => {
  const response = await axiosInstance.delete(
    `/students/${enrollment}`
  );

  return response.data;
};

// ================================
// GET LOGGED-IN STUDENT
// ================================
// ================================
// GET LOGGED-IN STUDENT
// ================================
export const getLoggedInStudent = async () => {
  const token = localStorage.getItem("studentToken");

  console.log("STUDENT TOKEN:", token);

  if (!token) {
    throw new Error("Student token not found");
  }

  const response = await axiosInstance.get(
    "/students/me",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "LOGGED-IN STUDENT RESPONSE:",
    response.data
  );

  return response.data;
};