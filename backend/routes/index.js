const express = require("express");
const cors = require("cors");
const pool = require("../server/db");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("API is running");
});

// CRUD Routes for todoapp table

// CREATE - Add a new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todoapp (title, description) VALUES($1, $2) RETURNING *",
      [title, description]
    );
    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error("/todos POST error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// READ - Get all todos
app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todoapp WHERE archived_at IS NULL ORDER BY id");
    console.log("/todos endpoint result:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("/todos endpoint error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// GET ARCHIVED - Get all archived todos (MOVED HERE - BEFORE :id route)
app.get("/todos/archived", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todoapp WHERE archived_at IS NOT NULL ORDER BY archived_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("/todos/archived GET error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// READ - Get a single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM todoapp WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("/todos/:id GET error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// UPDATE - Update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todoapp SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error("/todos/:id PUT error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// COMPLETE - Mark a todo as completed
app.patch("/todos/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const updateTodo = await pool.query(
      "UPDATE todoapp SET completed = true, completed_at = CURRENT_TIMESTAMP WHERE id = $1 AND archived_at IS NULL RETURNING *",
      [id]
    );
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error("/todos/:id/complete PATCH error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// UNCOMPLETE - Mark a todo as not completed
app.patch("/todos/:id/uncomplete", async (req, res) => {
  try {
    const { id } = req.params;
    const updateTodo = await pool.query(
      "UPDATE todoapp SET completed = false, completed_at = NULL WHERE id = $1 AND archived_at IS NULL RETURNING *",
      [id]
    );
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error("/todos/:id/uncomplete PATCH error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// ARCHIVE - Move a todo to archive
app.patch("/todos/:id/archive", async (req, res) => {
  try {
    const { id } = req.params;
    const updateTodo = await pool.query(
      "UPDATE todoapp SET archived_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *",
      [id]
    );
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error("/todos/:id/archive PATCH error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// RESTORE - Restore a todo from archive
app.patch("/todos/:id/restore", async (req, res) => {
  try {
    const { id } = req.params;
    const updateTodo = await pool.query(
      "UPDATE todoapp SET archived_at = NULL WHERE id = $1 RETURNING *",
      [id]
    );
    if (updateTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(updateTodo.rows[0]);
  } catch (err) {
    console.error("/todos/:id/restore PATCH error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// DELETE - Delete a todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todoapp WHERE id = $1 RETURNING *", [id]);
    if (deleteTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  } catch (err) {
    console.error("/todos/:id DELETE error:", err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Keep the old endpoint for backward compatibility
app.get("/tabledata", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todoapp");
    console.log("/tabledata endpoint result:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error("/tabledata endpoint error:", err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
