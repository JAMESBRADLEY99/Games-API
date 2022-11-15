const { selectCategories, selectReviews, selectReviewById, selectCommentsByReviewId } = require('../Models/models.js');

exports.getCategories = (req, res) => {
    
    selectCategories()
    .then((categories) => {
        return res.send(categories)
    })
}

exports.getReviews = (req, res) => {
    selectReviews()
    .then((reviews) => {
        return res.send(reviews)
    })
}

exports.getReviewsById = (req, res, next) => {
    selectReviewById(req.params.review_id)
    .then((review) => {
        return res.send(review)
    })
    .catch((err) => next(err))
}

exports.getCommentsByReviewId = (req, res, next) => {
    selectCommentsByReviewId(req.params.review_id)
    .then((comments) => {
        return res.send(comments)
    })
    .catch((err) => next(err))
}