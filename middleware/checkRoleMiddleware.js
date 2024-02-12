const jwt = require('jsonwebtoken');
let jwtStore = require('../models/jwt');

module.exports = function () {
    return function (req, res, next) {
        if (req.method === "OPTIONS") {
            next()
        }

        try {
            const token = jwtStore.jwtToken
            if (!token) {
                res.status(401).json({ message: "Not authorized" })
            }
            const decoded = jwt.verify(token, 'your-secret-key')

            if (!decoded.user.isAdmin) {
                return res.status(403).json({ message: "You do not have an access" })
            }
            req.user = decoded
            next()
        } catch (error) {
            res.status(401).json({ message: "Not authorized" })
        }
    }
}