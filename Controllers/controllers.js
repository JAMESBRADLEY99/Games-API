const { selectCategories, selectReviews } = require('../Models/models.js');

exports.getCategories = (req, res) => {
    
    selectCategories()
    .then((categories) => {
        return res.send(categories)
    })
}

exports.getReviews = (req, res) => {
    selectReviews()
    .then((reviews) => {
        console.log(reviews)
        return res.send(reviews)
    })
}