const { selectCategories, selectReviews, selectReviewById, selectCommentsByReviewId, addComment, updateReviewVotes, selectUsers } = require('../Models/models.js');

exports.getCategories = (req, res) => {
    
    selectCategories()
    .then((categories) => {
        return res.send(categories)
    })
}

exports.getReviews = (req, res) => {
    selectReviews(req.query.order, req.query.sort_by, req.query.category)
    .then((reviews) => {
        // if (req.query.category !== undefined){
        //     reviews = reviews.filter((i) => i.category === req.query.category)
        // }
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

exports.postComment = (req, res, next) => {
    addComment(req.params.review_id ,req.body)
    .then((response) => {
        return res.status(201).send(response)
    })
    .catch((err) => next(err))
}

exports.patchReviewVotes = (req, res, next) => {
    updateReviewVotes(req.params.review_id, req.body.inc_votes)
    .then((response) => {
        return res.status(201).send(response)
    })
    .catch((err) => next(err))
}

exports.getUsers = (req, res) => {
    selectUsers()
    .then((users) => {
        res.send(users)})
}