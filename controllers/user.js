// User Controller.
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { normalizeErrors } = require('../helpers/mongoose');
const config = require('../config');

// Handling authentication function.
exports.auth = function (req, res) {
    const { username, password } = req.body;

    if (!password || !username) {
        return res.status(422).send({ errors: [{ title: 'Missing data!', detail: 'Please provide username and password!' }] });
    }

    User.findOne({ username }, function (err, user) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }

        if (!user) {
            return res.status(422).send({ errors: [{ title: 'Invalid User!', detail: 'User does not exist!' }] });
        }

        if (user.hasSamePassword(password)) {
            const token = jwt.sign({
                userId: user.id,
                username: user.username
            }, config.SECRET, { expiresIn: '1h' });

            return res.json(token);
        }
        else {
            return res.status(422).send({ errors: [{ title: 'Invalid Data!', detail: 'Username and password do not match!' }] });
        }
    });
}


// Handling register function.
exports.register = function (req, res) {
    const { username, password, passwordConfirmation } = req.body;

    if (!password || !username) {
        return res.status(422).send({ errors: [{ title: 'Missing data!', detail: 'Please provide username and password!' }] });
    }

    if (password !== passwordConfirmation) {
        return res.status(422).send({ errors: [{ title: 'Invalid Password!', detail: 'Please provide same password!' }] });
    }
    User.findOne({ username }, function (err, existingUser) {
        if (err) {
            return res.status(422).send({ errors: normalizeErrors(err.errors) });
        }
        if (existingUser) {
            return res.status(422).send({ errors: [{ title: 'Invalid username!', detail: 'Username already taken!' }] });
        }

        // Note key : key can be written just as key.
        const user = new User({
            username, password
        });
        user.save(function (err) {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }
            return res.json({ 'registered': username })
        });
    })
}

// Middleware to check authentication.
exports.authMiddleware = function (req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        const user = parseToken(token);

        User.findById(user.userId, function (err, user) {
            if (err) {
                return res.status(422).send({ errors: normalizeErrors(err.errors) });
            }

            if (user) {
                req.user = user;
                res.locals.user = user;
                next();
            }
            else {
                // If token is altered.
                // Prevents unauthorized access in case token got stoken or hacked.
                return res.status(422).send({ errors: [{ title: 'Not authorized!', detail: 'Invalid token credentials!' }] });
            }
        });
    }
    else {
        // If no token is found.
        return res.status(422).send({ errors: [{ title: 'Not authorized!', detail: 'Please login!' }] });
    }
}

// Decode the token.
function parseToken(token) {
    // It returns 'Bearer skdjksjd4445454dfd5f4...........'
    // We do not need Bearer, so split it out.
    try {
        return jwt.verify(token.split(' ')[1], config.SECRET);
    }
    catch (err) {
        // Just for debugging.
        console.log(err.name, err.message);
        // Return some invalid token.
        return 'invalid';
    }
}
