# Postman Collection Guide
## Patient Record System API

This guide helps you test the API using Postman or any other API testing tool.

## Setup

1. **Import Environment Variables**

Create a new environment in Postman with these variables:

\`\`\`
base_url: http://localhost:5000/api
token: (will be set automatically after login)
\`\`\`

2. **Base URL**

All requests use: `{{base_url}}`

---

## Authentication Endpoints

### 1. Register Doctor

**POST** `{{base_url}}/auth/register`

**Body (JSON):**
\`\`\`json
{
  "name": "Dr. John Smith",
  "email": "john.smith@hospital.com",
  "password": "password123",
  "specialization": "Cardiology",
  "licenseNumber": "LIC123456",
  "phone": "+1234567890",
  "role": "doctor"
}
\`\`\`

**Tests Script (Auto-save token):**
\`\`\`javascript
if (pm.response.code === 201) {
    pm.environment.set("token", pm.response.json().token);
}
\`\`\`

### 2. Login Doctor

**POST** `{{base_url}}/auth/login`

**Body (JSON):**
\`\`\`json
{
  "email": "john.smith@hospital.com",
  "password": "password123"
}
\`\`\`

**Tests Script:**
\`\`\`javascript
if (pm.response.code === 200) {
    pm.environment.set("token", pm.response.json().token);
}
\`\`\`

### 3. Get Current Doctor

**GET** `{{base_url}}/auth/me`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 4. Logout

**POST** `{{base_url}}/auth/logout`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

---

## Patient Endpoints

### 1. Create Patient

**POST** `{{base_url}}/patients`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "gender": "female",
  "phone": "+1234567890",
  "email": "jane.doe@email.com",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  },
  "emergencyContact": {
    "name": "John Doe",
    "relationship": "Spouse",
    "phone": "+0987654321"
  },
  "bloodGroup": "O+",
  "allergies": ["Penicillin"],
  "chronicConditions": ["Diabetes"]
}
\`\`\`

**Tests Script (Save patient ID):**
\`\`\`javascript
if (pm.response.code === 201) {
    pm.environment.set("patient_id", pm.response.json().data._id);
}
\`\`\`

### 2. Get All Patients

**GET** `{{base_url}}/patients?page=1&limit=10&search=Jane`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 3. Get Single Patient

**GET** `{{base_url}}/patients/{{patient_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 4. Update Patient

**PUT** `{{base_url}}/patients/{{patient_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "phone": "+9999999999",
  "email": "newemail@email.com"
}
\`\`\`

### 5. Delete Patient

**DELETE** `{{base_url}}/patients/{{patient_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

---

## Medical Record Endpoints

### 1. Create Medical Record

**POST** `{{base_url}}/medical-records`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "patient": "{{patient_id}}",
  "visitDate": "2025-01-15",
  "chiefComplaint": "Fever and headache",
  "diagnosis": "Viral infection",
  "symptoms": ["fever", "headache", "fatigue"],
  "vitalSigns": {
    "bloodPressure": "120/80",
    "heartRate": 80,
    "temperature": 38.5,
    "respiratoryRate": 18,
    "oxygenSaturation": 98,
    "weight": 70,
    "height": 175
  },
  "prescriptions": [
    {
      "medication": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "5 days",
      "instructions": "Take after meals"
    }
  ],
  "labTests": [
    {
      "testName": "Blood Count",
      "result": "Normal",
      "date": "2025-01-15"
    }
  ],
  "notes": "Patient advised to rest and stay hydrated",
  "followUpDate": "2025-01-22"
}
\`\`\`

**Tests Script:**
\`\`\`javascript
if (pm.response.code === 201) {
    pm.environment.set("record_id", pm.response.json().data._id);
}
\`\`\`

### 2. Get All Medical Records

**GET** `{{base_url}}/medical-records?page=1&limit=10`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 3. Get Patient Medical History

**GET** `{{base_url}}/medical-records/patient/{{patient_id}}/history`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 4. Update Medical Record

**PUT** `{{base_url}}/medical-records/{{record_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "notes": "Patient recovering well",
  "followUpDate": "2025-02-01"
}
\`\`\`

### 5. Delete Medical Record (Admin Only)

**DELETE** `{{base_url}}/medical-records/{{record_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

---

## Appointment Endpoints

### 1. Create Appointment

**POST** `{{base_url}}/appointments`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "patient": "{{patient_id}}",
  "doctor": "{{doctor_id}}",
  "appointmentDate": "2025-12-01",
  "appointmentTime": "10:00",
  "duration": 30,
  "reason": "Regular checkup",
  "notes": "First visit"
}
\`\`\`

**Tests Script:**
\`\`\`javascript
if (pm.response.code === 201) {
    pm.environment.set("appointment_id", pm.response.json().data._id);
}
\`\`\`

### 2. Get All Appointments

**GET** `{{base_url}}/appointments?status=scheduled&date=2025-12-01`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 3. Get Doctor Schedule

**GET** `{{base_url}}/appointments/doctor/{{doctor_id}}/schedule?date=2025-12-01`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

### 4. Update Appointment

**PUT** `{{base_url}}/appointments/{{appointment_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

**Body (JSON):**
\`\`\`json
{
  "status": "confirmed",
  "notes": "Patient confirmed attendance"
}
\`\`\`

### 5. Delete Appointment

**DELETE** `{{base_url}}/appointments/{{appointment_id}}`

**Headers:**
\`\`\`
Authorization: Bearer {{token}}
\`\`\`

---

## Testing Workflow

### Complete Test Flow:

1. **Register a Doctor** → Save token
2. **Create a Patient** → Save patient_id
3. **Create Medical Record** for patient → Save record_id
4. **Create Appointment** for patient → Save appointment_id
5. **Get Patient History** → Verify all records
6. **Update Appointment** status to "confirmed"
7. **Get Doctor Schedule** → Verify appointment appears
8. **Test Authorization** → Try to delete medical record (should fail if not admin)

### Error Testing:

1. **Test without token** → Should return 401
2. **Test with invalid ID** → Should return 404
3. **Test with missing fields** → Should return 400 with validation errors
4. **Test duplicate email** → Should return 400
5. **Test conflicting appointments** → Should return 400

---

## Environment Variables Reference

\`\`\`
base_url: http://localhost:5000/api
token: (auto-set after login)
patient_id: (auto-set after creating patient)
doctor_id: (auto-set after registration)
record_id: (auto-set after creating medical record)
appointment_id: (auto-set after creating appointment)
\`\`\`

---

## Expected Status Codes

- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

---

## Tips for Testing

1. **Always login first** to get a valid token
2. **Save IDs** from responses for subsequent requests
3. **Test error cases** to verify validation
4. **Check response structure** matches documentation
5. **Verify status codes** are correct
6. **Test role-based access** with different user roles

---

**Last Updated:** January 2025  
**API Version:** 1.0.0
