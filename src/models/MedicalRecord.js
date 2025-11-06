import mongoose from "mongoose"

const medicalRecordSchema = new mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: [true, "Please provide patient ID"],
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: [true, "Please provide doctor ID"],
    },
    visitDate: {
      type: Date,
      required: [true, "Please provide visit date"],
      default: Date.now,
    },
    chiefComplaint: {
      type: String,
      required: [true, "Please provide chief complaint"],
      trim: true,
    },
    diagnosis: {
      type: String,
      required: [true, "Please provide diagnosis"],
      trim: true,
    },
    symptoms: [String],
    vitalSigns: {
      bloodPressure: String,
      heartRate: Number,
      temperature: Number,
      respiratoryRate: Number,
      oxygenSaturation: Number,
      weight: Number,
      height: Number,
    },
    prescriptions: [
      {
        medication: {
          type: String,
          required: true,
        },
        dosage: {
          type: String,
          required: true,
        },
        frequency: {
          type: String,
          required: true,
        },
        duration: String,
        instructions: String,
      },
    ],
    labTests: [
      {
        testName: String,
        result: String,
        date: Date,
      },
    ],
    notes: String,
    followUpDate: Date,
  },
  {
    timestamps: true,
  },
)

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema)

export default MedicalRecord
