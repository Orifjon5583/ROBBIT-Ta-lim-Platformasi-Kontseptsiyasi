const express = require('express');
const cors = require('cors');

// Barcha route fayllarini chaqirib olamiz
const authRoutes = require('./routes/authRoutes');
const groupRoutes = require('./routes/groupRoutes');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = 5001; // Biz kelishgan port

// Asosiy sozlamalar
app.use(cors());
app.use(express.json());

// Server ishlayotganini tekshirish uchun test manzil
app.get('/', (req, res) => {
    res.send('ROBBIT Backend Server is active and ready!');
});

// Barcha API yo'nalishlarini serverga ulaymiz
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

// Serverni ishga tushiramiz
app.listen(PORT, () => {
    console.log(`--> ROBBIT Backend server is running on http://localhost:${PORT}`);
});