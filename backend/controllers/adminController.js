import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminModel from "../models/AdminModel.js";

// ==========================================
// ADMIN LOGIN
// ==========================================
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ========================================
    // VALIDATION
    // ========================================
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // ========================================
    // FIND ADMIN
    // ========================================
    const admin =
      await AdminModel.findByUsername(username);

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // ========================================
    // CHECK ACTIVE
    // ========================================
    if (!admin.active) {
      return res.status(403).json({
        success: false,
        message: "Admin account is disabled",
      });
    }

    // ========================================
    // VERIFY PASSWORD
    // ========================================
    const isPasswordValid =
      await bcrypt.compare(
        password,
        admin.password_hash
      );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // ========================================
    // CREATE JWT
    // ========================================
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "8h",
      }
    );

    // ========================================
    // RESPONSE
    // ========================================
    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==========================================
// GET CURRENT ADMIN
// ==========================================
export const getCurrentAdmin = async (
  req,
  res
) => {
  try {
    const admin =
      await AdminModel.findById(req.admin.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin: {
        id: admin.id,
        username: admin.username,
        role: "admin",
        active: admin.active,
      },
    });
  } catch (error) {
    console.error(
      "Get Current Admin Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};