const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Import the Express app
const http = require('http'); // Import the http module

jest.setTimeout(90000); // Increase Jest's timeout

let mongoServer;
let server; // Declare server variable

describe('Auth Controller', () => {
  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect('mongodb+srv://kushwahapraveen0507:fGK0q1a9hN3NXsaK@cluster0.gbpcc86.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Create HTTP server using Express app
    server = http.createServer(app);
    server.listen(3000); // Set to port 3000 or any available port
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
    
    // Close the server after tests
    server.close();
  });

  it('should register a new user', async () => {
    const res = await request(server) // Use 'server' instead of 'app'
      .post('http://localhost:5000/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login a user', async () => {
    const res = await request(server) // Use 'server' instead of 'app'
      .post('http://localhost:5000/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
