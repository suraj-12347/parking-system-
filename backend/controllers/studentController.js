import StudentModel from "../models/studentModel.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import multer from "multer";
import path from "path";
import fs from "fs";

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await StudentModel.getAll();

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get single student
export const getStudent = async (req, res) => {
  try {
    const { enrollment } = req.params;

    const student = await StudentModel.getByEnrollment(enrollment);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Create student







// ========================================
// MULTER CONFIG
// ========================================







export const createStudent = async (req, res) => {
  try {
    console.log("========== CREATE STUDENT ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    // ================================
    // GET STUDENT DATA
    // ================================

    const {
      enrollment,
      name,
      course,
      department,
      vehicle,
      vehicle_type,
    } = req.body;

    // ================================
    // VALIDATION
    // ================================

    if (
      !enrollment ||
      !name ||
      !course ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enrollment, name, course and department are required",
      });
    }

    // ================================
    // STUDENT PHOTO
    // ================================

    const photoPath = req.file
      ? req.file.path.replace(/\\/g, "/")
      : null;

    console.log("PHOTO PATH:", photoPath);

    // ================================
    // PARSE SUBSCRIPTION
    // ================================

    let subscription = {};

    try {
      if (req.body.subscription) {
        subscription =
          typeof req.body.subscription === "string"
            ? JSON.parse(req.body.subscription)
            : req.body.subscription;
      }
    } catch (error) {
      console.error(
        "SUBSCRIPTION PARSE ERROR:",
        error
      );

      return res.status(400).json({
        success: false,
        message: "Invalid subscription data",
      });
    }

    const subscriptionActive =
      subscription.active === true ||
      subscription.active === "true";

    const validFrom =
      subscription.validFrom || null;

    const validTill =
      subscription.validTill || null;

    console.log(
      "SUBSCRIPTION:",
      subscription
    );

    // ================================
    // QR DIRECTORY
    // ================================

    const qrDir = "uploads/qr";

    if (!fs.existsSync(qrDir)) {
      fs.mkdirSync(qrDir, {
        recursive: true,
      });
    }

    // ================================
    // GENERATE QR
    // ================================

    const qrPath =
      `${qrDir}/${enrollment}.png`;

    await QRCode.toFile(
      qrPath,
      enrollment
    );

    console.log(
      "QR CREATED:",
      qrPath
    );

    // ================================
    // STUDENT OBJECT
    // ================================

    const student = {
      enrollment:
        enrollment.trim().toUpperCase(),

      name:
        name.trim(),

      photo:
        photoPath,

      course,

      department:
        department.trim(),

      vehicle:
        vehicle
          ? vehicle.trim().toUpperCase()
          : null,

      vehicle_type:
        vehicle_type || null,

      // New student defaults
      active: true,

      blacklisted: false,

      subscription: {
        active:
          subscriptionActive,

        validFrom,

        validTill,
      },

      qr_code:
        qrPath,
    };

    console.log(
      "FINAL STUDENT:",
      student
    );

    // ================================
    // SAVE TO MYSQL
    // ================================

    await StudentModel.create(
      student
    );

    // ================================
    // SUCCESS
    // ================================

    return res.status(201).json({
      success: true,
      message:
        "Student created successfully",
      student,
    });

  } catch (error) {

    console.error(
      "CREATE STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create student",
    });
  }
};




// Update subscription
export const updateSubscription = async (req, res) => {
  try {
    const { enrollment } = req.params;

    await StudentModel.updateSubscription(
      enrollment,
      req.body.subscription
    );

    res.json({
      success: true,
      message: "Subscription updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update active / blacklist
export const updateStatus = async (req, res) => {
  try {
    const { enrollment } = req.params;
    const { active, blacklisted } = req.body;

    await StudentModel.updateStatus(
      enrollment,
      active,
      blacklisted
    );

    res.json({
      success: true,
      message: "Student status updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const { enrollment } = req.params;

    await StudentModel.delete(enrollment);

    res.json({
      success: true,
      message: "Student deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ========================================
// BLACKLIST / REMOVE BLACKLIST STUDENT
// ========================================

// ========================================
// UPDATE ACTIVE STATUS
// ========================================

export const updateActive = async (req, res) => {
  try {
    const { enrollment } = req.params;
    const { active } = req.body;

    // Validate value
    if (
      active !== true &&
      active !== false &&
      active !== 0 &&
      active !== 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid active status",
      });
    }

    // Check student
    const student =
      await StudentModel.getByEnrollment(
        enrollment
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Convert to MySQL boolean value
    const activeStatus =
      active === true ||
      active === 1
        ? 1
        : 0;

    // Update ONLY active
    await StudentModel.updateActive(
      enrollment,
      activeStatus
    );

    return res.status(200).json({
      success: true,
      message: activeStatus
        ? "Student activated successfully"
        : "Student deactivated successfully",
      active: Boolean(activeStatus),
    });

  } catch (error) {
    console.error(
      "UPDATE ACTIVE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update active status",
    });
  }
};


// ========================================
// UPDATE BLACKLIST STATUS
// ========================================

export const updateBlacklist = async (
  req,
  res
) => {
  try {
    const { enrollment } = req.params;
    const { blacklisted } = req.body;

    // Validate value
    if (
      blacklisted !== true &&
      blacklisted !== false &&
      blacklisted !== 0 &&
      blacklisted !== 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid blacklist status",
      });
    }

    // Check student
    const student =
      await StudentModel.getByEnrollment(
        enrollment
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Convert to MySQL boolean value
    const blacklistStatus =
      blacklisted === true ||
      blacklisted === 1
        ? 1
        : 0;

    // Update ONLY blacklist
    await StudentModel.updateBlacklist(
      enrollment,
      blacklistStatus
    );

    return res.status(200).json({
      success: true,
      message: blacklistStatus
        ? "Student blacklisted successfully"
        : "Student removed from blacklist",
      blacklisted:
        Boolean(blacklistStatus),
    });

  } catch (error) {
    console.error(
      "UPDATE BLACKLIST ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update blacklist status",
    });
  }
};

