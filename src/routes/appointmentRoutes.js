import express from "express"
import {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
  getDoctorSchedule,
} from "../controllers/appointmentController.js"
import { protect } from "../middleware/auth.js"
import { appointmentValidation, idValidation, validate } from "../middleware/validator.js"

const router = express.Router()

router.use(protect)

router.route("/").post(appointmentValidation, validate, createAppointment).get(getAppointments)

router.get("/doctor/:doctorId/schedule", idValidation, validate, getDoctorSchedule)

router
  .route("/:id")
  .get(idValidation, validate, getAppointment)
  .put(idValidation, validate, updateAppointment)
  .delete(idValidation, validate, deleteAppointment)

export default router
