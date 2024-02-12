const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
let jwtStore = require('../models/jwt')

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        let user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid password' });
        }

        const payload = {
            user: {
                id: user.id,
                username: user.username,
                isAdmin: user.isAdmin
            }
        };

        jwt.sign(
            payload,
            'your-secret-key',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                jwtStore.jwtToken = token;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
