const { test, after, beforeEach } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const Blog = require('../models/blog');

// superagent object
const api = supertest(app);

const initialBlogs = [
    {
        title: 'HTML is easy',
        author: 'Dan Abramov',
        url: 'https://react.dev',
        likes: 5
    },
    {
        title: 'I am gonna become full-stack',
        author: 'Matej Milankov',
        url: 'https://react.dev',
        likes: 20
    }
];

beforeEach(async () => {
    await Blog.deleteMany({});
    let blogObj = new Blog(initialBlogs[0]);
    await blogObj.save();
    blogObj = new Blog(initialBlogs[1]);
    await blogObj.save();
});



test('blogs are returend as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

after(async () => {
    await mongoose.connection.close();
})

test('all blogs are returend', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, initialBlogs.length);
});


test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    assert(response.body[0].id);
});

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'async await is cool',
        author: 'Dan Abramov',
        url: 'https://react.dev',
        likes: 3
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs');
    const titles = response.body.map(blog => blog.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);
    assert(titles.includes('async await is cool'));
});

test('likes propery is missing', async () => {
    const newBlog = {
        title: 'fullstack is fun',
        author: 'Dan Abramov',
        url: 'https://react.dev',
    }

    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    assert.strictEqual(response.body.likes, 0);
});