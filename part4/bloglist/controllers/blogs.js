const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({});
    response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
    const blog = new Blog(request.body)
    const savedBlog = await blog.save();
    
    response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
    await Blog.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

blogRouter.put('/:id', async (request, response, next) => {
    const { title, author, likes, url } = request.body;
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {title, author, likes, url}, { new: true });
    
    if(!updatedBlog)
        return response.status(404).send({ error: 'blog not found' })

    response.status(200).json(updatedBlog);
});

module.exports = blogRouter;