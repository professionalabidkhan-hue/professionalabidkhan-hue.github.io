import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Root route (homepage)
app.get("/", (req, res) => {
  res.send("✅ Backend is running. Use /api/signup to submit data.");
});

// ✅ API ROUTE: SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const {
      full_name,
      email,
      whatsapp,
      password,
      role,
      department,
      timing,
      qualification,
      experience,
      expected_revenue,
      proposed_fee
    } = req.body;

    const sql = `
      INSERT INTO users 
      (full_name, email, whatsapp, password, role, department, timing, qualification, experience, expected_revenue, proposed_fee)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.execute(sql, [
      full_name,
      email,
      whatsapp,
      password,
      role,
      department,
      timing,
      qualification,
      experience,
      expected_revenue,
      proposed_fee
    ]);

    res.json({ success: true });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
