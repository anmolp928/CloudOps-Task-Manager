const pool = require("../config/db");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const validator = require("validator");



// ================= SIGNUP =================

const signup = async (req, res) => {

  try {

    const { username, email, password } = req.body;


    // Validation
    if (!username || !email || !password) {

      return res.status(400).json({
        message: "All fields are required",
      });

    }


    // Email validation
    if (!validator.isEmail(email)) {

      return res.status(400).json({
        message: "Invalid email format",
      });

    }


    // Password validation
    if (password.length < 6) {

      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });

    }


    // Check existing user
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );


    if (existingUser.rows.length > 0) {

      return res.status(400).json({
        message: "User already exists",
      });

    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Insert new user
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email`,
      [username, email, hashedPassword]
    );


    res.status(201).json({
      message: "User registered successfully",
      user: newUser.rows[0],
    });

  } catch (error) {

    console.log("SIGNUP ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// ================= LOGIN =================

const login = async (req, res) => {

  try {

    const { email, password } = req.body;


    // Validation
    if (!email || !password) {

      return res.status(400).json({
        message: "Email and password required",
      });

    }


    // Find user
    const userResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );


    if (userResult.rows.length === 0) {

      return res.status(400).json({
        message: "Invalid credentials",
      });

    }


    const user = userResult.rows[0];


    // Compare password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );


    if (!validPassword) {

      return res.status(400).json({
        message: "Invalid credentials",
      });

    }


    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );


    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });

  } catch (error) {

    console.log("LOGIN ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



// ================= PROFILE =================

const profile = async (req, res) => {

  try {

    const user = await pool.query(
      "SELECT id, username, email FROM users WHERE id = $1",
      [req.user.id]
    );


    res.status(200).json(user.rows[0]);

  } catch (error) {

    console.log("PROFILE ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });

  }
};



module.exports = {
  signup,
  login,
  profile,
};