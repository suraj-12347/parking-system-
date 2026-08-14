import pool from "../config/db.js";

class AdminModel {
  // ==========================================
  // FIND ADMIN BY USERNAME
  // ==========================================
  static async findByUsername(username) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        username,
        password_hash,
        active,
        created_at
      FROM admins
      WHERE username = ?
      LIMIT 1
      `,
      [username]
    );

    return rows[0] || null;
  }

  // ==========================================
  // FIND ADMIN BY ID
  // ==========================================
  static async findById(id) {
    const [rows] = await pool.query(
      `
      SELECT
        id,
        username,
        active,
        created_at
      FROM admins
      WHERE id = ?
      LIMIT 1
      `,
      [id]
    );

    return rows[0] || null;
  }

  // ==========================================
  // CREATE ADMIN
  // ==========================================
  static async create(username, passwordHash) {
    const [result] = await pool.query(
      `
      INSERT INTO admins
      (username, password_hash)
      VALUES (?, ?)
      `,
      [username, passwordHash]
    );

    return {
      id: result.insertId,
      username,
    };
  }
}

export default AdminModel;