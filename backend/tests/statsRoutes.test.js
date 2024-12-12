const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models');
const userRouter = require('../controllers/userController');

// Mock Express app
const app = express();
app.use(express.json());
app.use('/users', userRouter);

// Mock environment variables
process.env.JWT_SECRET = 'testsecret';

// Mock database models
jest.mock('../models');

const testUser = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'hashedpassword',
};

describe('User Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should register a user', async () => {
        User.findOne.mockResolvedValue(null); // Mock no existing user
        User.create.mockResolvedValue({ id: 1, ...testUser }); // Mock user creation

        const response = await request(app).post('/users/register').send({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty('id');
    });

    it('should login a user', async () => {
        User.findOne.mockResolvedValue({ ...testUser, password: await bcrypt.hash('password123', 10) });

        const response = await request(app).post('/users/login').send({
            email: 'testuser@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
