const getUniqueFileName = require('../utils/unique_filename')

module.exports = (req, res, next) => {
    req.newFileName = getUniqueFileName()
    next()
}