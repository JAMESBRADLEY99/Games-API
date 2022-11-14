const express = require('express');
const { getCategories, getReviews } = require('./Controllers/controllers.js')

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories)

app.get('/api/reviews', getReviews)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Ooops: Noting to see here." });
  });

module.exports = app;