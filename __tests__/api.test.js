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

    test('can filter by category', () => {
        return request(app)
        .get(`/api/reviews/?category=dexterity`)
        .expect(200)
        .then((reviews) => {
            reviews.body.forEach(element => {
                expect(element.category).toBe('dexterity')
            })
        })
    });
   
    test('can filter by category with space', () => {
        return request(app)
        .get(`/api/reviews/?category='social deduction'`)
        .expect(200)
        .then((reviews) => {
            reviews.body.forEach(element => {
                expect(element.category).toBe('social deduction')
            })
        })
    });
    
    test('can sort asc', () => {
        return request(app)
        .get(`/api/reviews/?order=asc`)
        .expect(200)
        .then((res) => {
            let check = true
                res.body.forEach((element, i) => {
                    if (res.body[i+1] !== undefined){
                        if (res.body[i+1].created_at < element.created_at){
                            check = false
                        }
                    }
                })

            expect(check).toBe(true)
        })
    });

    test('can change the column to sort by', () => {
        return request(app)
        .get(`/api/reviews/?sort_by=comment_count`)
        .expect(200)
        .then((res) => {
            let check = true
                res.body.forEach((element, i) => {
                    if (res.body[i+1] !== undefined){
                        if (res.body[i+1].comment_count > element.comment_count){
                            check = false
                        }
                    }
                })

            expect(check).toBe(true)
        })
    });

    test('multi query', () => {
        return request(app)
        .get(`/api/reviews/?sort_by=comment_count&order=ASC&category='social deduction'`)
        .expect(200)
        .then((res) => {
            let check = true
                res.body.forEach((element, i) => {
                    if (res.body[i+1] !== undefined){
                        if (res.body[i+1].comment_count < element.comment_count){
                            check = false
                        }
                    }
                })

            expect(check).toBe(true)

            res.body.forEach(element => {
                expect(element.category).toBe('social deduction')
            })
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
                    comment_count: 0,
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

describe('7. POST /api/reviews/:review_id/comments ', () => {
    test('successfully posts comment', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({
                username: 'dav3rid',
                body: 'it was nice'
            })
            .expect(201)
            .then((res) => {
                expect(Object.keys(res.body)).toEqual(['comment_id', 'body', 'review_id', 'author', 'votes', 'created_at'])
            })
        
    });

    test('errors with non existing user', () => {
        return request(app)
            .post('/api/reviews/1/comments')
            .send({
                username: 'cool_username',
                body: 'this is a review'
            })
            .expect(400)
            .then((res) => {
                expect(res.body.msg).toBe('Bad request')
            })
    });

    test('errors on non existing review', () => {
        return request(app)
        .post('/api/reviews/100000/comments')
        .send({
            username: 'dav3rid',
            body: 'this is a review'
        })
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('review not found')
        })
    });

    test('errors on missing key in request body', () => {
        return request(app)
        .post('/api/reviews/1/comments')
        .send({
            username: 'dav3rid'
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad request')
        })
    });
});

describe('8. PATCH /api/reviews/:review_id', () => {
    test('Updates the votes by 1', () => {
        return request(app)
        .patch('/api/reviews/1')
        .send({
            inc_votes: 1
        })
        .expect(201)
        .then((res) => {
            expect(res.body.votes).toEqual(2);
        })
    });

    test('Updates the votes by more than 1', () => {
        return request(app)
        .patch('/api/reviews/1')
        .send({
            inc_votes: 5
        })
        .expect(201)
        .then((res) => {
            expect(res.body.votes).toEqual(6);
        })
    });

    test('404s on non existent ', () => {
        return request(app)
        .patch('/api/reviews/1000000')
        .send({
            inc_votes: 5
        })
        .expect(404)
        .then((res) => {
            expect(res.body.msg).toBe('review not found')
        })
    });

    test('400s on missing body key', () => {
        return request(app)
        .patch('/api/reviews/1')
        .send({
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad request');
        })
    });

    test('400s on missing body key', () => {
        return request(app)
        .patch('/api/reviews/1')
        .send({
            inc_votes: 'hola'
        })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe('Bad request');
        })
    });
});

describe('GET /api/users', () => {
    test('gets users', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then((users) => {
            expect(users.body).toEqual([
                {
                  username: 'mallionaire',
                  name: 'haz',
                  avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'
                },
                {
                  username: 'philippaclaire9',
                  name: 'philippa',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24604688?s=460&v=4'
                },
                {
                  username: 'bainesface',
                  name: 'sarah',
                  avatar_url: 'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
                },
                {
                  username: 'dav3rid',
                  name: 'dave',
                  avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
                }
              ])
        })
    });
});

describe('Delete comment by id', () => {
    test('returns 204', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });

    test('404s', () => {
        return request(app)
        .delete('/api/comments/100000000')
        .expect(404)
    });
});

describe('Get /api', () => {
    test('returns endpoints', () => {
        return request(app)
        .get('/api')
        .expect(200)
    });
});