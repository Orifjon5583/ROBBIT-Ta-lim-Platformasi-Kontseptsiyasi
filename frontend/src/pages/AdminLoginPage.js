import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css'; // Umumiy login dizaynidan foydalanamiz

function AdminLoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await fetch('http://localhost:5001/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            // Admin tokenini saqlaymiz
            localStorage.setItem('admin_token', data.token);
            localStorage.setItem('admin_name', data.adminName);

            // Admin paneliga yo'naltiramiz
            navigate('/admin/dashboard');

        } catch (error) {
            setMessage(error.message || 'Serverda xatolik yuz berdi.');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Admin Panel</h2>
                <p className="auth-subtitle">Boshqaruv tizimiga kirish</p>

                <div className="form-group">
                    <label>Login</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Parol</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit" className="auth-button">Kirish</button>

                {message && <p style={{ color: '#dc3545', marginTop: '1rem' }}>{message}</p>}
            </form>
        </div>
    );
}

export default AdminLoginPage;