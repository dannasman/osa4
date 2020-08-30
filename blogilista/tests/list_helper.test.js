const listHelper = require('../utils/list_helper')

const blogs = [
    {
        '_id': '5a422a851b54a676234d17f7',
        'title': 'React patterns',
        'author': 'Michael Chan',
        'url': 'https://reactpatterns.com/',
        'likes': 7,
        '__v': 0
    },
    {
        '_id': '5a422aa71b54a676234d17f8',
        'title': 'Go To Statement Considered Harmful',
        'author': 'Edsger W. Dijkstra',
        'url': 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        'likes': 5,
        '__v': 0
    },
    {
        '_id': '5a422b3a1b54a676234d17f9',
        'title': 'Canonical string reduction',
        'author': 'Edsger W. Dijkstra',
        'url': 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        'likes': 12,
        '__v': 0
    },
    {
        '_id': '5a422b891b54a676234d17fa',
        'title': 'First class tests',
        'author': 'Robert C. Martin',
        'url': 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        'likes': 10,
        '__v': 0
    },
    {
        '_id': '5a422ba71b54a676234d17fb',
        'title': 'TDD harms architecture',
        'author': 'Robert C. Martin',
        'url': 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        'likes': 0,
        '__v': 0
    },
    {
        '_id': '5a422bc61b54a676234d17fc',
        'title': 'Type wars',
        'author': 'Robert C. Martin',
        'url': 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        'likes': 2,
        '__v': 0
    }
]

test('dummy returns one', () => {

    const result = listHelper.dummy([])
    expect(result).toBe(1)
})

describe('sum', () => {
    test('of empty list is zero', () => {
        const blogs = []
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(0)
    })
    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes([
            {
                'title': 'test1',
                'author': 'Rohtau',
                'url': 'test.com',
                'likes': 6
            }
        ])
        expect(result).toBe(6)
    })
    test('of a bigger list is calculated right', () => {
        const result = listHelper.totalLikes(blogs)
        expect(result).toBe(36)
    })

    describe('Blog with most likes', () => {
        test('should be returned', () => {
            const result = listHelper.favoriteBlog(blogs)
            expect(result).toEqual(
                {
                    '_id': '5a422b3a1b54a676234d17f9',
                    'title': 'Canonical string reduction',
                    'author': 'Edsger W. Dijkstra',
                    'url': 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
                    'likes': 12,
                    '__v': 0
                }
            )
        })
        test('should be returned (one from blogs with same amount of likes)', () => {
            const result = listHelper.favoriteBlog(blogs)
            expect(result.likes).toBe(12)
        })
    })

    describe('author with most blogs', () => {
        test('should be returned', () => {
            const result = listHelper.mostBlogs(blogs)
            expect(result).toEqual(
                {
                    'author': 'Robert C. Martin',
                    'blogs': 3
                }
            )
        })
    })

    describe('author with most likes', () => {
        test('should be returned', () => {
            const result = listHelper.mostLikes(blogs)
            expect(result.likes).toBe(17)
        })
    })
})