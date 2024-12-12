const { faker } = require('@faker-js/faker');
const { User, Role, Member, ActivityLog } = require('../models');

const seedDatabase = async () => {
    try {
        // Seed roles
        await Role.bulkCreate([
            { id: 1, name: 'admin', description: 'Administrator role' },
            { id: 2, name: 'user', description: 'Regular user role' },
        ]);

        // Seed users with faker
        for (let i = 0; i < 10; i++) {
            await User.create({
                username: faker.internet.userName(),
                email: faker.internet.email(),
                password: faker.internet.password(10),
                role_id: faker.helpers.arrayElement([1, 2]),
            });
        }

        // Seed members
        for (let i = 0; i < 300; i++) {
            await Member.create({
                name: faker.name.fullName(),
                email: faker.internet.email(),
                date_of_birth: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
                role_id: faker.helpers.arrayElement([1, 2]),
                created_by: faker.helpers.arrayElement([1, 2]),
            });
        }

        console.log('Dummy data seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

seedDatabase();
