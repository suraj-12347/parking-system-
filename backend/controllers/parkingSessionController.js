import ParkingSessionModel from "../models/parkingSessionModel.js";


// ==========================================
// GET ALL SESSIONS
// ==========================================

export const getParkingSessions = async (
  req,
  res
) => {

  try {

    const sessions =
      await ParkingSessionModel.getAll();

    return res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });

  } catch (error) {

    console.error(
      "GET PARKING SESSIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch parking sessions",
    });
  }
};


// ==========================================
// GET SINGLE SESSION
// ==========================================

export const getParkingSession = async (
  req,
  res
) => {

  try {

    const { id } = req.params;

    const session =
      await ParkingSessionModel.getById(id);

    if (!session) {

      return res.status(404).json({
        success: false,
        message:
          "Parking session not found",
      });
    }

    return res.status(200).json({
      success: true,
      session,
    });

  } catch (error) {

    console.error(
      "GET PARKING SESSION ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch parking session",
    });
  }
};


// ==========================================
// GET ACTIVE SESSION BY STUDENT
// ==========================================

export const getActiveParkingSession =
  async (req, res) => {

    try {

      const { studentId } =
        req.params;

      const session =
        await ParkingSessionModel
          .getActiveByStudent(
            studentId
          );

      if (!session) {

        return res.status(404).json({
          success: false,
          message:
            "No active parking session",
        });
      }

      return res.status(200).json({
        success: true,
        session,
      });

    } catch (error) {

      console.error(
        "GET ACTIVE SESSION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to fetch active session",
      });
    }
  };


// ==========================================
// CREATE SESSION
// ==========================================

export const createParkingSession =
  async (req, res) => {

    try {

      console.log(
        "CREATE PARKING SESSION:",
        req.body
      );

      const {
        id,
        studentId,
        studentName,
        vehicleNumber,
        vehicle_type,
        department,
        entryTime,
        exitTime,
        status,
        parkingSlot,
        verifiedBy,
        paymentStatus,
        createdAt,
        completedDate,
      } = req.body;


      // ========================================
      // VALIDATION
      // ========================================

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


      // ========================================
      // CHECK EXISTING ACTIVE SESSION
      // ========================================

      const existingSession =
        await ParkingSessionModel
          .getActiveByStudent(
            studentId
          );

      if (existingSession) {

        return res.status(409).json({
          success: false,
          message:
            "Student already has an active parking session",
          session: existingSession,
        });
      }


      // ========================================
      // CREATE
      // ========================================

      await ParkingSessionModel.create({
        id,
        studentId,
        studentName,
        vehicleNumber,
        vehicle_type,
        department,
        entryTime,
        exitTime,
        status,
        parkingSlot,
        verifiedBy,
        paymentStatus,
        createdAt,
        completedDate,
      });


      // ========================================
      // GET CREATED SESSION
      // ========================================

      const session =
        await ParkingSessionModel.getById(
          id
        );


      return res.status(201).json({
        success: true,
        message:
          "Parking session created successfully",
        session,
      });

    } catch (error) {

      console.error(
        "CREATE PARKING SESSION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to create parking session",
      });
    }
  };


// ==========================================
// UPDATE SESSION
// ==========================================

export const updateParkingSession =
  async (req, res) => {

    try {

      const { id } = req.params;

      const existingSession =
        await ParkingSessionModel
          .getById(id);

      if (!existingSession) {

        return res.status(404).json({
          success: false,
          message:
            "Parking session not found",
        });
      }


      await ParkingSessionModel.update(
        id,
        req.body
      );


      const updatedSession =
        await ParkingSessionModel.getById(
          id
        );


      return res.status(200).json({
        success: true,
        message:
          "Parking session updated successfully",
        session: updatedSession,
      });

    } catch (error) {

      console.error(
        "UPDATE PARKING SESSION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to update parking session",
      });
    }
  };


// ==========================================
// DELETE SESSION
// ==========================================

export const deleteParkingSession =
  async (req, res) => {

    try {

      const { id } = req.params;

      const existingSession =
        await ParkingSessionModel.getById(
          id
        );

      if (!existingSession) {

        return res.status(404).json({
          success: false,
          message:
            "Parking session not found",
        });
      }


      await ParkingSessionModel.delete(id);


      return res.status(200).json({
        success: true,
        message:
          "Parking session deleted successfully",
      });

    } catch (error) {

      console.error(
        "DELETE PARKING SESSION ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Failed to delete parking session",
      });
    }
  };


  // ==========================================
// CLEAR PARKING SESSIONS
// ==========================================
export const clearParkingSessions = async (
  req,
  res
) => {
  try {
    const result =
      await ParkingSessionModel.deleteAll();

    res.status(200).json({
      success: true,
      message:
        "Parking sessions cleared successfully",
      deletedCount:
        result.affectedRows,
    });

  } catch (error) {
    console.error(
      "CLEAR PARKING SESSIONS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to clear parking sessions",
    });
  }
}; 
