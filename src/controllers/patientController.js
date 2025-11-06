import Patient from "../models/Patient.js"

// @desc    Create a new patient
// @route   POST /api/patients
// @access  Private
export const createPatient = async (req, res, next) => {
  try {
    req.body.registeredBy = req.user.id
    const patient = await Patient.create(req.body)

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: patient,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
export const getPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, isActive } = req.query

    const query = {}

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ]
    }

    if (isActive !== undefined) {
      query.isActive = isActive === "true"
    }

    const patients = await Patient.find(query)
      .populate("registeredBy", "name specialization")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })

    const count = await Patient.countDocuments(query)

    res.status(200).json({
      success: true,
      count: patients.length,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: patients,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get single patient
// @route   GET /api/patients/:id
// @access  Private
export const getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).populate("registeredBy", "name specialization")

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    res.status(200).json({
      success: true,
      data: patient,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
export const updatePatient = async (req, res, next) => {
  try {
    let patient = await Patient.findById(req.params.id)

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    patient = await Patient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: patient,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
export const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id)

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      })
    }

    await Patient.findByIdAndDelete(req.params.id)

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
      data: {},
    })
  } catch (error) {
    next(error)
  }
}
