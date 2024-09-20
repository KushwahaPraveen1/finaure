const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Assuming you export the express app from server.js
const { MongoMemoryServer } = require('mongodb-memory-server');

jest.setTimeout(90000); // Increase Jest's timeout to 90 seconds for this test suite

let mongoServer;

describe('Auth Controller', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = 'mongodb+srv://kushwahapraveen0507:fGK0q1a9hN3NXsaK@cluster0.gbpcc86.mongodb.net/';

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  it('should register a new user', async () => {
    const res = await request(app)
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
    const res = await request(app)
      .post('http://localhost:5000/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
});
