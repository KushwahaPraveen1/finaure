const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app'); // Import the Express app

jest.setTimeout(90000); // Increase Jest's timeout

let mongoServer;

describe('Plan Controller', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    // const uri = mongoServer.getUri();
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

  it('should create a new plan', async () => {
    const res = await request(app)
      .post('http://localhost:5000/api/plans')
      .send({
        name: 'Test Plan',
        description: 'This is a test plan',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('name', 'Test Plan');
  });

  it('should get all plans', async () => {
    const res = await request(app).get('http://localhost:5000/api/plans');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
