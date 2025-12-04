const express = require('express');
const router = express.Router();
const db = require('../database.js');
const { protect } = require('../middleware/authMiddleware.js');

router.post('/save-attempt', protect, (req, res) => {
    const userId = req.user.id;
    const { task_type, score, wpm, accuracy } = req.body;

    if (task_type === undefined || score === undefined) return res.status(400).json({ message: "Ma'lumot yetishmayapti" });

    db.serialize(() => {
        // 1. Oxirgi urinishni topish
        db.get(`SELECT score FROM attempts WHERE user_id = ? AND task_type = ? ORDER BY id DESC LIMIT 1`, [userId, task_type], (err, lastAttempt) => {
            if (err) return res.status(500).json({ message: "Xatolik" });

            let xp_earned = 0;
            if (lastAttempt) {
                if (score > lastAttempt.score) xp_earned = 3;       // O'sish
                else if (score < lastAttempt.score) xp_earned = -3; // Pasayish
                // Teng bo'lsa 0
            } else {
                xp_earned = 3; // Birinchi urinishga +3
            }

            // 2. Natijani saqlash
            const insertParams = [userId, task_type, score, wpm || null, accuracy || null, xp_earned];
            db.run(`INSERT INTO attempts (user_id, task_type, score, wpm, accuracy, bonus_points) VALUES (?, ?, ?, ?, ?, ?)`, insertParams, function(err) {
                if (err) return res.status(500).json({ message: "Saqlashda xatolik" });
                
                // 3. Foydalanuvchi umumiy XP sini yangilash
                db.run(`UPDATE users SET total_score = total_score + ? WHERE id = ?`, [xp_earned, userId], (updateErr) => {
                    if (updateErr) return res.status(500).json({ message: "XP yangilashda xatolik" });
                    
                    res.json({ message: "Natija saqlandi!", xpEarned: xp_earned });
                });
            });
        });
    });
});

module.exports = router;