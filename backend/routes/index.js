const express = require("express");
const pool = require("../server/db");

const app = express();
const PORT = 5000;

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// Test route to get data from a table
app.get("/tabledata", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todoapp");
    console.log("/tabledata endpoint result:", result.rows); // Log the table contents
    res.json(result.rows);
  } catch (err) {
    console.error("/tabledata endpoint error:", err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
