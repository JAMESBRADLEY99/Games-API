const express = require('express');
const { getCategories, getReviews, getReviewsById, getCommentsByReviewId, postComment } = require('./Controllers/controllers.js')

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewsById)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

app.post('/api/reviews/:review_id/comments', postComment)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Ooops: Noting to see here." });
  });

app.use = (err, req, res, next) => {
  
  if (err){
    res.status(err.status).send(err.msg)
  }
  next()
}

module.exports = app;