import pool from "./db.js";

try {
  const [rows] = await pool.query("SELECT NOW() AS time");
  console.log(rows);
} catch (err) {
  console.error(err);
}