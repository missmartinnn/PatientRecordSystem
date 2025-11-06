import express from "express"
import {
  createPatient,
  getPatients,
  getPatient,
  updatePatient,
  deletePatient,
} from "../controllers/patientController.js"
import { protect } from "../middleware/auth.js"
import { patientValidation, updatePatientValidation, idValidation, validate } from "../middleware/validator.js"

const router = express.Router()

router.use(protect)

router.route("/").post(patientValidation, validate, createPatient).get(getPatients)

router
  .route("/:id")
  .get(idValidation, validate, getPatient)
  .put(idValidation, updatePatientValidation, validate, updatePatient)
  .delete(idValidation, validate, deletePatient)

export default router
