import { describe, test, expect, beforeEach } from "@jest/globals"
import request from "supertest"
import app from "../app.js"
import Patient from "../models/Patient.js"

describe("Patient CRUD Tests", () => {
  let token
  let doctorId

  const patientData = {
    firstName: "Jane",
    lastName: "Doe",
    dateOfBirth: "1990-05-15",
    gender: "female",
    phone: "+1234567890",
    email: "jane.doe@email.com",
    bloodGroup: "O+",
    emergencyContact: {
      name: "John Doe",
      relationship: "Spouse",
      phone: "+0987654321",
    },
  }

  beforeEach(async () => {
    // Register and login doctor
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
  })

  describe("POST /api/patients", () => {
    test("should create a new patient", async () => {
      const res = await request(app).post("/api/patients").set("Authorization", `Bearer ${token}`).send(patientData)

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("firstName", patientData.firstName)
      expect(res.body.data).toHaveProperty("registeredBy")
    })

    test("should not create patient without authentication", async () => {
      const res = await request(app).post("/api/patients").send(patientData)

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
    })

    test("should validate required fields", async () => {
      const res = await request(app)
        .post("/api/patients")
        .set("Authorization", `Bearer ${token}`)
        .send({ firstName: "Jane" })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    test("should validate gender enum", async () => {
      const res = await request(app)
        .post("/api/patients")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...patientData, gender: "invalid" })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })

  describe("GET /api/patients", () => {
    beforeEach(async () => {
      await request(app).post("/api/patients").set("Authorization", `Bearer ${token}`).send(patientData)
    })

    test("should get all patients", async () => {
      const res = await request(app).get("/api/patients").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toBeInstanceOf(Array)
      expect(res.body.count).toBeGreaterThan(0)
    })

    test("should support pagination", async () => {
      const res = await request(app).get("/api/patients?page=1&limit=5").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty("currentPage", "1")
      expect(res.body).toHaveProperty("totalPages")
    })

    test("should support search", async () => {
      const res = await request(app).get("/api/patients?search=Jane").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })

  describe("GET /api/patients/:id", () => {
    let patientId

    beforeEach(async () => {
      const res = await request(app).post("/api/patients").set("Authorization", `Bearer ${token}`).send(patientData)
      patientId = res.body.data._id
    })

    test("should get single patient", async () => {
      const res = await request(app).get(`/api/patients/${patientId}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("_id", patientId)
    })

    test("should return 404 for non-existent patient", async () => {
      const fakeId = "507f1f77bcf86cd799439011"
      const res = await request(app).get(`/api/patients/${fakeId}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe("PUT /api/patients/:id", () => {
    let patientId

    beforeEach(async () => {
      const res = await request(app).post("/api/patients").set("Authorization", `Bearer ${token}`).send(patientData)
      patientId = res.body.data._id
    })

    test("should update patient", async () => {
      const updateData = { phone: "+9999999999" }
      const res = await request(app)
        .put(`/api/patients/${patientId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("phone", updateData.phone)
    })

    test("should return 404 for non-existent patient", async () => {
      const fakeId = "507f1f77bcf86cd799439011"
      const res = await request(app)
        .put(`/api/patients/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ phone: "+9999999999" })

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })

  describe("DELETE /api/patients/:id", () => {
    let patientId

    beforeEach(async () => {
      const res = await request(app).post("/api/patients").set("Authorization", `Bearer ${token}`).send(patientData)
      patientId = res.body.data._id
    })

    test("should delete patient", async () => {
      const res = await request(app).delete(`/api/patients/${patientId}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)

      const patient = await Patient.findById(patientId)
      expect(patient).toBeNull()
    })

    test("should return 404 for non-existent patient", async () => {
      const fakeId = "507f1f77bcf86cd799439011"
      const res = await request(app).delete(`/api/patients/${fakeId}`).set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.success).toBe(false)
    })
  })
})
