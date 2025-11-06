import express from "express"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import { config } from "./config/config.js"
import { errorHandler } from "./middleware/errorHandler.js"

// Import routes
import authRoutes from "./routes/authRoutes.js"
import patientRoutes from "./routes/patientRoutes.js"
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js"
import appointmentRoutes from "./routes/appointmentRoutes.js"

const app = express()

// Security middleware
app.use(helmet())
app.use(cors({ origin: config.corsOrigin }))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, 
  message: "Too many requests from this IP, please try again later.",
})
app.use("/api/", limiter)

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  })
})

// API routes
app.use("/api/auth", authRoutes)
app.use("/api/patients", patientRoutes)
app.use("/api/medical-records", medicalRecordRoutes)
app.use("/api/appointments", appointmentRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handler (must be last)
app.use(errorHandler)

export default app
