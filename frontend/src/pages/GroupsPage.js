import React from 'react';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

function GroupsPage() {
    const { userName, handleLogout } = useAuth();
    return (
        <div className="dashboard-layout">
            <Navbar userName={userName} handleLogout={handleLogout} />
            <main className="dashboard-content">
                <h1>Guruhlarim</h1>
                <p>Bu yerda guruhlar ro'yxati bo'ladi.</p>
            </main>
        </div>
    );
}
export default GroupsPage;