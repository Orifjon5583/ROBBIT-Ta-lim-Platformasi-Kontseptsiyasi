import React from 'react';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

function TypingPage() {
    const { userName, handleLogout } = useAuth();
    return (
        <div className="dashboard-layout">
            <Navbar userName={userName} handleLogout={handleLogout} />
            <main className="dashboard-content">
                <h1>Typing Master</h1>
            </main>
        </div>
    );
}
export default TypingPage;