
import axiosInstance from "./axioInstance";

// ================================
// GET ALL STUDENTS
// ================================
export const getStudents = async () => {
  const response = await axiosInstance.get("/students");

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
// UPDATE STATUS
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
// DELETE STUDENT
// ================================
export const deleteStudent = async (enrollment) => {
  const response = await axiosInstance.delete(
    `/students/${enrollment}`
  );

  return response.data;
};


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
