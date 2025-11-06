import { describe, test, expect, beforeEach } from "@jest/globals"
import request from "supertest"
import app from "../app.js"
import Doctor from "../models/Doctor.js"

describe("Authentication Tests", () => {
  const doctorData = {
    name: "Dr. John Smith",
    email: "john.smith@hospital.com",
    password: "password123",
    specialization: "Cardiology",
    licenseNumber: "LIC123456",
    phone: "+1234567890",
  }

  describe("POST /api/auth/register", () => {
    test("should register a new doctor successfully", async () => {
      const res = await request(app).post("/api/auth/register").send(doctorData)

      expect(res.statusCode).toBe(201)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("email", doctorData.email)
      expect(res.body).toHaveProperty("token")
      expect(res.body.data).not.toHaveProperty("password")
    })

    test("should not register doctor with existing email", async () => {
      await Doctor.create(doctorData)

      const res = await request(app).post("/api/auth/register").send(doctorData)

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain("already exists")
    })

    test("should validate required fields", async () => {
      const res = await request(app).post("/api/auth/register").send({ email: "test@test.com" })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
      expect(res.body).toHaveProperty("errors")
    })

    test("should validate email format", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...doctorData, email: "invalid-email" })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    test("should validate password length", async () => {
      const res = await request(app)
        .post("/api/auth/register")
        .send({ ...doctorData, password: "123" })

      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await request(app).post("/api/auth/register").send(doctorData)
    })

    test("should login with valid credentials", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: doctorData.email,
        password: doctorData.password,
      })

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body).toHaveProperty("token")
      expect(res.body.data).toHaveProperty("email", doctorData.email)
    })

    test("should not login with invalid email", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "wrong@email.com",
        password: doctorData.password,
      })

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain("Invalid credentials")
    })

    test("should not login with invalid password", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: doctorData.email,
        password: "wrongpassword",
      })

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain("Invalid credentials")
    })

    test("should not login inactive doctor", async () => {
      await Doctor.findOneAndUpdate({ email: doctorData.email }, { isActive: false })

      const res = await request(app).post("/api/auth/login").send({
        email: doctorData.email,
        password: doctorData.password,
      })

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
      expect(res.body.message).toContain("inactive")
    })
  })

  describe("GET /api/auth/me", () => {
    let token

    beforeEach(async () => {
      const res = await request(app).post("/api/auth/register").send(doctorData)
      token = res.body.token
    })

    test("should get current doctor with valid token", async () => {
      const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.data).toHaveProperty("email", doctorData.email)
    })

    test("should not get doctor without token", async () => {
      const res = await request(app).get("/api/auth/me")

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
    })

    test("should not get doctor with invalid token", async () => {
      const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer invalidtoken")

      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
    })
  })

  describe("POST /api/auth/logout", () => {
    let token

    beforeEach(async () => {
      const res = await request(app).post("/api/auth/register").send(doctorData)
      token = res.body.token
    })

    test("should logout successfully", async () => {
      const res = await request(app).post("/api/auth/logout").set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
      expect(res.body.message).toContain("Logout successful")
    })
  })
})
