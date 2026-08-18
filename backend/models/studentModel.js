import pool from "../config/db.js";


class StudentModel {
  // ==========================================
  // GET ALL STUDENTS
  // ==========================================
  static async getAll() {
    const [rows] = await pool.query(
      `SELECT *
       FROM students
       ORDER BY created_at DESC`
    );

    return rows;
  }

  // ==========================================
  // GET STUDENT BY ENROLLMENT
  // ==========================================
  static async getByEnrollment(enrollment) {
    const [rows] = await pool.query(
      `SELECT *
       FROM students
       WHERE enrollment = ?`,
      [enrollment]
    );

    return rows[0];
  }

  // ==========================================
  // GET STUDENT BY VEHICLE
  // ==========================================
  static async getByVehicle(vehicle) {
    const [rows] = await pool.query(
      `SELECT *
       FROM students
       WHERE vehicle = ?`,
      [vehicle]
    );

    return rows[0];
  }

  // ==========================================
  // CREATE STUDENT
  // ==========================================
static async create(student) {
  const {
    enrollment,
    name,
    password,
    photo,
    course,
    department,
    vehicle,
    vehicle_type,
    subscription,
    qr_code,
  } = student;

  const [result] = await pool.query(
    `INSERT INTO students 
    (
      enrollment,
      name,
      password,
      photo,
      course,
      department,
      vehicle,
      vehicle_type,
      active,
      blacklisted,
      subscription_active,
      subscription_valid_from,
      subscription_valid_till,
      qr_code
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      enrollment,
      name,
      password,
      photo || null,
      course,
      department,
      vehicle || null,
      vehicle_type || null,

      // Default status
      1,
      0,

      // Subscription
      subscription?.active ? 1 : 0,
      subscription?.validFrom || null,
      subscription?.validTill || null,

      // QR
      qr_code || null,
    ]
  );

  return result;
}

  // ==========================================
  // UPDATE SUBSCRIPTION
  // ==========================================
  static async updateSubscription(
    enrollment,
    subscription
  ) {
    const active =
      subscription?.active === true ||
      subscription?.active === "true" ||
      Number(subscription?.active) === 1
        ? 1
        : 0;

    const validFrom =
      subscription?.validFrom || null;

    const validTill =
      subscription?.validTill || null;

    const [result] = await pool.query(
      `UPDATE students
       SET
         subscription_active = ?,
         subscription_valid_from = ?,
         subscription_valid_till = ?
       WHERE enrollment = ?`,
      [
        active,
        validFrom,
        validTill,
        enrollment,
      ]
    );

    return result;
  }

  // ==========================================
  // UPDATE ACTIVE ONLY
  // ==========================================
  static async updateActive(
    enrollment,
    active
  ) {
    const activeValue =
      active === true ||
      active === "true" ||
      Number(active) === 1
        ? 1
        : 0;

    console.log(
      "UPDATE ACTIVE:",
      {
        enrollment,
        activeValue,
      }
    );

    const [result] = await pool.query(
      `UPDATE students
       SET active = ?
       WHERE enrollment = ?`,
      [
        activeValue,
        enrollment,
      ]
    );

    return result;
  }

  // ==========================================
  // UPDATE BLACKLIST ONLY
  // ==========================================
  static async updateBlacklist(
    enrollment,
    blacklisted
  ) {
    const blacklistedValue =
      blacklisted === true ||
      blacklisted === "true" ||
      Number(blacklisted) === 1
        ? 1
        : 0;

    console.log(
      "UPDATE BLACKLIST:",
      {
        enrollment,
        blacklistedValue,
      }
    );

    const [result] = await pool.query(
      `UPDATE students
       SET blacklisted = ?
       WHERE enrollment = ?`,
      [
        blacklistedValue,
        enrollment,
      ]
    );

    return result;
  }

  // ==========================================
  // DELETE STUDENT
  // ==========================================
  static async delete(enrollment) {
    const [result] = await pool.query(
      `DELETE FROM students
       WHERE enrollment = ?`,
      [enrollment]
    );

    return result;
  }

  // ==========================================
// UPDATE STUDENT PASSWORD
// ==========================================
static async updatePassword(enrollment, hashedPassword) {
  const [result] = await pool.query(
    `UPDATE students
     SET password = ?
     WHERE enrollment = ?`,
    [
      hashedPassword,
      enrollment,
    ]
  );

  return result;
}

// ==========================================
// GET STUDENT FOR LOGIN
// ==========================================
// ==========================================
// GET STUDENT FOR LOGIN
// ==========================================
static async getForLogin(enrollment) {
  const cleanEnrollment = enrollment
    .trim()
    .toUpperCase();

  console.log("LOGIN ENROLLMENT:", cleanEnrollment);

  const [rows] = await pool.query(
    `SELECT *
     FROM students
     WHERE UPPER(TRIM(enrollment)) = UPPER(TRIM(?))
     LIMIT 1`,
    [cleanEnrollment]
  );

  console.log("LOGIN STUDENT:", rows[0]);

  return rows[0];
}

// ==========================================
// GET LOGGED-IN STUDENT BY TOKEN
// ==========================================
static async getByIdForLogin(enrollment) {
  const [rows] = await pool.query(
    `SELECT *
     FROM students
     WHERE LOWER(enrollment) = LOWER(?)`,
    [enrollment]
  );

  return rows[0];
}



}

export default StudentModel;