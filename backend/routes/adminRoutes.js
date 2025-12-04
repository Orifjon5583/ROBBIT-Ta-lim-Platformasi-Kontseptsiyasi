const express = require('express');
const router = express.Router();
const db = require('../database.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');
const { protect } = require('../middleware/authMiddleware.js');
const { requireAdmin } = require('../middleware/adminHelper.js');

// 1. ADMIN LOGIN
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM admins WHERE username = ?';
    try {
        const admin = await new Promise((resolve, reject) => {
            db.get(sql, [username], (err, row) => err ? reject(err) : resolve(row));
        });
        if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
            return res.status(401).json({ message: "Login yoki parol xato." });
        }
        const token = jwt.sign({ id: admin.id, isAdmin: true }, JWT_SECRET, { expiresIn: '8h' });
        res.json({ token, adminName: admin.username });
    } catch (error) {
        res.status(500).json({ message: "Server xatoligi." });
    }
});

// 2. STATISTIKA
router.get('/stats', protect, requireAdmin, (req, res) => {
    db.serialize(() => {
        db.get("SELECT COUNT(*) as c FROM users", (e1, r1) => {
            db.get("SELECT COUNT(*) as c FROM groups", (e2, r2) => {
                db.get("SELECT COUNT(*) as c FROM attempts", (e3, r3) => {
                    if (e1 || e2 || e3) return res.status(500).json({ message: "Statistika xatosi" });
                    res.json({ users: r1.c, groups: r2.c, attempts: r3.c });
                });
            });
        });
    });
});

// 3. GURUHLAR BILAN ISHLASH
router.get('/groups', protect, requireAdmin, (req, res) => {
    const sql = `
        SELECT g.id, g.name, g.created_at, COUNT(ug.user_id) as student_count, SUM(u.total_score) as total_group_score
        FROM groups g
        LEFT JOIN user_groups ug ON g.id = ug.group_id
        LEFT JOIN users u ON ug.user_id = u.id
        GROUP BY g.id ORDER BY g.name ASC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Xatolik." });
        res.json(rows);
    });
});

router.post('/groups/add', protect, requireAdmin, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nom kiritilmadi." });
    db.run(`INSERT INTO groups (name) VALUES (?)`, [name], function(err) {
        if (err) return res.status(400).json({ message: "Xatolik." });
        res.status(201).json({ message: "Guruh yaratildi!" });
    });
});

router.put('/groups/:id', protect, requireAdmin, (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Nom kiritilmadi." });
    db.run(`UPDATE groups SET name = ? WHERE id = ?`, [name, req.params.id], function(err) {
        if (err) return res.status(500).json({ message: "Xatolik." });
        res.json({ message: "Guruh yangilandi!" });
    });
});

router.delete('/groups/:id', protect, requireAdmin, (req, res) => {
    db.run(`DELETE FROM groups WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ message: "Xatolik." });
        res.json({ message: "Guruh o'chirildi." });
    });
});

// --- MANA SHU QISM SIZDA YETISHMAYOTGAN EDI ---
// 4. GURUH ICHIDAGI O'QUVCHILARNI OLISH
router.get('/groups/:id/students', protect, requireAdmin, (req, res) => {
    const sql = `
        SELECT u.id, u.name, u.email, u.total_score, u.joined_at
        FROM users u
        JOIN user_groups ug ON u.id = ug.user_id
        WHERE ug.group_id = ?
        ORDER BY u.total_score DESC
    `;
    db.all(sql, [req.params.id], (err, rows) => {
        if (err) return res.status(500).json({ message: "Xatolik" });
        res.json(rows);
    });
});
// ----------------------------------------------

// 5. O'QUVCHILAR BILAN ISHLASH
router.get('/users', protect, requireAdmin, (req, res) => {
    const sql = `
        SELECT u.id, u.name, u.email, u.birth_date, u.total_score, u.joined_at, g.name as group_name 
        FROM users u
        LEFT JOIN user_groups ug ON u.id = ug.user_id
        LEFT JOIN groups g ON ug.group_id = g.id
        ORDER BY u.id DESC
    `;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ message: "Xatolik." });
        res.json(rows);
    });
});

router.post('/add-user', protect, requireAdmin, async (req, res) => {
    const { name, email, password, groupId, birthDate } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Ma'lumot yetarli emas." });
    try {
        const hash = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (name, email, password_hash, birth_date) VALUES (?, ?, ?, ?)', [name, email, hash, birthDate], function(err) {
            if (err) return res.status(400).json({ message: "Email band." });
            const newId = this.lastID;
            if (groupId) {
                db.run('INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)', [newId, groupId], () => {
                    res.status(201).json({ message: "O'quvchi qo'shildi." });
                });
            } else { res.status(201).json({ message: "O'quvchi qo'shildi." }); }
        });
    } catch { res.status(500).json({ message: "Xatolik." }); }
});

router.put('/users/:id', protect, requireAdmin, (req, res) => {
    const id = req.params.id;
    const { name, email, groupId, birthDate } = req.body;
    if (!name || !email) return res.status(400).json({ message: "Ism va Email shart." });

    const updateUserSql = `UPDATE users SET name = ?, email = ?, birth_date = ? WHERE id = ?`;
    db.run(updateUserSql, [name, email, birthDate, id], function(err) {
        if (err) return res.status(500).json({ message: "Xatolik." });
        if (groupId) {
            db.run(`DELETE FROM user_groups WHERE user_id = ?`, [id], () => {
                db.run(`INSERT INTO user_groups (user_id, group_id) VALUES (?, ?)`, [id, groupId], () => {
                    res.json({ message: "Yangilandi!" });
                });
            });
        } else {
            db.run(`DELETE FROM user_groups WHERE user_id = ?`, [id], () => {
                res.json({ message: "Yangilandi (guruhsiz)!" });
            });
        }
    });
});

router.delete('/users/:id', protect, requireAdmin, (req, res) => {
    db.run(`DELETE FROM users WHERE id = ?`, [req.params.id], (err) => res.json({ message: "O'chirildi" }));
});

// 6. XP BERISH
router.put('/users/:id/xp', protect, requireAdmin, (req, res) => {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: "Miqdor kiritilmadi" });
    db.run(`UPDATE users SET total_score = total_score + ? WHERE id = ?`, [amount, req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Xatolik" });
        res.json({ message: "XP yangilandi!" });
    });
});

// 7. XABAR YUBORISH
router.post('/send-message', protect, requireAdmin, (req, res) => {
    const { userId, message } = req.body;
    db.run(`INSERT INTO notifications (user_id, message) VALUES (?, ?)`, [userId, message], (err) => {
        if (err) return res.status(500).json({ message: "Xatolik." });
        res.json({ message: "Xabar yuborildi!" });
    });
});

module.exports = router;