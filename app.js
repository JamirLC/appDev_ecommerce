const bodyParser = require('body-parser');
const express = require('express'); 
const session = require('express-session');
const routes = require('./routes/router');
const app = express();
const PORT = 8080;

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

app.listen(PORT, () => {
    console.log(`Server initialized on http://localhost:${PORT}`);
});
