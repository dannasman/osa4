const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.map(b => b.likes).reduce((a, b) => {
        return a + b
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((a, b) => {
        return (a.likes > b.likes) ? a : b
    })
}

const mostBlogs = (blogs) => {
    const result = lodash.map(lodash(blogs.map(b => b.author))
        .countBy().entries().maxBy(lodash.last))
    return { 'author': result[0], 'blogs': result[1] }
}

const mostLikes = (blogs) => {
    return lodash(blogs).groupBy('author').map((o, k) => ({
        'author': k,
        'likes': lodash.sumBy(o, 'likes')
    })).value().reduce((a, b) => {
        return (a.likes > b.likes) ? a : b
    })
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}