import React from 'react';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

function TasksPage() {
    const { userName, handleLogout } = useAuth();
    return (
        <div className="dashboard-layout">
            <Navbar userName={userName} handleLogout={handleLogout} />
            <main className="dashboard-content">
                <h1>Topshiriqlar</h1>
                <p>Bu yerda topshiriqlar bo'ladi.</p>
            </main>
        </div>
    );
}
export default TasksPage;