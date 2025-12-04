const express = require('express');
const router = express.Router();
const db = require('../database.js');
const { protect } = require('../middleware/authMiddleware.js');

// Guruhlarim ro'yxati
router.get('/my-groups', protect, (req, res) => {
    const userId = req.user.id;
    const sql = `SELECT g.id, g.name FROM groups g JOIN user_groups ug ON g.id = ug.group_id WHERE ug.user_id = ?`;
    db.all(sql, [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: "Xatolik" });
        res.json(rows);
    });
});

// Bitta guruh nomi
router.get('/:id', protect, (req, res) => {
    db.get(`SELECT id, name FROM groups WHERE id = ?`, [req.params.id], (err, row) => {
        if (err || !row) return res.status(404).json({ message: "Guruh topilmadi" });
        res.json(row);
    });
});

// REYTING JADVALI (Yakuniy Mantiq)
router.get('/:id/members', protect, (req, res) => {
    const groupId = req.params.id;
    const sql = `
        SELECT
            u.id, u.name, u.total_score,
            
            -- Typing: Oxirgi ball va Jami XP
            (SELECT score FROM attempts WHERE user_id = u.id AND task_type = 'typing' ORDER BY id DESC LIMIT 1) as typing_last_score,
            (SELECT SUM(bonus_points) FROM attempts WHERE user_id = u.id AND task_type = 'typing') as typing_total_xp,

            -- Comp Lit: Oxirgi ball va Jami XP
            (SELECT score FROM attempts WHERE user_id = u.id AND task_type = 'comp_lit' ORDER BY id DESC LIMIT 1) as comp_lit_last_score,
            (SELECT SUM(bonus_points) FROM attempts WHERE user_id = u.id AND task_type = 'comp_lit') as comp_lit_total_xp,

            -- Quiz: Oxirgi ball va Jami XP
            (SELECT score FROM attempts WHERE user_id = u.id AND task_type = 'quiz' ORDER BY id DESC LIMIT 1) as quiz_last_score,
            (SELECT SUM(bonus_points) FROM attempts WHERE user_id = u.id AND task_type = 'quiz') as quiz_total_xp
            
        FROM users u
        JOIN user_groups ug ON u.id = ug.user_id
        WHERE ug.group_id = ?
        ORDER BY u.total_score DESC
    `;

    db.all(sql, [groupId], (err, rows) => {
        if (err) return res.status(500).json({ message: "Reyting xatoligi" });
        
        const results = rows.map(row => ({
            id: row.id, name: row.name, total_score: row.total_score || 0,
            
            typing_score: row.typing_last_score !== null ? row.typing_last_score : '-',
            typing_bonus: row.typing_total_xp || 0, // Frontend 'bonus' nomini kutadi, biz unga XP yig'indisini beramiz

            comp_lit_score: row.comp_lit_last_score !== null ? row.comp_lit_last_score : '-',
            comp_lit_bonus: row.comp_lit_total_xp || 0,

            quiz_score: row.quiz_last_score !== null ? row.quiz_last_score : '-',
            quiz_bonus: row.quiz_total_xp || 0,
        }));
        res.json(results);
    });
});

module.exports = router;