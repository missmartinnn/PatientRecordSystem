# Patient Record System - Healthcare Backend API

A comprehensive backend system for managing patient records, medical history, doctor authentication, and appointment scheduling. Built with Node.js, Express, and MongoDB.

## Features

- **Doctor Authentication & Authorization**
  - Secure registration and login with JWT tokens
  - Role-based access control (Doctor, Admin)
  - Password hashing with bcrypt
  - Session management

- **Patient Management**
  - Complete CRUD operations for patient records
  - Patient registration with detailed information
  - Emergency contact management
  - Search and pagination support

- **Medical Records**
  - Comprehensive medical history tracking
  - Vital signs recording
  - Prescription management
  - Lab test results
  - Doctor notes and follow-up scheduling

- **Appointment Scheduling**
  - Create and manage appointments
  - Conflict detection for time slots
  - Doctor schedule management
  - Multiple appointment statuses

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, bcryptjs, express-rate-limit
- **Validation**: express-validator
- **Testing**: Jest, Supertest

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd patient-record-system
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Create environment file:
\`\`\`bash
cp .env.example .env
\`\`\`

4. Configure environment variables in `.env`:
\`\`\`env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/patientrecordsystem
MONGODB_TEST_URI=mongodb+srv://username:password@cluster.mongodb.net/patientrecordsystemtest
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
\`\`\`

5. Start MongoDB:
\`\`\`bash
# Using MongoDB service
sudo systemctl start mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
\`\`\`

6. Run the application:
\`\`\`bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
\`\`\`

The server will start on `http://localhost:5000`

## Testing

