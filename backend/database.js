const sqlite3 = require('sqlite3').verbose();

// `backend` papkasi ichida `robbits.db` nomli faylga ulanishni o'rnatamiz.
// Agar bu fayl mavjud bo'lmasa, `sqlite3` uni avtomatik yaratadi.
const db = new sqlite3.Database('./robbits.db', (err) => {
    if (err) {
        // Agar biror sabab bilan bazaga ulanib bo'lmasa, terminalga xato chiqaramiz
        console.error('DATABASE CONNECTION ERROR:', err.message);
    } else {
        // Agar ulanish muvaffaqiyatli bo'lsa
        console.log('Successfully connected to the ROBBIT SQLite database.');
    }
});

// Yaratilgan ulanishni (`db` obyektini) boshqa fayllar ishlata olishi uchun eksport qilamiz
module.exports = db;