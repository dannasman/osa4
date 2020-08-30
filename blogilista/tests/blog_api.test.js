const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all notes are returned', async () => {
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })

    test('the name of the identifying field is correct', async () => {
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0].id).toBeDefined()
    })
})

describe('addition of a new blog', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        await User.deleteMany({})
    })

    test('a valid blog can be added ', async () => {
        const hash = await bcrypt.hash('test', 10)

        const user = new User(
            {
                username: 'dan',
                name: 'Dan Näsman',
                passwordHash: hash
            }
        )

        const savedUser = await user.save()

        const newBlog = {
            'title': 'test1',
            'author': 'Rohtau',
            'url': 'test.com',
            'likes': 6,
            'userId': savedUser.id
        }

        const response = await api
            .post('/api/login')
            .send({ username: savedUser.username, password: 'test' })

        const token = response.body.token

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    })

    test('likes equals to zero if not given a value', async () => {
        const hash = await bcrypt.hash('test', 10)

        const user = new User(
            {
                username: 'dan',
                name: 'Dan Näsman',
                passwordHash: hash
            }
        )

        const savedUser = await user.save()

        const newBlog = {
            'title': 'test1',
            'author': 'Rohtau',
            'url': 'test.com',
            'userId': savedUser.id
        }

        const response = await api
            .post('/api/login')
            .send({ username: savedUser.username, password: 'test' })

        const token = response.body.token

        const result = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + `${token}`)
            .send(newBlog).expect(201)

        expect(result.body.likes).toEqual(0)
    })

    test('blog without title and/or url does not go through', async () => {

        const hash = await bcrypt.hash('test', 10)

        const user = new User(
            {
                username: 'dan',
                name: 'Dan Näsman',
                passwordHash: hash
            }
        )

        const savedUser = await user.save()

        const newBlog = {
            'author': 'Rohtau',
        }

        const response = await api
            .post('/api/login')
            .send({ username: savedUser.username, password: 'test' })

        const token = response.body.token

        await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + `${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('deletion of a blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)

        await User.deleteMany({})
    })
    test('is successfull', async () => {
        const hash = await bcrypt.hash('test', 10)

        const user = new User(
            {
                username: 'dan',
                name: 'Dan Näsman',
                passwordHash: hash
            }
        )

        const savedUser = await user.save()

        const response = await api
            .post('/api/login')
            .send({ username: savedUser.username, password: 'test' })

        const token = response.body.token

        const newBlog = {
            'title': 'test1',
            'author': 'Rohtau',
            'url': 'test.com',
            'likes': 6,
            'userId': savedUser.id
        }

        const blogToDelete = await api
            .post('/api/blogs')
            .set('Authorization', 'bearer ' + `${token}`)
            .send(newBlog)

        console.log(blogToDelete.body.id)

        await api
            .delete(`/api/blogs/${blogToDelete.body.id}`)
            .set('Authorization', 'bearer ' + `${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length
        )

    })
})

describe('updating a blog', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(helper.initialBlogs)
    })
    test('succeeds', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToBeUpdated = blogsAtStart[0]

        const content = {
            title: 'hmm',
            author: 'hmm',
            url: 'hmm',
            likes: 'hmm'
        }

        await api
            .put(`/api/blogs/${blogToBeUpdated.id}`, content)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[0]).not.toMatchObject(blogsAtStart[0])

    })
})

afterAll(() => {
    mongoose.connection.close()
})