import React from 'react';

function AdminSidebar({ activeTab, setActiveTab, handleLogout }) {
    return (
        <div className="admin-sidebar">
            <h2>Admin Panel</h2>
            <ul>
                <li className={activeTab === 'students' ? 'active' : ''} onClick={() => setActiveTab('students')}>
                    O'quvchilar
                </li>
                <li className={activeTab === 'groups' ? 'active' : ''} onClick={() => setActiveTab('groups')}>
                    Guruhlar
                </li>
                <li className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
                    Statistika
                </li>
                <li className="logout" onClick={handleLogout}>
                    Chiqish
                </li>
            </ul>
        </div>
    );
}
export default AdminSidebar;