const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const History = require('../models/UserHistory');


router.post('/add-user', async (req, res) => {
    try {
        const { username, password, isAdmin } = req.body;
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            password,
            isAdmin
        });
        console.log(user)
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/edit-user/:id', async (req, res) => {
    try {
        const { username, isAdmin } = req.body;
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.username = username;
        user.isAdmin = isAdmin;
        user.updatedAt = Date.now();

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/delete-user/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.deletedAt = Date.now();

        await user.save();
        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/history', async (req, res) => {
    try {
        const history = await History.find().populate('user', 'username');
        res.render('history', { history });
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
