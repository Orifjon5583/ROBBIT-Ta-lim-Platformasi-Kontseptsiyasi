const db = require('./database.js');
const bcrypt = require('bcryptjs');

const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) { err ? reject(err) : resolve(this); });
});

const initializeDatabase = async () => {
    console.log('Initializing database...');
    try {
        // 1. USERS (birth_date va joined_at bor)
        await run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY, 
            name TEXT, 
            email TEXT UNIQUE, 
            password_hash TEXT, 
            birth_date TEXT, 
            total_score INTEGER DEFAULT 0, 
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // 2. GROUPS (created_at bor)
        await run(`CREATE TABLE IF NOT EXISTS groups (
            id INTEGER PRIMARY KEY, 
            name TEXT, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // 3. USER_GROUPS
        await run(`CREATE TABLE IF NOT EXISTS user_groups (
            user_id INTEGER, group_id INTEGER, PRIMARY KEY (user_id, group_id)
        )`);

        // 4. ATTEMPTS
        await run(`CREATE TABLE IF NOT EXISTS attempts (
            id INTEGER PRIMARY KEY, user_id INTEGER, task_type TEXT, score INTEGER, 
            wpm INTEGER, accuracy INTEGER, bonus_points INTEGER DEFAULT 0, 
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        // 5. ADMINS
        await run(`CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY, username TEXT UNIQUE, password_hash TEXT
        )`);

        // 6. NOTIFICATIONS
        await run(`CREATE TABLE IF NOT EXISTS notifications (
            id INTEGER PRIMARY KEY, user_id INTEGER, message TEXT, 
            is_read BOOLEAN DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log('Tables created. Inserting test data...');
        
        const passHash = await bcrypt.hash('123456', 10);
        const adminPassHash = await bcrypt.hash('admin123', 10);

        // Test Admin
        await run("INSERT OR IGNORE INTO admins (id, username, password_hash) VALUES (?,?,?)", [1, 'admin', adminPassHash]);
        
        // Test Users (birth_date bilan)
        await run("INSERT OR IGNORE INTO users (id, name, email, password_hash, birth_date, total_score) VALUES (?,?,?,?,?,?)", [1, 'Ali Valiyev', 'ali@g.com', passHash, '2005-05-15', 100]);
        
        // Test Groups
        await run("INSERT OR IGNORE INTO groups (id, name) VALUES (?,?)", [1, 'Frontend Guruxi']);
        
        // A'zolik
        await run("INSERT OR IGNORE INTO user_groups (user_id, group_id) VALUES (?,?)", [1, 1]);

        console.log('Database ready.');
    } catch (e) { console.error('DB Init Error:', e); } 
    finally { db.close(); }
};

initializeDatabase();