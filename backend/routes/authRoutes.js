const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database.js');
const { JWT_SECRET } = require('../config.js');

// Promise yordamchisi
const db_get = (sql, params) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => err ? reject(err) : resolve(row));
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Maydonlarni to'ldiring." });

    try {
        const user = await db_get('SELECT * FROM users WHERE email = ?', [email]);
        
        if (!user || !(await bcrypt.compare(password, user.password_hash))) {
            return res.status(401).json({ message: "Email yoki parol noto'g'ri." });
        }

        const token = jwt.sign({ id: user.id, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, userName: user.name });
    } catch (e) {
        res.status(500).json({ message: "Server xatoligi." });
    }
});

module.exports = router;