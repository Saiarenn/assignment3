const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require("path");
const checkRole = require('./middleware/checkRoleMiddleware')
const authRouter = require('./routes/auth');
const adminRouter = require('./routes/admin');
const indexRouter = require('./routes/index');
const axios = require("axios");
const History = require("./models/UserHistory")
const jwt = require("jsonwebtoken");
const {jwtToken} = require("./models/jwt");


const app = express();

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

mongoose.connect('mongodb+srv://admin:0000@cluster0.27pnvto.mongodb.net/?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true, writeConcern: {w: 'majority'},})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use('/', authRouter);
app.use('/admin', checkRole(), adminRouter);
app.use('/', indexRouter);


app.post('/getCurrency', async (req, res) => {
    const code = req.body.code;
    const token = req.headers.authorization.split(' ')[1];
    try {
        const {user} = jwt.verify(token, 'your-secret-key');
        const currencyApiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
        const currencyResponse = await axios.get(currencyApiUrl);
        const currencyData = currencyResponse.data.rates;

        await History.create({
            user: user.id,
            method: 'POST',
            endpoint: '/getCurrency',
            parameters: {code},
            outcome: 'Success'
        });

        res.json(currencyData[code]);
    } catch (error) {
        console.error('Error fetching currency data: ', error);

        await History.create({
            user: user.id,
            method: 'POST',
            endpoint: '/getCurrency',
            parameters: {code},
            outcome: 'Error'
        });

        res.status(500).send('Internal Server Error');
    }
});

app.get('/photo', async (req, res) => {
    const apiKey = "30856833-7403c4fca5957f3a24a6fce79";
    const city = req.query.city;
    const apiUrl = `https://pixabay.com/api/?key=${apiKey}&q=${city}&image_type=photo`;
    const token = req.headers.authorization.split(' ')[1];
    const {user} = jwt.verify(token, 'your-secret-key')

    const response = await axios.get(apiUrl);
    const data = response.data;

    const currencyApiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
    const currencyResponse = await axios.get(currencyApiUrl);
    const currencyData = currencyResponse.data.rates;
    

    try {
        const response = await axios.get(apiUrl);
        const data = response.data.hits[0];

        await History.create({
            user: user.id,
            method: 'GET',
            endpoint: '/photo',
            parameters: {city},
            outcome: 'Success'
        });

        res.json(data);
    } catch (error) {
        console.error('Error fetching photo: ', error);

        await History.create({
            user: req.user._id,
            method: 'GET',
            endpoint: '/photo',
            parameters: {city},
            outcome: 'Error'
        });

        res.status(500).send('Internal Server Error');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
