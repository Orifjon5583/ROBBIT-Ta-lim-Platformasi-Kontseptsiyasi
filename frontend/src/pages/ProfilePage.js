import React from 'react';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

function ProfilePage() {
    const { userName, handleLogout } = useAuth();
    return (
        <div className="dashboard-layout">
            <Navbar userName={userName} handleLogout={handleLogout} />
            <main className="dashboard-content">
                <h1>Mening Profilim</h1>
                <p>Foydalanuvchi ma'lumotlari.</p>
            </main>
        </div>
    );
}
export default ProfilePage;