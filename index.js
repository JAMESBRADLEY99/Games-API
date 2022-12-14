const express = require('express');
const { getCategories, getReviews, getReviewsById, getCommentsByReviewId, postComment, patchReviewVotes, getUsers, deleteComment, getApi} = require('./Controllers/controllers.js')



const app = express();

app.use(express.json());

app.get('/api', getApi)

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.get('/api/reviews/:review_id', getReviewsById)

app.get('/api/reviews/:review_id/comments', getCommentsByReviewId)

app.post('/api/reviews/:review_id/comments', postComment)

app.patch('/api/reviews/:review_id', patchReviewVotes)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
  if (err){
    res.status(err.status).send({msg: err.msg})
  } else {
    next()
  }
})

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Ooops, nothing to see here!" });
  });

// app.listen((8080), () => console.log('app listening on PORT 8080'))

module.exports = app;
