const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { userExtractor } = require('../utils/middleware');


blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogRouter.post('/', userExtractor, async (request, response) => {
    const body = request.body;
    const user = request.user;

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes || 0,
        user: user._id
    });

    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user;

    const blog = await Blog.findById(request.params.id);
    if (!blog)
        return response.status(204).end();

    if(blog.user.toString() !== user.id.toString())
        return response.status(401).json({ error: 'only the creator can delete this blog' });

    await blog.deleteOne();
    response.status(204).end();
});

blogRouter.put('/:id', userExtractor, async (request, response) => {
    const { title, author, likes, url, user } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
        request.params.id, 
        {title, author, likes, url, user: user.id}, 
        { returnDocument: 'after' }
    ).populate('user', { username: 1, name: 1 });
    
    if(!updatedBlog)
        return response.status(404).send({ error: 'blog not found' })

    response.status(200).json(updatedBlog);
});

module.exports = blogRouter;