const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User, Member, Role, ActivityLog } = require('../models');
const userRouter = require('../controllers/userController');
const memberRouter = require('../controllers/membersController');

// Mock Express app
const app = express();
app.use(express.json());
app.use('/users', userRouter);
app.use('/members', memberRouter);

// Mock environment variables
process.env.JWT_SECRET = 'testsecret';

// Mock database models
jest.mock('../models');

// Sample test user and token
const testUser = {
    id: 1,
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'hashedpassword',
};

const testToken = jwt.sign({ user: { id: testUser.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

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

describe('Member Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all members with pagination', async () => {
        const testMembers = [
            { id: 1, name: 'Member 1', email: 'member1@example.com', role_id: 1 },
            { id: 2, name: 'Member 2', email: 'member2@example.com', role_id: 2 },
        ];

        Member.findAndCountAll.mockResolvedValue({
            count: testMembers.length,
            rows: testMembers,
        });

        const response = await request(app)
            .get('/members?page=1&limit=10')
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(response.body.members).toHaveLength(2);
    });

    it('should create a member', async () => {
        Role.findByPk.mockResolvedValue({ id: 1, name: 'Admin' }); // Mock role existence
        User.findByPk.mockResolvedValue(testUser); // Mock user
        Member.create.mockResolvedValue({ id: 1, name: 'New Member' }); // Mock member creation

        const response = await request(app)
            .post('/members')
            .set('Authorization', `Bearer ${testToken}`)
            .send({
                name: 'New Member',
                email: 'newmember@example.com',
                date_of_birth: '1990-01-01',
                role_id: 1,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    });

    it('should fetch a specific member', async () => {
        Member.findByPk.mockResolvedValue({
            id: 1,
            name: 'Member 1',
            email: 'member1@example.com',
        });

        const response = await request(app)
            .get('/members/1')
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('should update a member', async () => {
        Member.findByPk.mockResolvedValue({ id: 1, save: jest.fn() }); // Mock member

        const response = await request(app)
            .put('/members/1')
            .set('Authorization', `Bearer ${testToken}`)
            .send({ name: 'Updated Member' });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Updated Member');
    });

    it('should delete a member', async () => {
        Member.findByPk.mockResolvedValue({ id: 1, destroy: jest.fn() }); // Mock member

        const response = await request(app)
            .delete('/members/1')
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Member deleted successfully');
    });
});
