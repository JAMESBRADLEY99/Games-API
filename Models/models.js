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