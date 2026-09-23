const _ = require('lodash');

const dummy = (blogs) => {
    return 1;
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favoriteBlog = (blogs) => {
    return blogs.length === 0
        ? null
        : blogs.reduce((fav, blog) => {
            return blog.likes > fav.likes ? blog : fav;
        }, blogs[0]);
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) return null;

    const groupedAuthors = _.groupBy(blogs, 'author');
    const authorCounts = _.map(groupedAuthors, (authorBlogs, authorName) => {
        return {
            author: authorName,
            blogs: authorBlogs.length
        }
    });

    return _.maxBy(authorCounts, 'blogs');
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) return null;

    const groupedAuthors = _.groupBy(blogs, 'author');
    const authorCounts = _.map(groupedAuthors, (authorBlogs, authorName) => {
        return {
            author: authorName,
            likes: authorBlogs.reduce((sum, blog) => sum + blog.likes, 0)
        }
    });
    
    return _.maxBy(authorCounts, 'likes');
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}