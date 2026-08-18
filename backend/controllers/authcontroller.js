import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import StudentModel from "../models/studentModel.js";

// ========================================
// STUDENT LOGIN
// ========================================

export const studentLogin = async (req, res) => {
  try {
    const {
      enrollment,
      password,
    } = req.body;

    // ========================================
    // VALIDATION
    // ========================================

    if (
      !enrollment ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Enrollment and password are required",
      });
    }

    // ========================================
    // NORMALIZE ENROLLMENT
    // Case insensitive
    // ========================================

    const cleanEnrollment =
      enrollment
        .trim()
        .toUpperCase();

    // ========================================
    // FIND STUDENT
    // ========================================

    const student =
      await StudentModel.getByEnrollment(
        cleanEnrollment
      );

    if (!student) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid enrollment or password",
      });
    }

    // ========================================
    // CHECK PASSWORD
    // ========================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid enrollment or password",
      });
    }

    // ========================================
    // CHECK ACTIVE STATUS
    // ========================================

    if (
      Number(student.active) !== 1
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is inactive",
      });
    }

    // ========================================
    // GENERATE JWT
    // ========================================

    const token =
      jwt.sign(
        {
          enrollment:
            student.enrollment,

          role: "student",
        },

        process.env.JWT_SECRET,

        {
          expiresIn: "7d",
        }
      );

    // ========================================
    // SUCCESS
    // ========================================

    return res.status(200).json({
      success: true,

      message:
        "Login successful",

      token,

      student: {
        enrollment:
          student.enrollment,

        name:
          student.name,

        course:
          student.course,

        department:
          student.department,

        vehicle:
          student.vehicle,

        vehicle_type:
          student.vehicle_type,

        photo:
          student.photo,

        active:
          student.active,

        blacklisted:
          student.blacklisted,

        subscription_active:
          student.subscription_active,

        subscription_valid_from:
          student.subscription_valid_from,

        subscription_valid_till:
          student.subscription_valid_till,
      },
    });

  } catch (error) {

    console.error(
      "STUDENT LOGIN ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to login",
    });
  }
};