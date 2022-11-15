const request = require('supertest')
const pool = require('../db/connection.js')
const app = require('../index.js')
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data')


beforeEach(() => {
    return seed(data)
})

afterAll(() => {
    return pool.end()
});

describe('GET /api/categories', () => {
    test('gets categories ', () => {
        return request(app)
            .get('/api/categories')
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(4);
                res.body.forEach(element => {
                    expect(typeof element.slug).toBe('string')
                    expect(typeof element.description).toBe('string')
                });
            })
    });

    test('404s', () => {
        return request(app)
            .get('/api/categoryes')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('Ooops, nothing to see here!')
            })
    });
});

describe('GET /api/reviews', () => {
    test('gets reviews in the correct format', () => {
        return request(app)
            .get('/api/reviews')
            .expect(200)
            .then((res) => {
                expect(res.body.length).toBe(13)
                res.body.forEach(element => {
                    expect(Object.keys(element).length).toBe(9);
                    expect(typeof element.owner).toBe('string')
                    expect(isNaN(element.comment_count)).toBe(false)
                });

                let check = true
                res.body.forEach((element, i) => {
                    if (res.body[i+1] !== undefined){
                        if (res.body[i+1].created_at > element.created_at){
                            check = false
                        }
                    }
                })

                expect(check).toBe(true)
            })
    });

    test('404s', () => {
        return request(app)
            .get('/api/rewies')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('Ooops, nothing to see here!')
            })
    });
});

describe(' GET /api/reviews/:review_id', () => {
    test('returns correct review', () => {
        return request(app)
            .get('/api/reviews/1')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual({
                    review_id: 1,
                    title: 'Agricola',
                    category: 'euro game',
                    designer: 'Uwe Rosenberg',
                    owner: 'mallionaire',
                    review_body: 'Farmyard fun!',
                    review_img_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
                    created_at: '2021-01-18T10:00:20.514Z',
                    votes: 1
                  })
            })
    });

    test('404s on non existent id', () => {
        return request(app)
            .get('/api/reviews/1000')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('Ooops, nothing to see here!')
            })
    });
});

describe(' 6. GET /api/reviews/:review_id/comments', () => {
    test('returns correct comments', () => {
        return request(app)
            .get('/api/reviews/2/comments')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual([
                    {
                      comment_id: 5,
                      body: 'Now this is a story all about how, board games turned my life upside down',
                      review_id: 2,
                      author: 'mallionaire',
                      votes: 13,
                      created_at: '2021-01-18T10:24:05.410Z'
                    },
                    {
                      comment_id: 1,
                      body: 'I loved this game too!',
                      review_id: 2,
                      author: 'bainesface',
                      votes: 16,
                      created_at: '2017-11-22T12:43:33.389Z'
                    },
                    {
                      comment_id: 4,
                      body: 'EPIC board game!',
                      review_id: 2,
                      author: 'bainesface',
                      votes: 16,
                      created_at: '2017-11-22T12:36:03.389Z'
                    }
                  ])
            })
    });

    test('with commentless review', () => {
        return request(app)
            .get('/api/reviews/1/comments')
            .expect(200)
            .then((res) => {
                expect(res.body).toEqual([])
            })
    });

    test('404s on non existent id', () => {
        return request(app)
            .get('/api/reviews/10000/comments')
            .expect(404)
            .then((res) => {
                expect(res.body.msg).toBe('Ooops, nothing to see here!')
            })
    });
});