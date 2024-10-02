const bodyParser = require('body-parser');
const express = require('express'); 
const session = require('express-session');
const routes = require('./routes/router');
const net = require('net');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

///// LOGIN SESSION /////
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // TRUE IF USING HTTPS
}));

///// LOGIN AUTHENTICATION /////
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

///// MIDDLEWARE /////
app.use('/index', checkAuth);
app.use('/users', checkAuth);
app.use('/add', checkAuth);
app.use('/update/:id', checkAuth);
app.use('/delete/:id', checkAuth);

app.get('/', (req, res) => {
    res.redirect('/login');
});
app.use('/', routes);

///// FOR RANDOM PORT /////
const getRandomPort = () => {
    return Math.floor(Math.random() * (4000 - 3000 + 1)) + 3000;
};
const findAvailablePort = (port, callback) => {
    const server = net.createServer();
    server.listen(port, () => {
        server.close(() => callback(port));
    });
    server.on('error', () => {
        findAvailablePort(getRandomPort(), callback);
    });
};
findAvailablePort(getRandomPort(), (port) => {
    app.listen(port, () => {
        console.log(`Server initialized on http://localhost:${port}`);
    });
});
