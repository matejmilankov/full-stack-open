const Blog = require('../models/blog');

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

const nonExistingId = async () => {
    const blog = new Blog({
        title: 'I am gonna become full-stack',
        author: 'Matej Milankov',
        url: 'https://react.dev',
        likes: 20
    });
    await blog.save();
    await blog.deleteOne();

    return blog._id.toString();
}

const blogsInDb = async () => {
    const blogs = await Blog.find({});
    return blogs.map(b => b.toJSON());
}

module.exports = {
    initialBlogs,
    blogsInDb,
    nonExistingId
}