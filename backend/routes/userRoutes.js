const express = require('express');
const router = express.Router();
const db = require('../database.js');
const { protect } = require('../middleware/authMiddleware.js');

router.get('/profile', protect, (req, res) => {
    const userId = req.user.id;
    // birth_date va joined_at ni to'g'ri olamiz
    const sql = `SELECT id, name, email, birth_date, DATETIME(joined_at, 'localtime') as joined_at, total_score FROM users WHERE id = ?`;
    
    db.get(sql, [userId], (err, row) => {
        if (err) return res.status(500).json({ message: "Bazada xatolik." });
        if (!row) return res.status(404).json({ message: "Topilmadi." });
        
        // Guruhlarni qo'shamiz
        db.all(`SELECT g.name FROM groups g JOIN user_groups ug ON g.id = ug.group_id WHERE ug.user_id = ?`, [userId], (err, groups) => {
            row.groups = groups.map(g => g.name);
            res.json(row);
        });
    });
});

// ... (my-attempts va notifications avvalgidek) ...

module.exports = router;