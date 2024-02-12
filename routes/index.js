const User = require('../models/User');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtToken } = require("../models/jwt");

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/main', (req, res) => {
    res.render('main');
});

router.get('/admin', async (req, res) => {
    const users = await User.find();
    res.render('admin', { users });
});

router.get('/currency', async (req, res) => {
    res.render('currency');
});



module.exports = router;
