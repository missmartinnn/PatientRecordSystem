# Setup and Installation Guide

## Quick Start

Follow these steps to get the Patient Record System up and running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16.0.0 or higher)
  - Download from: https://nodejs.org/
  - Verify installation: `node --version`

- **MongoDB** (v5.0 or higher)
  - Download from: https://www.mongodb.com/try/download/community
  - Or use Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`
  - Verify installation: `mongosh --version`

- **npm** or **yarn**
  - npm comes with Node.js
  - Verify: `npm --version`

- **Git** (optional, for cloning)
  - Download from: https://git-scm.com/

## Step-by-Step Installation

### 1. Get the Code

\`\`\`bash
# Clone the repository (if using Git)
git clone <repository-url>
cd patient-record-system

# Or extract the ZIP file and navigate to the directory
cd patient-record-system
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

This will install all required packages including:
- express
- mongoose
- bcryptjs
- jsonwebtoken
- express-validator
- And all other dependencies

### 3. Configure Environment Variables

\`\`\`bash
# Copy the example environment file
cp .env.example .env
\`\`\`

Edit the `.env` file with your configuration:

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/patient-record-system
MONGODB_TEST_URI=mongodb://localhost:27017/patient-record-system-test

# JWT Configuration (IMPORTANT: Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
\`\`\`

**Important**: Change the `JWT_SECRET` to a strong, random string in production!

### 4. Start MongoDB

#### Option A: Local MongoDB Installation
\`\`\`bash
# On Linux/Mac
sudo systemctl start mongod

# On Windows
net start MongoDB

# Verify MongoDB is running
mongosh
\`\`\`

#### Option B: Using Docker
\`\`\`bash
# Start MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
\`\`\`

### 5. Run the Application

#### Development Mode (with auto-reload)
\`\`\`bash
npm run dev
\`\`\`

#### Production Mode
\`\`\`bash
npm start
\`\`\`

You should see:
\`\`\`
MongoDB Connected: localhost
Server running in development mode on port 5000
\`\`\`

### 6. Verify Installation

Open your browser or use a tool like Postman to test:

\`\`\`
http://localhost:5000/health
\`\`\`

You should receive:
\`\`\`json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-01-15T10:30:00.000Z"
}
\`\`\`

## Testing the Setup

### Run Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
\`\`\`

Expected output:
\`\`\`
Test Suites: 5 passed, 5 total
Tests:       52 passed, 52 total
\`\`\`

### Test API Endpoints

#### 1. Register a Doctor

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dr. John Smith",
    "email": "john@hospital.com",
    "password": "password123",
    "specialization": "Cardiology",
    "licenseNumber": "LIC123456",
    "phone": "+1234567890"
  }'
\`\`\`

#### 2. Login

\`\`\`bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@hospital.com",
    "password": "password123"
  }'
\`\`\`

Save the token from the response for subsequent requests.

#### 3. Create a Patient

\`\`\`bash
curl -X POST http://localhost:5000/api/patients \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "firstName": "Jane",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "gender": "female",
    "phone": "+1234567890",
    "emergencyContact": {
      "name": "John Doe",
      "phone": "+0987654321"
    }
  }'
\`\`\`

## Troubleshooting

### MongoDB Connection Issues

**Problem**: `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions**:
1. Ensure MongoDB is running: `sudo systemctl status mongod`
2. Check MongoDB port: `netstat -an | grep 27017`
3. Verify connection string in `.env` file
4. Try connecting with mongosh: `mongosh mongodb://localhost:27017`

### Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::5000`

**Solutions**:
1. Change PORT in `.env` file to a different port (e.g., 5001)
2. Or kill the process using port 5000:
   \`\`\`bash
   # Find process
   lsof -i :5000
   # Kill process
   kill -9 <PID>
   \`\`\`

### JWT Token Issues

**Problem**: `Not authorized to access this route`

**Solutions**:
1. Ensure you're including the token in the Authorization header
2. Format: `Authorization: Bearer <token>`
3. Check if token has expired (default: 7 days)
4. Verify JWT_SECRET matches between registration and login

### Test Failures

**Problem**: Tests failing or hanging

**Solutions**:
1. Ensure test database is accessible
2. Check MONGODB_TEST_URI in `.env`
3. Clear test database: `mongosh patient-record-system-test --eval "db.dropDatabase()"`
4. Run tests with verbose output: `npm test -- --verbose`

## Development Tools

### Recommended Tools

1. **Postman** or **Insomnia**
   - For API testing
   - Import the API documentation as a collection

2. **MongoDB Compass**
   - GUI for MongoDB
   - Connect to: `mongodb`

3. **VS Code Extensions**
   - ESLint
   - Prettier
   - REST Client
   - MongoDB for VS Code

### VS Code REST Client Example

Create a file `api-test.http`:

\`\`\`http
### Register Doctor
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "Dr. Test",
  "email": "test@hospital.com",
  "password": "password123",
  "specialization": "General",
  "licenseNumber": "LIC999",
  "phone": "+1111111111"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@hospital.com",
  "password": "password123"
}
\`\`\`

## Production Deployment

### Environment Setup

1. Set `NODE_ENV=production` in `.env`
2. Use a strong, random `JWT_SECRET`
3. Use a production MongoDB instance (MongoDB Atlas recommended)
4. Configure proper CORS origins
5. Set up SSL/TLS certificates

### MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   \`\`\`
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/patient-record-system
   \`\`\`

### Deployment Platforms

- **Heroku**: Easy deployment with MongoDB Atlas
- **AWS EC2**: Full control, requires more setup
- **DigitalOcean**: App Platform or Droplets
- **Vercel**: Serverless functions (requires adaptation)

## Next Steps

1. Read the [API Documentation](README.md#api-documentation)
2. Review the [Testing Report](TESTING_REPORT.md)
3. Explore the codebase structure
4. Start building your frontend integration

## Support

If you encounter issues not covered here:
1. Check the [README.md](README.md) for detailed API documentation
2. Review the test files for usage examples
3. Open an issue on the repository

## Security Checklist

Before deploying to production:

- [ ] Changed JWT_SECRET to a strong random string
- [ ] Set NODE_ENV to production
- [ ] Using HTTPS/SSL
- [ ] MongoDB authentication enabled
- [ ] CORS properly configured
- [ ] Rate limiting configured
- [ ] Environment variables secured
- [ ] Logs configured for monitoring
- [ ] Backup strategy in place

---

**Happy Coding!**
