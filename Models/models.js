const db = require('../db/connection.js')

exports.selectCategories = () => {
    return db.query(
        `SELECT * FROM categories;`
    )
    .then((categories) => {
        return categories.rows
    })
}

exports.selectReviews = () => {
    return db.query(
        `SELECT reviews.owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.created_at) as comment_count
        FROM reviews
        LEFT JOIN comments ON reviews.review_id = comments.review_id
        GROUP BY (reviews.owner,title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer)
        ORDER BY reviews.created_at DESC;`
    ).then((reviews) => {
        return reviews.rows
    })
}

exports.selectReviewById = (review_id) => {
    return db.query(
        `SELECT * FROM reviews WHERE review_id = $1`, [review_id]
    ).then((review) => {
        if (review.rows[0] === undefined){
            return Promise.reject({status: 404, msg: 'Ooops, nothing to see here!'})
        }
        return review.rows[0]
    })
}

exports.selectCommentsByReviewId = (review_id) => {
    return db.query(
        `SELECT * FROM reviews WHERE review_id = $1`, [review_id]
    ).then((review) => {
        if (review.rows[0] === undefined){
            return Promise.reject({status: 404, msg: 'Ooops, nothing to see here!'})
        }
        return db.query(
            `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC`, [review_id]
        ).then((comments) => {
            return comments.rows
        })
    })
}

exports.addComment = (review_id, input) => {
    const body = input.body;
    const username = input.username;
    return db.query(
        `INSERT INTO comments (body, review_id, author)
        VALUES ($1, $2, $3)
        RETURNING *;`, [body, review_id, username]
    ).then((res) => {
        return res.rows[0]
    }).catch((err) => {
        if (err.detail.includes('is not present in table "reviews"')) {
            return Promise.reject({status:404, msg:'review not found'})
        }
        return Promise.reject({status: 400, msg: 'Bad request'})
    })
}

exports.updateReviewVotes = (review_id, increment) => {
    return db.query(
        `UPDATE reviews
        SET votes = votes + $2
        WHERE review_id = $1
        RETURNING *;`, [review_id, increment]
    )
    .then((review) => {
        if (review.rows[0] === undefined){
            return Promise.reject({status: 404, msg:'review not found'})
        }
        return review.rows[0]})
    .catch((err) => {
        if (err.status === 404){
            return Promise.reject(err)
        }
        return Promise.reject({status: 400, msg: 'Bad request'})
    })
}

exports.selectUsers = () => {
    return db.query('SELECT * FROM users')
    .then((users) => {
        return users.rows
    })
}