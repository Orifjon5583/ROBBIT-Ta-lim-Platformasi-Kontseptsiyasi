import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:5001/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            localStorage.setItem('token', data.token);
            localStorage.setItem('userName', data.userName);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Xatolik yuz berdi');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Kirish</h2>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="form-group">
                    <label>Parol</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="auth-button">Tizimga Kirish</button>
                {error && <p className="error-msg">{error}</p>}
            </form>
        </div>
    );
}
export default LoginPage;