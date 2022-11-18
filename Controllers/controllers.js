const { selectCategories, selectReviews, selectReviewById, selectCommentsByReviewId, addComment, updateReviewVotes, selectUsers, dropComment } = require('../Models/models.js');
const endpoints = require('../endpoints.json')
exports.getApi = (req, res) => {
    return res.send({body: endpoints})
}

exports.getCategories = (req, res) => {
    
    selectCategories()
    .then((categories) => {
        return res.send(categories)
    })
}

exports.getReviews = (req, res) => {
    selectReviews(req.query.order, req.query.sort_by, req.query.category)
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
    selectCommentsByReviewId(Number(req.params.review_id))
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

exports.deleteComment = (req, res, next) => {
    dropComment(req.params.comment_id)
    .then(() => res.status(204).send())
    .catch((err) => next(err))
}