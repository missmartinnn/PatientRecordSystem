import jwt from "jsonwebtoken"
import Doctor from "../models/Doctor.js"
import { config } from "../config/config.js"

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  })
}

// @desc    Register a new doctor
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, specialization, licenseNumber, phone, role } = req.body

    // Check if doctor already exists
    const doctorExists = await Doctor.findOne({ email })
    if (doctorExists) {
      return res.status(400).json({
        success: false,
        message: "Doctor with this email already exists",
      })
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      email,
      password,
      specialization,
      licenseNumber,
      phone,
      role: role || "doctor",
    })

    const token = generateToken(doctor._id)

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        phone: doctor.phone,
        role: doctor.role,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login doctor
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email }).select("+password")
    if (!doctor) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if password matches
    const isMatch = await doctor.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      })
    }

    // Check if doctor is active
    if (!doctor.isActive) {
      return res.status(401).json({
        success: false,
        message: "Account is inactive",
      })
    }

    const token = generateToken(doctor._id)

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        role: doctor.role,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current logged in doctor
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id)

    res.status(200).json({
      success: true,
      data: doctor,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Logout doctor
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logout successful",
    })
  } catch (error) {
    next(error)
  }
}
