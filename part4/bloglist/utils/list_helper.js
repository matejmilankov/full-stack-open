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
    console.log(_.maxBy(authorCounts, 'blogs'));
    return _.maxBy(authorCounts, 'blogs');
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}