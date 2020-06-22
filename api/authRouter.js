const express = require("express");
const router = express.Router();
const Helpers = require("../utils/helpers");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require('../utils/jwtConfig')

router.post("/register", (req, res) => {
    const { email, password, first_name, last_name } = req.body;
    const rounds = process.env.HASH_ROUNDS || 12;
    const hashed = bcrypt.hashSync(password, rounds);
    const user = { email, password: hashed, first_name, last_name };

    Helpers.addUser(user)
    .then((u) => {
        res.status(201).json(u)
    })
    .catch((err) => res.status(500).json({ error: err }));

});

router.post("/login", (req, res) => {
    const { email, password } = req.body
    //checks to make sure email and password are present
    !email
    ? res.status(400).json({ message: "must include your email!" })
    : !password
    ? res.status(400).json({ message: "must include your password!" })
    : !email && !password
    ? res.status(400).json({ message: "Must include your email and password!" })
    : //if password and email are included, proceed to authenitcation
    Helpers.login(req.body)
    .then(([user]) => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            const token = generateToken({
                id: user.id,
                email: user.email,
            });

            res.status(200).json({
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                },
                message: `Welcome back, ${user.first_name}!`,
                token,
            });
        } else {
            res.status(401).json({ message: "no"});
        }
    })
    .catch((err) => res.status(500).json({ error: err }))

})

//generates JWT token

function generateToken(payload) {
    return jwt.sign(payload, config.secret, config.options)
}

module.exports = router;