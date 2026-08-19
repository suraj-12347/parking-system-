import axiosInstance from "./axioInstance";

// ========================================
// GET ALL PARKING SESSIONS
// ========================================
export const getParkingSessions = async () => {
  const response = await axiosInstance.get(
    "/parking-sessions"
  );

  return response.data;
};


// ========================================
// GET SINGLE PARKING SESSION
// ========================================
export const getParkingSession = async (id) => {
  const response = await axiosInstance.get(
    `/parking-sessions/${id}`
  );

  return response.data;
};


// ========================================
// CREATE PARKING SESSION
// ========================================
export const createParkingSession = async (
  sessionData
) => {
  const response = await axiosInstance.post(
    "/parking-sessions",
    sessionData
  );

  return response.data;
};


// ========================================
// UPDATE PARKING SESSION
// ========================================
export const updateParkingSession = async (
  id,
  sessionData
) => {
  const response = await axiosInstance.patch(
    `/parking-sessions/${id}`,
    sessionData
  );

  return response.data;
};


// ========================================
// GET ACTIVE SESSION BY STUDENT
// ========================================
export const getActiveParkingSession = async (
  studentId
) => {
  const response = await axiosInstance.get(
    `/parking-sessions/active/${studentId}`
  );

  return response.data;
};


// ========================================
// DELETE PARKING SESSION
// ========================================
// ========================================
// DELETE PARKING SESSION
// ========================================

export const deleteParkingSession = async (
  id
) => {
  const response =
    await axiosInstance.delete(
      `/parking-sessions/${id}`
    );

  return response.data;
};

export const clearParkingSessions = async () => {
  const response =
    await axiosInstance.delete(
      "/parking-sessions/clear"
    );

  return response.data;
};