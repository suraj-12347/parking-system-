import pool from "../config/db.js";

class ParkingLogModel {

  // ==========================================
  // CREATE PARKING LOG
  // ==========================================

  static async create(log) {
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
    } = log;

    const [result] = await pool.query(
      `
      INSERT INTO parking_logs
      (
        id,
        student_id,
        student_name,
        vehicle_number,
        vehicle_type,
        department,
        parking_slot,
        entry_time,
        exit_time,
        status,
        payment_status,
        verified_by,
        completed_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        id,
        studentId,
        studentName,
        vehicleNumber || null,
        vehicle_type || null,
        department || null,
        parkingSlot || null,
        entryTime || null,
        exitTime || null,
        status || "completed",
        paymentStatus || "active",
        verifiedBy || "Watchman",
        completedDate || null,
      ]
    );

    return result;
  }

  // ==========================================
  // GET ALL PARKING LOGS
  // ==========================================

  static async getAll() {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM parking_logs
      ORDER BY created_at DESC
      `
    );

    return rows;
  }

  // ==========================================
  // GET SINGLE LOG
  // ==========================================

  static async getById(id) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM parking_logs
      WHERE id = ?
      `,
      [id]
    );

    return rows[0];
  }

  // ==========================================
  // GET LOGS BY STUDENT
  // ==========================================

  static async getByStudent(studentId) {
    const [rows] = await pool.query(
      `
      SELECT *
      FROM parking_logs
      WHERE student_id = ?
      ORDER BY created_at DESC
      `,
      [studentId]
    );

    return rows;
  }

  // ==========================================
  // DELETE LOG
  // ==========================================

  static async delete(id) {
    const [result] = await pool.query(
      `
      DELETE FROM parking_logs
      WHERE id = ?
      `,
      [id]
    );

    return result;
  }

  // ==========================================
// UPDATE PARKING LOG
// ==========================================

static async update(id, log) {
  const {
    exitTime,
    status,
    completedDate,
  } = log;

  const [result] = await pool.query(
    `
    UPDATE parking_logs
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
}

export default ParkingLogModel;