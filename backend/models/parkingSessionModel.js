import pool from "../config/db.js";

class ParkingSessionModel {
  // ==========================================
  // GET ALL SESSIONS
  // ==========================================

  static async getAll() {
    const [rows] = await pool.query(`
      SELECT
        id,
        student_id,
        student_name,
        vehicle_number,
        vehicle_type,
        department,
        entry_time,
        exit_time,
        status,
        parking_slot,
        verified_by,
        payment_status,
        created_at,
        completed_date
      FROM parking_sessions
      ORDER BY created_at DESC
    `);

    return rows;
  }

  // ==========================================
  // GET SINGLE SESSION
  // ==========================================

  static async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        student_id,
        student_name,
        vehicle_number,
        vehicle_type,
        department,
        entry_time,
        exit_time,
        status,
        parking_slot,
        verified_by,
        payment_status,
        created_at,
        completed_date
      FROM parking_sessions
      WHERE id = ?
      `,
      [id]
    );

    return rows[0] || null;
  }

  // ==========================================
  // GET ACTIVE SESSION BY STUDENT
  // ==========================================

  static async getActiveByStudent(studentId) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        student_id,
        student_name,
        vehicle_number,
        vehicle_type,
        department,
        entry_time,
        exit_time,
        status,
        parking_slot,
        verified_by,
        payment_status,
        created_at,
        completed_date
      FROM parking_sessions
      WHERE student_id = ?
        AND status = 'inside'
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [studentId]
    );

    return rows[0] || null;
  }

  // ==========================================
  // CREATE SESSION
  // ==========================================

  static async create(session) {
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
    } = session;

    const [result] = await pool.query(
      `
      INSERT INTO parking_sessions
      (
        id,
        student_id,
        student_name,
        vehicle_number,
        vehicle_type,
        department,
        entry_time,
        exit_time,
        status,
        parking_slot,
        verified_by,
        payment_status,
        created_at,
        completed_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        studentId,
        studentName,
        vehicleNumber || null,
        vehicle_type || null,
        department || null,

        // ENTRY TIME
        entryTime || null,

        // EXIT TIME
        exitTime || null,

        // STATUS
        status || "inside",

        // PARKING SLOT
        parkingSlot || null,

        // VERIFIED BY
        verifiedBy || "Watchman",

        // PAYMENT
        paymentStatus || "active",

        // CREATED AT
        createdAt || new Date(),

        // COMPLETED DATE
        completedDate || null,
      ]
    );

    return result;
  }

  // ==========================================
  // UPDATE SESSION
  // Used when student exits
  // ==========================================

  static async update(id, session) {
    const {
      exitTime,
      status,
      completedDate,
    } = session;

    const [result] = await pool.query(
      `
      UPDATE parking_sessions
      SET
        exit_time = ?,
        status = ?,
        completed_date = ?
      WHERE id = ?
      `,
      [
        exitTime || null,
        status || "completed",
        completedDate || null,
        id,
      ]
    );

    return result;
  }

  // ==========================================
  // DELETE SINGLE SESSION
  // ==========================================

  static async delete(id) {
    const [result] = await pool.query(
      `
      DELETE FROM parking_sessions
      WHERE id = ?
      `,
      [id]
    );

    return result;
  }

  // ==========================================
  // DELETE ALL PARKING SESSIONS
  // Used by midnight cleanup
  // ==========================================

  static async deleteAll() {
    const [result] = await pool.query(
      `
      DELETE FROM parking_sessions
      `
    );

    return result;
  }
}

export default ParkingSessionModel;