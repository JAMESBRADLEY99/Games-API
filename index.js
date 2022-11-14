const express = require('express');
const { getCategories } = require('./Controllers/controllers.js')

const app = express();

app.use(express.json());

app.get('/api/categories', getCategories)

app.all("/*", (req, res) => {
    res.status(404).send({ msg: "Ooops: Noting to see here." });
  });

module.exports = app;