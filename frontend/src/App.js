import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import Navbar from './components/Navbar';
import './App.css';

// --- BARCHA SAHIFALARNI IMPORT QILISH ---
import LoginPage from './pages/LoginPage';
import AdminLoginPage from './pages/AdminLoginPage'; // <-- Bu qator endi bor!
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

import DashboardPage from './pages/DashboardPage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailsPage from './pages/GroupDetailsPage';
import TasksPage from './pages/TasksPage';
import TypingPage from './pages/TypingPage';
import ComputerLiteracyPage from './pages/ComputerLiteracyPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
// ----------------------------------------

// Tizimga kirgandan KEYINGI barcha sahifalarni boshqaruvchi Layout
function MainLayout() {
    const location = useLocation();
    const { loading, isLoggedIn } = useAuth();

    // Yuklanish holati
    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Yuklanmoqda...</div>;
    }

    // Agar tizimga kirmagan bo'lsa, Login sahifasiga yo'naltirish
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Typing sahifasida menyuni yashirish uchun tekshiruv
    const isTypingPage = location.pathname === '/tasks/typing';

    return (
        <div className={`app-wrapper ${isTypingPage ? 'typing-mode' : ''}`}>
            <Navbar />
            <div className="content-container">
                <Routes>
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/groups" element={<GroupsPage />} />
                    <Route path="/groups/:id" element={<GroupDetailsPage />} />
                    <Route path="/tasks" element={<TasksPage />} />
                    <Route path="/tasks/typing" element={<TypingPage />} />
                    <Route path="/tasks/computer-literacy" element={<ComputerLiteracyPage />} />
                    <Route path="/tasks/quiz" element={<QuizPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Noto'g'ri manzil kiritilsa, Bosh sahifaga qaytarish */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        </div>
    );
}

// Admin paneli uchun alohida Layout
function AdminLayout() {
    const adminToken = localStorage.getItem('admin_token');
    
    // Agar admin bo'lib kirmagan bo'lsa, Admin Login sahifasiga yo'naltirish
    if (!adminToken) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <Routes>
            <Route path="/dashboard" element={<AdminDashboardPage />} />
            {/* Boshqa admin sahifalari shu yerga qo'shiladi */}
            
            {/* Noto'g'ri admin manzili kiritilsa, Dashboardga qaytarish */}
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
    );
}

// Butun ilovaning asosiy Router'i
function App() {
    return (
        <Router>
            <Routes>
                {/* 1. O'quvchi Login Sahifasi */}
                <Route path="/login" element={<LoginPage />} />

                {/* 2. Admin Login Sahifasi */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* 3. Admin Paneli (Ichki sahifalar AdminLayout ichida) */}
                <Route path="/admin/*" element={<AdminLayout />} />

                {/* 4. Asosiy Ilova (O'quvchilar uchun) */}
                <Route path="/*" element={<MainLayout />} />
            </Routes>
        </Router>
    );
}

export default App;