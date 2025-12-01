import User from "../models/User.js";
import { hashPassword, checkPassword } from "../utils/auth.js";
import { generateJWT } from "../utils/jwt.js";

// @desc    Register new user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("El usuario ya está registrado");
      return res.status(409).json({ error: error.message });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Usuario creado correctamente",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("Credenciales incorrectas");
      return res.status(404).json({ error: error.message });
    }

    const isPasswordValid = await checkPassword(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Credenciales incorrectas");
      return res.status(401).json({ error: error.message });
    }

    const token = generateJWT({ id: user._id });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al iniciar sesión",
      error: error.message,
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/user
export const getUser = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuario",
      error: error.message,
    });
  }
};
