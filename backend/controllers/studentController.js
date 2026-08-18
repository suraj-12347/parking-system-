import StudentModel from "../models/studentModel.js";
import { nanoid } from "nanoid";
import QRCode from "qrcode";
import multer from "multer";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ========================================
// GET ALL STUDENTS
// ========================================

export const getStudents = async (req, res) => {
  try {
    const students = await StudentModel.getAll();

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("GET STUDENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// GET SINGLE STUDENT
// ========================================

export const getStudent = async (req, res) => {
  try {
    const { enrollment } = req.params;

    const student =
      await StudentModel.getByEnrollment(enrollment);

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
    console.error("GET STUDENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// CREATE STUDENT
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
      password,
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
      !password ||
      !course ||
      !department
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enrollment, name, password, course and department are required",
      });
    }

    // Password minimum length
    if (password.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // ================================
    // CHECK DUPLICATE ENROLLMENT
    // ================================

    const existingStudent =
      await StudentModel.getByEnrollment(
        enrollment.trim().toUpperCase()
      );

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message:
          "Student with this enrollment already exists",
      });
    }

    // ================================
    // HASH PASSWORD
    // ================================

    const hashedPassword =
      await bcrypt.hash(password.trim(), 10);

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

    const cleanEnrollment =
      enrollment.trim().toUpperCase();

    const qrPath =
      `${qrDir}/${cleanEnrollment}.png`;

    await QRCode.toFile(
      qrPath,
      cleanEnrollment
    );

    console.log(
      "QR CREATED:",
      qrPath
    );

    // ================================
    // STUDENT OBJECT
    // ================================

    const student = {
      enrollment: cleanEnrollment,

      name: name.trim(),

      // Hashed password
      password: hashedPassword,

      photo: photoPath,

      course,

      department:
        department.trim(),

      vehicle: vehicle
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

      qr_code: qrPath,
    };

    console.log(
      "FINAL STUDENT:",
      {
        ...student,
        password: "[HIDDEN]",
      }
    );

    // ================================
    // SAVE TO MYSQL
    // ================================

    await StudentModel.create(student);

    // ================================
    // SUCCESS RESPONSE
    // ================================

    return res.status(201).json({
      success: true,
      message:
        "Student created successfully",

      student: {
        enrollment:
          student.enrollment,

        name:
          student.name,

        photo:
          student.photo,

        course:
          student.course,

        department:
          student.department,

        vehicle:
          student.vehicle,

        vehicle_type:
          student.vehicle_type,

        active:
          student.active,

        blacklisted:
          student.blacklisted,

        subscription:
          student.subscription,

        qr_code:
          student.qr_code,
      },
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

// ========================================
// UPDATE SUBSCRIPTION
// ========================================

export const updateSubscription = async (
  req,
  res
) => {
  try {
    const { enrollment } = req.params;

    await StudentModel.updateSubscription(
      enrollment,
      req.body.subscription
    );

    res.json({
      success: true,
      message:
        "Subscription updated",
    });
  } catch (error) {
    console.error(
      "UPDATE SUBSCRIPTION ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE ACTIVE / BLACKLIST
// ========================================

export const updateStatus = async (
  req,
  res
) => {
  try {
    const { enrollment } =
      req.params;

    const {
      active,
      blacklisted,
    } = req.body;

    await StudentModel.updateStatus(
      enrollment,
      active,
      blacklisted
    );

    res.json({
      success: true,
      message:
        "Student status updated",
    });
  } catch (error) {
    console.error(
      "UPDATE STATUS ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// DELETE STUDENT
// ========================================

export const deleteStudent = async (
  req,
  res
) => {
  try {
    const { enrollment } =
      req.params;

    await StudentModel.delete(
      enrollment
    );

    res.json({
      success: true,
      message:
        "Student deleted",
    });
  } catch (error) {
    console.error(
      "DELETE STUDENT ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ========================================
// UPDATE ACTIVE STATUS
// ========================================

export const updateActive = async (
  req,
  res
) => {
  try {
    const { enrollment } =
      req.params;

    const { active } =
      req.body;

    // Validate value
    if (
      active !== true &&
      active !== false &&
      active !== 0 &&
      active !== 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid active status",
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
        message:
          "Student not found",
      });
    }

    // Convert to MySQL boolean
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

      active:
        Boolean(activeStatus),
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
    const { enrollment } =
      req.params;

    const { blacklisted } =
      req.body;

    // Validate value
    if (
      blacklisted !== true &&
      blacklisted !== false &&
      blacklisted !== 0 &&
      blacklisted !== 1
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid blacklist status",
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
        message:
          "Student not found",
      });
    }

    // Convert to MySQL boolean
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

// ========================================
// RESET STUDENT PASSWORD
// ========================================

export const resetStudentPassword = async (
  req,
  res
) => {
  try {
    const { enrollment } =
      req.params;

    const { newPassword } =
      req.body;

    // ================================
    // VALIDATION
    // ================================

    if (
      !newPassword ||
      newPassword.trim().length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password must be at least 6 characters",
      });
    }

    // ================================
    // CHECK STUDENT
    // ================================

    const student =
      await StudentModel.getByEnrollment(
        enrollment
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found",
      });
    }

    // ================================
    // HASH NEW PASSWORD
    // ================================

    const hashedPassword =
      await bcrypt.hash(
        newPassword.trim(),
        10
      );

    // ================================
    // UPDATE PASSWORD
    // ================================

    await StudentModel.updatePassword(
      enrollment,
      hashedPassword
    );

    // ================================
    // SUCCESS
    // ================================

    return res.status(200).json({
      success: true,
      message:
        "Student password reset successfully",
    });

  } catch (error) {
    console.error(
      "RESET PASSWORD ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to reset student password",
    });
  }
};



// ========================================
// STUDENT LOGIN
// ========================================

export const studentLogin = async (req, res) => {
  try {
    console.log("========== STUDENT LOGIN ==========");
    console.log("BODY:", req.body);

    const { enrollment, password } = req.body || {};

    if (!enrollment || !password) {
      return res.status(400).json({
        success: false,
        message: "Enrollment and password are required",
      });
    }

    const cleanEnrollment = enrollment
      .trim()
      .toUpperCase();

    console.log("SEARCHING ENROLLMENT:", cleanEnrollment);

    const student =
      await StudentModel.getForLogin(
        cleanEnrollment
      );

    console.log("FOUND STUDENT:", student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Password check
    const passwordMatch =
      await bcrypt.compare(
        password,
        student.password
      );

    console.log(
      "PASSWORD MATCH:",
      passwordMatch
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Active check
    if (Number(student.active) !== 1) {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive",
      });
    }

    // Blacklist check
    if (Number(student.blacklisted) === 1) {
      return res.status(403).json({
        success: false,
        message: "You are blacklisted",
      });
    }

    // JWT
    const token = jwt.sign(
      {
        enrollment: student.enrollment,
        name: student.name,
        role: "student",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: {
        enrollment: student.enrollment,
        name: student.name,
        course: student.course,
        department: student.department,
        photo: student.photo,
        vehicle: student.vehicle,
        vehicle_type: student.vehicle_type,
        active: Number(student.active) === 1,
        blacklisted:
          Number(student.blacklisted) === 1,
        subscription: {
          active:
            Number(student.subscription_active) === 1,
          validFrom:
            student.subscription_valid_from,
          validTill:
            student.subscription_valid_till,
        },
      },
    });

  } catch (error) {
    console.error(
      "STUDENT LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// ==========================================
// GET LOGGED-IN STUDENT
// ==========================================
export const getLoggedInStudent = async (req, res) => {
  try {
    console.log("STUDENT TOKEN DATA:", req.user);

    const enrollment = req.user?.enrollment;

    if (!enrollment) {
      return res.status(401).json({
        success: false,
        message: "Invalid student token",
      });
    }

    const student =
      await StudentModel.getByEnrollment(enrollment);

    console.log("STUDENT FROM DB:", student);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Password frontend ko mat bhejo
    delete student.password;

    return res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {
    console.error(
      "GET LOGGED-IN STUDENT ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get student",
    });
  }
};