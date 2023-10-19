module.exports = (validateFunction) => {
    return function (req, res, next) {
        const error = validateFunction(req.body)
        if (error) return res.status(400).send(error.details.at(0).message)
        next()
    }
}