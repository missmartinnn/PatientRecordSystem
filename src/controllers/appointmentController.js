import Appointment from "../models/Appointment.js"
import Patient from "../models/Patient.js"
import Doctor from "../models/Doctor.js"

// @desc    Create a new appointment
// @route   POST /api/appointments
// @access  Private
export const createAppointment = async (req, res, next) => {
  try {
    // Verify patient exists
    const patient = await Patient.findById(req.body.patient)
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(req.body.doctor)
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      })
    }

    // Check for conflicting appointments
    const conflictingAppointment = await Appointment.findOne({
      doctor: req.body.doctor,
      appointmentDate: req.body.appointmentDate,
      appointmentTime: req.body.appointmentTime,
      status: { $in: ["scheduled", "confirmed"] },
    })

    if (conflictingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked",
      })
    }

    req.body.createdBy = req.user.id
    const appointment = await Appointment.create(req.body)

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "name specialization")
      .populate("createdBy", "name")

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: populatedAppointment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
export const getAppointments = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, patient, doctor, status, date } = req.query

    const query = {}

    if (patient) {
      query.patient = patient
    }

    if (doctor) {
      query.doctor = doctor
    }

    if (status) {
      query.status = status
    }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.appointmentDate = { $gte: startDate, $lt: endDate }
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "name specialization")
      .populate("createdBy", "name")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ appointmentDate: 1, appointmentTime: 1 })

    const count = await Appointment.countDocuments(query)

    res.status(200).json({
      success: true,
      count: appointments.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: appointments,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
export const getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "firstName lastName phone email")
      .populate("doctor", "name specialization phone")
      .populate("createdBy", "name")

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    res.status(200).json({
      success: true,
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
export const updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    // Check for conflicting appointments if time is being changed
    if (req.body.appointmentDate || req.body.appointmentTime) {
      const conflictingAppointment = await Appointment.findOne({
        _id: { $ne: req.params.id },
        doctor: req.body.doctor || appointment.doctor,
        appointmentDate: req.body.appointmentDate || appointment.appointmentDate,
        appointmentTime: req.body.appointmentTime || appointment.appointmentTime,
        status: { $in: ["scheduled", "confirmed"] },
      })

      if (conflictingAppointment) {
        return res.status(400).json({
          success: false,
          message: "This time slot is already booked",
        })
      }
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("patient", "firstName lastName phone")
      .populate("doctor", "name specialization")
      .populate("createdBy", "name")

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
export const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      })
    }

    await Appointment.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Appointment deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get doctor's schedule
// @route   GET /api/appointments/doctor/:doctorId/schedule
// @access  Private
export const getDoctorSchedule = async (req, res, next) => {
  try {
    const { date } = req.query

    const doctor = await Doctor.findById(req.params.doctorId)
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
      })
    }

    const query = { doctor: req.params.doctorId }

    if (date) {
      const startDate = new Date(date)
      const endDate = new Date(date)
      endDate.setDate(endDate.getDate() + 1)
      query.appointmentDate = { $gte: startDate, $lt: endDate }
    }

    const appointments = await Appointment.find(query)
      .populate("patient", "firstName lastName phone")
      .sort({ appointmentDate: 1, appointmentTime: 1 })

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: {
        doctor: {
          id: doctor._id,
          name: doctor.name,
          specialization: doctor.specialization,
        },
        appointments,
      },
    })
  } catch (error) {
    next(error)
  }
}
