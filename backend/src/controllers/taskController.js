const pool = require("../config/db");



// ================= CREATE TASK =================

const createTask = async (req, res) => {

  try {

    const userId = req.user.id;

    const {
      title,
      description,
      priority,
      due_date,
    } = req.body;


    if (!title) {

      return res.status(400).json({
        message: "Task title is required",
      });

    }


    const newTask = await pool.query(
      `
      INSERT INTO tasks
      (user_id, title, description, priority, due_date)

      VALUES ($1, $2, $3, $4, $5)

      RETURNING *
      `,
      [
        userId,
        title,
        description || "",
        priority || "Medium",
        due_date || null,
      ]
    );


    res.status(201).json({
      message: "Task created successfully",
      task: newTask.rows[0],
    });

  } catch (error) {

    console.log("CREATE TASK ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// ================= GET ALL TASKS =================

const getTasks = async (req, res) => {

  try {

    const userId = req.user.id;

    // Query params
    const {
      search,
      priority,
      completed,
      sortBy,
      order,
      page = 1,
      limit = 5,
    } = req.query;


    let query = `
      SELECT *
      FROM tasks
      WHERE user_id = $1
    `;

    let values = [userId];

    let index = 2;


    // Search by title
    if (search) {

      query += ` AND title ILIKE $${index}`;

      values.push(`%${search}%`);

      index++;
    }


    // Filter by priority
    if (priority) {

      query += ` AND priority = $${index}`;

      values.push(priority);

      index++;
    }


    // Filter by completed status
    if (completed !== undefined) {

      query += ` AND completed = $${index}`;

      values.push(completed === "true");

      index++;
    }


    // Sorting
    const allowedSortFields = [
      "created_at",
      "due_date",
      "priority",
    ];

    const sortField = allowedSortFields.includes(sortBy)
      ? sortBy
      : "created_at";

    const sortOrder =
      order === "asc" ? "ASC" : "DESC";

    query += `
      ORDER BY ${sortField} ${sortOrder}
    `;


    // Pagination
    const offset = (page - 1) * limit;

    query += `
      LIMIT $${index}
      OFFSET $${index + 1}
    `;

    values.push(limit);
    values.push(offset);


    const tasks = await pool.query(
      query,
      values
    );


    res.status(200).json({
      total: tasks.rows.length,
      page: Number(page),
      tasks: tasks.rows,
    });

  } catch (error) {

    console.log("GET TASKS ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// ================= GET SINGLE TASK =================

const getSingleTask = async (req, res) => {

  try {

    const userId = req.user.id;

    const { id } = req.params;

    const task = await pool.query(
      `
      SELECT *
      FROM tasks
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );


    if (task.rows.length === 0) {

      return res.status(404).json({
        message: "Task not found",
      });

    }


    res.status(200).json(task.rows[0]);

  } catch (error) {

    console.log("GET SINGLE TASK ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// ================= UPDATE TASK =================

const updateTask = async (req, res) => {

  try {

    const userId = req.user.id;

    const { id } = req.params;

    const {
      title,
      description,
      priority,
      due_date,
      completed,
    } = req.body;


    const updatedTask = await pool.query(
      `
      UPDATE tasks
      SET
        title = $1,
        description = $2,
        priority = $3,
        due_date = $4,
        completed = $5

      WHERE id = $6
      AND user_id = $7

      RETURNING *
      `,
      [
        title,
        description,
        priority,
        due_date,
        completed,
        id,
        userId,
      ]
    );


    if (updatedTask.rows.length === 0) {

      return res.status(404).json({
        message: "Task not found",
      });

    }


    res.status(200).json({
      message: "Task updated successfully",
      task: updatedTask.rows[0],
    });

  } catch (error) {

    console.log("UPDATE TASK ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// ================= DELETE TASK =================

const deleteTask = async (req, res) => {

  try {

    const userId = req.user.id;

    const { id } = req.params;

    const deletedTask = await pool.query(
      `
      DELETE FROM tasks
      WHERE id = $1
      AND user_id = $2

      RETURNING *
      `,
      [id, userId]
    );


    if (deletedTask.rows.length === 0) {

      return res.status(404).json({
        message: "Task not found",
      });

    }


    res.status(200).json({
      message: "Task deleted successfully",
    });

  } catch (error) {

    console.log("DELETE TASK ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



module.exports = {
  createTask,
  getTasks,
  getSingleTask,
  updateTask,
  deleteTask,
};