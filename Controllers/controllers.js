const { selectCategories, selectReviews, selectReviewById } = require('../Models/models.js');

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