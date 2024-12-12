const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Member, Role, User } = require('../models');
const memberRouter = require('../controllers/membersController');

// Mock Express app
const app = express();
app.use(express.json());
app.use('/members', memberRouter);

// Mock environment variables
process.env.JWT_SECRET = 'testsecret';

// Mock database models
jest.mock('../models');

const testToken = jwt.sign({ user: { id: 1 } }, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Member Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all members with pagination', async () => {
        Member.findAndCountAll.mockResolvedValue({
            count: 2,
            rows: [
                { id: 1, name: 'Member 1', email: 'member1@example.com', role_id: 1 },
                { id: 2, name: 'Member 2', email: 'member2@example.com', role_id: 2 },
            ],
        });

        const response = await request(app)
            .get('/members?page=1&limit=10')
            .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(response.body.members).toHaveLength(2);
    });

    it('should create a member', async () => {
        Role.findByPk.mockResolvedValue({ id: 1, name: 'Admin' }); // Mock role existence
        User.findByPk.mockResolvedValue({ id: 1, username: 'testuser' }); // Mock user
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
