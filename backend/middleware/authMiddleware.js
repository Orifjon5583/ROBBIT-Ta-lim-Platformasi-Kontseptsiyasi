const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');

const protect = (req, res, next) => {
    let token;

    // 1. Headerda "Authorization: Bearer <token>" borligini tekshiramiz
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Tokenni ajratib olamiz
            token = req.headers.authorization.split(' ')[1];

            // Tokenni tekshiramiz va ichidagi ma'lumotni (id, name, isAdmin) o'qiymiz
            const decoded = jwt.verify(token, JWT_SECRET);

            // Ma'lumotni so'rov (req) obyektiga qo'shamiz, keyingi funksiyalar ishlatishi uchun
            req.user = decoded;

            next(); // Ruxsat beramiz, keyingi bekatga o't
        } catch (error) {
            return res.status(401).json({ message: 'Token yaroqsiz yoki muddati tugagan.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Token topilmadi, iltimos tizimga kiring.' });
    }
};

module.exports = { protect };