import { describe, test, expect, beforeEach } from "@jest/globals"
import request from "supertest"
import app from "../app.js"

describe("Medical Record CRUD Tests", () => {
  let token
  let patientId

  beforeEach(async () => {
    // Register doctor
    const doctorRes = await request(app).post("/api/auth/register").send({
      name: "Dr. Test",
      email: "test@hospital.com",
      password: "password123",
      specialization: "General",
      licenseNumber: "LIC999",
      phone: "+1111111111",
    })
    token = doctorRes.body.token

    // Create patient
    const patientRes = await request(app)
      .post("/api/patients")
      .set("Authorization", `Bearer ${token}`)
      .send({
        firstName: "Jane",
        lastName: "Doe",
        dateOfBirth: "1990-05-15",
        gender: "female",
        phone: "+1234567890",
        emergencyContact: {
          name: "John Doe",
          phone: "+0987654321",
        },
      })
    patientId = patientRes.body.data._id
  })

  const recordData = {
    chiefComplaint: "Fever and headache",
    diagnosis: "Viral infection",
    symptoms: ["fever", "headache", "fatigue"],
    vitalSigns: {
      temperature: 38.5,
      bloodPressure: "120/80",
      heartRate: 80,
    },
    prescriptions: [
      {
        medication: "Paracetamol",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "5 days",
      },
    ],
  }

  describe("POST /api/medical-records", () => {
    test("should create a new medical record", async () => {
      const res = await request(app)
        .post("/api/medical-records")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...recordData, patient: patientId })

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("chiefComplaint")
      expect(res.body.data).toHaveProperty("doctor")
    })

    test("should not create record without authentication", async () => {
      const res = await request(app)
        .post("/api/medical-records")
        .send({ ...recordData, patient: patientId })

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
    })

    test("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/medical-records")
        .set("Authorization", `Bearer ${token}`)
        .send({ patient: patientId })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    test("should return 404 for non-existent patient", async () => {
      const fakeId = "507f1f77bcf86cd799439011"
      const res = await request(app)
        .post("/api/medical-records")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...recordData, patient: fakeId })

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe("GET /api/medical-records", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/medical-records")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...recordData, patient: patientId })
    })

    test("should get all medical records", async () => {
      const res = await request(app).get("/api/medical-records").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toBeInstanceOf(Array)
    })

    test("should filter by patient", async () => {
      const res = await request(app)
        .get(`/api/medical-records?patient=${patientId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe("GET /api/medical-records/patient/:patientId/history", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/medical-records")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...recordData, patient: patientId })
    })

    test("should get patient medical history", async () => {
      const res = await request(app)
        .get(`/api/medical-records/patient/${patientId}/history`)
        .set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("patient")
      expect(res.body.data).toHaveProperty("records")
    })
  })

  describe("PUT /api/medical-records/:id", () => {
    let recordId

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/medical-records")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...recordData, patient: patientId })
      recordId = res.body.data._id
    })

    test("should update medical record", async () => {
      const updateData = { notes: "Patient recovering well" }
      const res = await request(app)
        .put(`/api/medical-records/${recordId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("notes", updateData.notes)
    })
  })
})
