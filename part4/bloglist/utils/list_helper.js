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

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}