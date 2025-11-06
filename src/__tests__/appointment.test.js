import { describe, test, expect, beforeEach } from "@jest/globals"
import request from "supertest"
import app from "../app.js"

describe("Appointment CRUD Tests", () => {
  let token
  let doctorId
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
    doctorId = doctorRes.body.data.id

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

  const appointmentData = {
    appointmentDate: "2025-12-01",
    appointmentTime: "10:00",
    duration: 30,
    reason: "Regular checkup",
  }

  describe("POST /api/appointments", () => {
    test("should create a new appointment", async () => {
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("appointmentDate")
      expect(res.body.data).toHaveProperty("status", "scheduled")
    })

    test("should not create conflicting appointments", async () => {
      // Create first appointment
      await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })

      // Try to create conflicting appointment
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain("already booked")
    })

    test("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({ patient: patientId })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })

  describe("GET /api/appointments", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })
    })

    test("should get all appointments", async () => {
      const res = await request(app).get("/api/appointments").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toBeInstanceOf(Array)
    })

    test("should filter by status", async () => {
      const res = await request(app).get("/api/appointments?status=scheduled").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })

    test("should filter by doctor", async () => {
      const res = await request(app).get(`/api/appointments?doctor=${doctorId}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe("GET /api/appointments/doctor/:doctorId/schedule", () => {
    beforeEach(async () => {
      await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })
    })

    test("should get doctor schedule", async () => {
      const res = await request(app)
        .get(`/api/appointments/doctor/${doctorId}/schedule`)
        .set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("doctor")
      expect(res.body.data).toHaveProperty("appointments")
    })
  })

  describe("PUT /api/appointments/:id", () => {
    let appointmentId

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })
      appointmentId = res.body.data._id
    })

    test("should update appointment status", async () => {
      const res = await request(app)
        .put(`/api/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status: "confirmed" })

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("status", "confirmed")
    })
  })

  describe("DELETE /api/appointments/:id", () => {
    let appointmentId

    beforeEach(async () => {
      const res = await request(app)
        .post("/api/appointments")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...appointmentData,
          patient: patientId,
          doctor: doctorId,
        })
      appointmentId = res.body.data._id
    })

    test("should delete appointment", async () => {
      const res = await request(app)
        .delete(`/api/appointments/${appointmentId}`)
        .set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })
})
