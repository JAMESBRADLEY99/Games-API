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