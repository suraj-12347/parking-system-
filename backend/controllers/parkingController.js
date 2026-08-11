import ParkingLogModel from "../models/ParkingLogModel.js";

// ==========================================
// CREATE PARKING LOG
// ==========================================

export const createParkingLog = async (
  req,
  res
) => {
  try {
    const {
      id,
      studentId,
      studentName,
      vehicleNumber,
      vehicle_type,
      department,
      parkingSlot,
      entryTime,
      exitTime,
      status,
      paymentStatus,
      verifiedBy,
      completedDate,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (
      !id ||
      !studentId ||
      !studentName
    ) {
      return res.status(400).json({
        success: false,
        message:
          "id, studentId and studentName are required",
      });
    }

    // ======================================
    // CREATE LOG
    // ======================================

    const log = {
      id,
      studentId,
      studentName,
      vehicleNumber,
      vehicle_type,
      department,
      parkingSlot,

      entryTime: entryTime
        ? new Date(entryTime)
        : null,

      exitTime: exitTime
        ? new Date(exitTime)
        : null,

      status:
        status || "completed",

      paymentStatus:
        paymentStatus || "active",

      verifiedBy:
        verifiedBy || "Watchman",

      completedDate:
        completedDate
          ? new Date(completedDate)
          : null,
    };

    await ParkingLogModel.create(log);

    // ======================================
    // GET CREATED LOG
    // ======================================

    const createdLog =
      await ParkingLogModel.getById(id);

    return res.status(201).json({
      success: true,
      message:
        "Parking log created successfully",
      log: createdLog,
    });

  } catch (error) {
    console.error(
      "CREATE PARKING LOG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create parking log",
    });
  }
};


// ==========================================
// GET ALL PARKING LOGS
// ==========================================

export const getParkingLogs = async (
  req,
  res
) => {
  try {
    const logs =
      await ParkingLogModel.getAll();

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });

  } catch (error) {
    console.error(
      "GET PARKING LOGS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch parking logs",
    });
  }
};


// ==========================================
// GET SINGLE PARKING LOG
// ==========================================

export const getParkingLog = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const log =
      await ParkingLogModel.getById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message:
          "Parking log not found",
      });
    }

    return res.status(200).json({
      success: true,
      log,
    });

  } catch (error) {
    console.error(
      "GET PARKING LOG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch parking log",
    });
  }
};


// ==========================================
// GET LOGS BY STUDENT
// ==========================================

export const getStudentParkingLogs =
  async (req, res) => {
    try {
      const { studentId } =
        req.params;

      const logs =
        await ParkingLogModel.getByStudent(
          studentId
        );

      return res.status(200).json({
        success: true,
        count: logs.length,
        logs,
      });

    } catch (error) {
      console.error(
        "GET STUDENT PARKING LOGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch student parking logs",
      });
    }
  };


// ==========================================
// DELETE PARKING LOG
// ==========================================

export const deleteParkingLog = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const log =
      await ParkingLogModel.getById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        message:
          "Parking log not found",
      });
    }

    await ParkingLogModel.delete(id);

    return res.status(200).json({
      success: true,
      message:
        "Parking log deleted successfully",
    });

  } catch (error) {
    console.error(
      "DELETE PARKING LOG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete parking log",
    });
  }
};


// ==========================================
// UPDATE PARKING LOG
// ==========================================

export const updateParkingLog = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const existingLog =
      await ParkingLogModel.getById(id);

    if (!existingLog) {
      return res.status(404).json({
        success: false,
        message: "Parking log not found",
      });
    }

    await ParkingLogModel.update(
      id,
      req.body
    );

    const updatedLog =
      await ParkingLogModel.getById(id);

    return res.status(200).json({
      success: true,
      message:
        "Parking log updated successfully",
      log: updatedLog,
    });

  } catch (error) {
    console.error(
      "UPDATE PARKING LOG ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update parking log",
    });
  }
};