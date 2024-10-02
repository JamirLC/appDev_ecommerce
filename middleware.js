// middleware.js
const checkAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.redirect('/'); // Redirect to homepage if not admin
};

module.exports = { checkAuth, isAdmin }; // Export both middleware functions
