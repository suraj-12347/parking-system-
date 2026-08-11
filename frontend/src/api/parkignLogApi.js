import axiosInstance from "./axioInstance";

// ========================================
// GET ALL PARKING LOGS
// ========================================

export const getParkingLogs = async () => {
  const response = await axiosInstance.get(
    "/parking-logs"
  );

  return response.data;
};


// ========================================
// GET SINGLE PARKING LOG
// ========================================

export const getParkingLog = async (id) => {
  const response = await axiosInstance.get(
    `/parking-logs/${id}`
  );

  return response.data;
};


// ========================================
// CREATE PARKING LOG
// ========================================

export const createParkingLog = async (logData) => {
  const response = await axiosInstance.post(
    "/parking-logs",
    logData
  );

  return response.data;
};


// ========================================
// UPDATE PARKING LOG
// ========================================

export const updateParkingLog = async (
  id,
  logData
) => {
  const response = await axiosInstance.patch(
    `/parking-logs/${id}`,
    logData
  );

  return response.data;
};


// ========================================
// GET STUDENT PARKING LOGS
// ========================================

export const getStudentParkingLogs = async (
  studentId
) => {
  const response = await axiosInstance.get(
    `/parking-logs/student/${studentId}`
  );

  return response.data;
};


// ========================================
// DELETE PARKING LOG
// ========================================

export const deleteParkingLog = async (id) => {
  const response = await axiosInstance.delete(
    `/parking-logs/${id}`
  );

  return response.data;
};