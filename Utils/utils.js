const db = require('../db/connection.js')

exports.checkComment = (id) => {
    return db.query('SELECT * FROM comments WHERE comment_id = $1', [id])
    .then((comm) => {
        if (comm.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'reveiw does not exist'})
        }
    })
}