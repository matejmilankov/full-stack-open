const { test, describe, beforeEach, after } = require('node:test');
const supertest = require('supertest');
const assert = require('node:assert');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');
const mongoose = require('mongoose');

const api = supertest(app);

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({
            username: 'root',
            passwordHash
        });

        await user.save();
    });

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

        const usernames = usersAtEnd.map(u => u.username);
        assert(usernames.includes(newUser.username));
    });

    test('creation fails if username already taken', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd.length, usersAtStart.length);
        assert(result.body.error.includes('expected `username` to be unique'));
    });

    test('creation fails if username is shorter then 3 characters', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'rt',
            name: 'Superuser',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('creation fails if password is shorter then 3 characters', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'matej',
            name: 'matejMilankov',
            password: '04'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('creation fails if username is missing', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            name: 'Superuser',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    test('creation fails if password is missing', async () => {
        const usersAtStart = await helper.usersInDb();

        const newUser = {
            username: 'matej',
            name: 'matejMilankov'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    });

    after(async () => {
        mongoose.connection.close();
    });
});