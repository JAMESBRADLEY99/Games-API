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
    });
});