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
            `SELECT * FROM comments WHERE review_id = $1`, [review_id]
        ).then((comments) => {
            if (comments.rows.length === 0){
                return {msg: 'no comments for review'}
            }
            return comments.rows
        })
    })
}