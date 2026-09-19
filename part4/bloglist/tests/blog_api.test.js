const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const Blog = require('../models/blog');
const helper = require('./test_helper');

// superagent object
const api = supertest(app);

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await Blog.insertMany(helper.initialBlogs);
    });
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    });
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs');
        assert.strictEqual(response.body.length, helper.initialBlogs.length);
    });
    test('unique identifier property of the blog posts is named id', async () => {
        const response = await api.get('/api/blogs');
        assert(response.body[0].id);
    });

    
    describe('addition of a new blog', () => {
        test('succeeds with valid data', async () => {
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
        
            const blogsAtEnd = await helper.blogsInDb();
            const titles = blogsAtEnd.map(blog => blog.title);
        
            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
            assert(titles.includes('async await is cool'));
        });
        test('defaults to 0 likes if likes property is missing', async () => {
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
        
        test('fails with status code 400 if url is missing', async () => {
            const newBlog = {
                title: 'http is powerfull',
                author: 'Dan Abramov',
                likes: 3
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        
            const blogs = await helper.blogsInDb();
            assert.strictEqual(blogs.length, helper.initialBlogs.length);
        });
        
        test('fails with status code 400 if title is missing', async () => {
            const newBlog = {
                author: 'Dan Abramov',
                url: 'https://react.dev',
                likes: 3
            }
        
            await api
                .post('/api/blogs')
                .send(newBlog)
                .expect(400)
        
            const blogs = await helper.blogsInDb();
            assert.strictEqual(blogs.length, helper.initialBlogs.length);
        });
    });


    after(async () => {
        await mongoose.connection.close();
    });
});