Run the test suite:
\`\`\`bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

Test coverage includes:
- Unit tests for all controllers
- Integration tests for API endpoints
- Authentication and authorization tests
- Minimum 80% code coverage

## API Documentation

### Base URL
\`\`\`
http://localhost:5000/api
\`\`\`

### Authentication

All protected routes require a JWT token in the Authorization header:
\`\`\`
Authorization: Bearer <token>
\`\`\`

---

### Authentication Endpoints

#### Register Doctor
\`\`\`http
POST /api/auth/register
\`\`\`

**Request Body:**
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

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Doctor registered successfully",
  "data": {
    "id": "64abc123...",
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "specialization": "Cardiology",
    "licenseNumber": "LIC123456",
    "phone": "+1234567890",
    "role": "doctor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

#### Login Doctor
\`\`\`http
POST /api/auth/login
\`\`\`

**Request Body:**
\`\`\`json
{
  "email": "john.smith@hospital.com",
  "password": "password123"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "id": "64abc123...",
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "specialization": "Cardiology",
    "role": "doctor"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
\`\`\`

#### Get Current Doctor
\`\`\`http
GET /api/auth/me
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "id": "64abc123...",
    "name": "Dr. John Smith",
    "email": "john.smith@hospital.com",
    "specialization": "Cardiology",
    "role": "doctor"
  }
}
\`\`\`

#### Logout
\`\`\`http
POST /api/auth/logout
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Logout successful"
}
\`\`\`

---

### Patient Endpoints

#### Create Patient
\`\`\`http
POST /api/patients
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
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

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Patient created successfully",
  "data": {
    "_id": "64def456...",
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15T00:00:00.000Z",
    "gender": "female",
    "phone": "+1234567890",
    "email": "jane.doe@email.com",
    "bloodGroup": "O+",
    "registeredBy": "64abc123...",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}
\`\`\`

#### Get All Patients
\`\`\`http
GET /api/patients?page=1&limit=10&search=Jane&isActive=true
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name or phone
- `isActive` (optional): Filter by active status

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 10,
  "total": 45,
  "totalPages": 5,
  "currentPage": "1",
  "data": [...]
}
\`\`\`

#### Get Single Patient
\`\`\`http
GET /api/patients/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "data": {
    "_id": "64def456...",
    "firstName": "Jane",
    "lastName": "Doe",
    ...
  }
}
\`\`\`

#### Update Patient
\`\`\`http
PUT /api/patients/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "phone": "+9999999999",
  "email": "newemail@email.com"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Patient updated successfully",
  "data": {...}
}
\`\`\`

#### Delete Patient
\`\`\`http
DELETE /api/patients/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Patient deleted successfully",
  "data": {}
}
\`\`\`

---

### Medical Record Endpoints

#### Create Medical Record
\`\`\`http
POST /api/medical-records
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "patient": "64def456...",
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

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Medical record created successfully",
  "data": {...}
}
\`\`\`

#### Get All Medical Records
\`\`\`http
GET /api/medical-records?page=1&limit=10&patient=64def456&doctor=64abc123
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `patient` (optional): Filter by patient ID
- `doctor` (optional): Filter by doctor ID

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 10,
  "total": 25,
  "totalPages": 3,
  "currentPage": "1",
  "data": [...]
}
\`\`\`

#### Get Patient Medical History
\`\`\`http
GET /api/medical-records/patient/:patientId/history
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 5,
  "data": {
    "patient": {
      "id": "64def456...",
      "name": "Jane Doe",
      "dateOfBirth": "1990-05-15",
      "gender": "female",
      "bloodGroup": "O+",
      "allergies": ["Penicillin"],
      "chronicConditions": ["Diabetes"]
    },
    "records": [...]
  }
}
\`\`\`

#### Update Medical Record
\`\`\`http
PUT /api/medical-records/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "notes": "Patient recovering well",
  "followUpDate": "2025-02-01"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Medical record updated successfully",
  "data": {...}
}
\`\`\`

#### Delete Medical Record (Admin Only)
\`\`\`http
DELETE /api/medical-records/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Medical record deleted successfully",
  "data": {}
}
\`\`\`

---

### Appointment Endpoints

#### Create Appointment
\`\`\`http
POST /api/appointments
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "patient": "64def456...",
  "doctor": "64abc123...",
  "appointmentDate": "2025-12-01",
  "appointmentTime": "10:00",
  "duration": 30,
  "reason": "Regular checkup",
  "notes": "First visit"
}
\`\`\`

**Response (201):**
\`\`\`json
{
  "success": true,
  "message": "Appointment created successfully",
  "data": {
    "_id": "64ghi789...",
    "patient": {...},
    "doctor": {...},
    "appointmentDate": "2025-12-01",
    "appointmentTime": "10:00",
    "status": "scheduled",
    ...
  }
}
\`\`\`

#### Get All Appointments
\`\`\`http
GET /api/appointments?page=1&limit=10&patient=64def456&doctor=64abc123&status=scheduled&date=2025-12-01
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `patient` (optional): Filter by patient ID
- `doctor` (optional): Filter by doctor ID
- `status` (optional): Filter by status (scheduled, confirmed, completed, cancelled, no-show)
- `date` (optional): Filter by date (YYYY-MM-DD)

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 10,
  "total": 30,
  "totalPages": 3,
  "currentPage": "1",
  "data": [...]
}
\`\`\`

#### Get Doctor Schedule
\`\`\`http
GET /api/appointments/doctor/:doctorId/schedule?date=2025-12-01
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Query Parameters:**
- `date` (optional): Filter by specific date

**Response (200):**
\`\`\`json
{
  "success": true,
  "count": 5,
  "data": {
    "doctor": {
      "id": "64abc123...",
      "name": "Dr. John Smith",
      "specialization": "Cardiology"
    },
    "appointments": [...]
  }
}
\`\`\`

#### Update Appointment
\`\`\`http
PUT /api/appointments/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Request Body:**
\`\`\`json
{
  "status": "confirmed",
  "notes": "Patient confirmed attendance"
}
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Appointment updated successfully",
  "data": {...}
}
\`\`\`

#### Delete Appointment
\`\`\`http
DELETE /api/appointments/:id
\`\`\`

**Headers:**
\`\`\`
Authorization: Bearer <token>
\`\`\`

**Response (200):**
\`\`\`json
{
  "success": true,
  "message": "Appointment deleted successfully",
  "data": {}
}
\`\`\`

---

## Error Responses

All error responses follow this format:

\`\`\`json
{
  "success": false,
  "message": "Error message description"
}
\`\`\`

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Error Response

\`\`\`json
{
  "success": false,
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
\`\`\`

## Security Features

- **Password Hashing**: All passwords are hashed using bcrypt
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: All inputs are validated and sanitized
- **CORS Protection**: Configurable CORS origins
- **Helmet**: Security headers with Helmet.js
- **Role-Based Access**: Admin and Doctor roles with different permissions

## Database Schema

### Doctor Schema
- name, email, password (hashed)
- specialization, licenseNumber, phone
- role (doctor/admin), isActive
- timestamps

### Patient Schema
- firstName, lastName, dateOfBirth, gender
- email, phone, address
- emergencyContact (name, relationship, phone)
- bloodGroup, allergies, chronicConditions
- registeredBy (doctor reference)
- timestamps

### Medical Record Schema
- patient (reference), doctor (reference)
- visitDate, chiefComplaint, diagnosis
- symptoms, vitalSigns, prescriptions
- labTests, notes, followUpDate
- timestamps

### Appointment Schema
- patient (reference), doctor (reference)
- appointmentDate, appointmentTime, duration
- reason, status, notes
- createdBy (doctor reference)
- timestamps

## Project Structure

\`\`\`
patient-record-system/
├── src/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── medicalRecordController.js
│   │   └── appointmentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   ├── Doctor.js
│   │   ├── Patient.js
│   │   ├── MedicalRecord.js
│   │   └── Appointment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── patientRoutes.js
│   │   ├── medicalRecordRoutes.js
│   │   └── appointmentRoutes.js
│   ├── __tests__/
│   │   ├── setup.js
│   │   ├── auth.test.js
│   │   ├── patient.test.js
│   │   ├── medicalRecord.test.js
│   │   ├── appointment.test.js
│   │   └── authorization.test.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
\`\`\`

## Best Practices Implemented

1. **Separation of Concerns**: Routes, controllers, models, and middleware are separated
2. **Error Handling**: Centralized error handling with descriptive messages
3. **Validation**: Input validation on all endpoints
4. **Security**: Password hashing, JWT tokens, rate limiting
5. **Testing**: Comprehensive test coverage (>80%)
6. **Documentation**: Clear API documentation with examples
7. **Code Quality**: Consistent naming conventions and formatting
8. **Environment Variables**: Sensitive data stored in .env file

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes with meaningful messages
4. Write tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on the repository.
