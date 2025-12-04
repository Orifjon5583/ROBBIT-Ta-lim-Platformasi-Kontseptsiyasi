const requireAdmin = (req, res, next) => {
    // `protect` middleware'i allaqachon `req.user`ni yaratib bergan bo'lishi kerak
    if (req.user && req.user.isAdmin) {
        next(); // Admin ekan, ruxsat beramiz
    } else {
        res.status(403).json({ message: "Bu amalni bajarish uchun Admin huquqi talab qilinadi." });
    }
};

module.exports = { requireAdmin };