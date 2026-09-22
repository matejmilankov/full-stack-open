const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const assert = require('node:assert');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// superagent object
const api = supertest(app);
let token = null;

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({});
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new User({
            username: 'root',
            name: 'Superuser',
            passwordHash
        });
        const savedUser = await user.save();

        const userForToken = {
            username: savedUser.username,
            id: savedUser._id
        }
        token = jwt.sign(userForToken, process.env.SECRET);

        const updatedBlogs = helper.initialBlogs.map(blog => (
            new Blog({...blog, user: user._id})
        ));
        await Promise.all(updatedBlogs.map(blog => blog.save()));
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
            const users = await helper.usersInDb();
            const newBlog = {
                title: 'async await is cool',
                author: 'Dan Abramov',
                url: 'https://react.dev',
                likes: 3,
                userId: users[0].id
            }

            await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(201)
                .expect('Content-Type', /application\/json/)

            const blogsAtEnd = await helper.blogsInDb();
            const titles = blogsAtEnd.map(blog => blog.title);

            assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
            assert(titles.includes('async await is cool'));
        });
        test('defaults to 0 likes if likes property is missing', async () => {
            const users = await helper.usersInDb();
            const newBlog = {
                title: 'fullstack is fun',
                author: 'Dan Abramov',
                url: 'https://react.dev',
                userId: users[0].id
            }

            const response = await api
                .post('/api/blogs')
                .set('Authorization', `Bearer ${token}`)
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
                .set('Authorization', `Bearer ${token}`)
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
                .set('Authorization', `Bearer ${token}`)
                .send(newBlog)
                .expect(400)

            const blogs = await helper.blogsInDb();
            assert.strictEqual(blogs.length, helper.initialBlogs.length);
        });
    });


    describe('deletion of a blog', () => {
        test('succeeds with status code 204 if id is valid', async () => {
            const blogsAtStart = await helper.blogsInDb();
            const blogToDelete = blogsAtStart[0];

            await api
                .delete(`/api/blogs/${blogToDelete.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);

            const blogsAtEnd = await helper.blogsInDb();
            const ids = blogsAtEnd.map(b => b.id);

            assert(!ids.includes(blogToDelete.id));
            assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
        });

        test('fails with status code 400 if id is invalid', async () => {
            const id = '5a3d5da59570ed08cc00010x';
            await api
                .delete(`/api/blogs/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(400);
        });

        test('succeeds with status code 204 if blog does not exist', async () => {
            const id = await helper.nonExistingId();
            await api
                .delete(`/api/blogs/${id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(204);
        });
    });

    describe('update of a blog', () => {
        test('succeeds with valid data', async () => {
            const blogsAtStart = await helper.blogsInDb()
            const blogToUpdate = blogsAtStart[0];

            const updatedBlogData = {
                title: blogToUpdate.title,
                author: blogToUpdate.author,
                url: blogToUpdate.url,
                likes: blogToUpdate.likes + 1
            }

            const response = await api
                .put(`/api/blogs/${blogToUpdate.id}`)
                .send(updatedBlogData)
                .expect(200)
                .expect('Content-Type', /application\/json/)

            assert.strictEqual(response.body.likes, blogToUpdate.likes + 1);

            const blogsAtEnd = await helper.blogsInDb();
            const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id);

            assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1);
        });

        test('fails with status code 404 if id invalid', async () => {
            const id = await helper.nonExistingId();
            const updatedBlogData = {
                title: 'Non existing blog',
                author: 'Dan Abramov',
                url: 'https://react.dev',
                likes: 10
            }

            await api
                .put(`/api/blogs/${id}`)
                .send(updatedBlogData)
                .expect(404)
        });

        test('fails with status code 400 if blog doesnt exists', async () => {
            const id = '5a3d5da59570ed08cc00010x';
            const updatedBlogData = {
                title: 'Non existing blog',
                author: 'Dan Abramov',
                url: 'https://react.dev',
                likes: 10
            }

            await api
                .put(`/api/blogs/${id}`)
                .send(updatedBlogData)
                .expect(400);
        });
    });


    after(async () => {
        await mongoose.connection.close();
    });
});