import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema(
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
    appointmentDate: {
      type: Date,
      required: [true, "Please provide appointment date"],
    },
    appointmentTime: {
      type: String,
      required: [true, "Please provide appointment time"],
    },
    duration: {
      type: Number,
      default: 30,
      required: true,
    },
    reason: {
      type: String,
      required: [true, "Please provide reason for appointment"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "completed", "cancelled", "no-show"],
      default: "scheduled",
    },
    notes: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
appointmentSchema.index({ doctor: 1, appointmentDate: 1, appointmentTime: 1 })

const Appointment = mongoose.model("Appointment", appointmentSchema)

export default Appointment
