import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboardPage.css';

// Komponentlar
import AdminSidebar from './components/AdminSidebar';
import StatsTab from './components/StatsTab';
import GroupsTab from './components/GroupsTab';
import StudentsTab from './components/StudentsTab';
import MessageModal from './components/MessageModal';
import GroupDetails from './components/GroupDetails';

const API_URL = 'http://localhost:5001';

function AdminDashboardPage() {
    const navigate = useNavigate();
    const adminName = localStorage.getItem('admin_name');
    const adminToken = localStorage.getItem('admin_token');

    // --- STATE'LAR ---
    const [activeTab, setActiveTab] = useState('students');
    
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({ users: 0, groups: 0, attempts: 0 });
    
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '', birthDate: '', groupId: '' });
    const [editingId, setEditingId] = useState(null); 

    const [groupName, setGroupName] = useState('');
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [viewingGroup, setViewingGroup] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    
    // Xabar Modali
    const [messageModal, setMessageModal] = useState({ show: false, userId: null, userName: '' });
    const [messageText, setMessageText] = useState('');

    // --- YANGI: XP BERISH MODALI UCHUN STATE ---
    const [xpModal, setXpModal] = useState({ show: false, userId: null, userName: '' });
    const [xpAmount, setXpAmount] = useState('');
    // -------------------------------------------

    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ text: '', type: '' }), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchData = async () => {
        if (!adminToken) { navigate('/admin/login'); return; }
        const headers = { 'Authorization': `Bearer ${adminToken}` };
        try {
            const [gRes, uRes, sRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/groups`, { headers }),
                fetch(`${API_URL}/api/admin/users`, { headers }),
                fetch(`${API_URL}/api/admin/stats`, { headers })
            ]);
            setGroups(await gRes.json());
            setUsers(await uRes.json());
            setStats(await sRes.json());
        } catch (error) { console.error("Fetch error", error); }
    };

    useEffect(() => { fetchData(); }, [adminToken]);

    // --- HANDLERS ---

    // XP BERISH FUNKSIYASI (YANGI)
    const handleGiveXP = async (e) => {
        e.preventDefault();
        if (!xpAmount) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/users/${xpModal.userId}/xp`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
                body: JSON.stringify({ amount: parseInt(xpAmount) })
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ text: `Muvaffaqiyatli: ${xpAmount} XP berildi!`, type: 'success' });
                setXpModal({ show: false, userId: null, userName: '' }); // Modalni yopish
                setXpAmount('');
                fetchData(); // Ro'yxatni yangilash (XP o'zgarganini ko'rish uchun)
            } else {
                setMessage({ text: data.message, type: 'error' });
            }
        } catch (err) {
            setMessage({ text: "Server xatoligi", type: 'error' });
        }
    };

    // ... (Qolgan handlerlar: handleUserSubmit, handleGroupSubmit, handleDelete, handleSendMessage... O'ZGARISHSIZ QOLADI) ...
    // Kodni qisqartirmaslik uchun ularni shu yerda deb tasavvur qiling yoki avvalgi to'liq koddan oling.
    // Men faqat o'zgargan joylarini ko'rsataman, lekin siz faylga HAMMASINI qo'yishingiz kerak.
    
    const handleUserSubmit = async (e) => { /* ... avvalgi kod ... */ 
        e.preventDefault();
        const url = editingId ? `${API_URL}/api/admin/users/${editingId}` : `${API_URL}/api/admin/add-user`;
        const method = editingId ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
                body: JSON.stringify(newUser)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setMessage({ text: data.message, type: 'success' });
            setNewUser({ name: '', email: '', password: '', birthDate: '', groupId: '' });
            setEditingId(null);
            fetchData();
        } catch (err) { setMessage({ text: err.message, type: 'error' }); }
    };

    const handleEditClick = (user) => { /* ... avvalgi kod ... */ 
        const userGroup = groups.find(g => g.name === user.group_name);
        setNewUser({
            name: user.name, email: user.email, password: '',
            birthDate: user.birth_date ? user.birth_date.split('T')[0] : '',
            groupId: userGroup ? userGroup.id : ''
        });
        setEditingId(user.id);
        window.scrollTo(0, 0);
    };
    const handleCancelEdit = () => { /* ... avvalgi kod ... */ 
        setNewUser({ name: '', email: '', password: '', birthDate: '', groupId: '' });
        setEditingId(null);
    };
    const handleGroupSubmit = async (e) => { /* ... avvalgi kod ... */ 
        e.preventDefault();
        const url = editingGroupId ? `${API_URL}/api/admin/groups/${editingGroupId}` : `${API_URL}/api/admin/groups/add`;
        const method = editingGroupId ? 'PUT' : 'POST';
        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
                body: JSON.stringify({ name: groupName })
            });
            const data = await res.json();
            if(!res.ok) throw new Error(data.message);
            setMessage({ text: data.message, type: 'success' });
            setGroupName(''); setEditingGroupId(null); fetchData();
        } catch (err) { setMessage({ text: err.message, type: 'error' }); }
    };
    const handleEditGroupClick = (group) => { /* ... */ 
        setGroupName(group.name); setEditingGroupId(group.id); window.scrollTo(0, 0);
    };
    const handleCancelGroupEdit = () => { /* ... */ 
        setGroupName(''); setEditingGroupId(null);
    };
    const handleDelete = async (type, id) => { /* ... */ 
        if(!window.confirm("O'chirilsinmi?")) return;
        try {
            const res = await fetch(`${API_URL}/api/admin/${type}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if(res.ok) { setMessage({ text: "O'chirildi", type: 'success' }); fetchData(); }
        } catch (err) { setMessage({ text: "Xatolik", type: 'error' }); }
    };
    const handleSendMessage = async () => { /* ... */ 
        if (!messageText.trim()) return;
        const res = await fetch(`${API_URL}/api/admin/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
            body: JSON.stringify({ userId: messageModal.userId, message: messageText })
        });
        if(res.ok) {
            setMessage({ text: "Xabar yuborildi!", type: 'success' });
            setMessageModal({ show: false, userId: null, userName: '' });
            setMessageText('');
        }
    };
    const handleLogout = () => { localStorage.clear(); navigate('/admin/login'); };


    return (
        <div className="admin-layout">
            <AdminSidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setViewingGroup(null); }} handleLogout={handleLogout} />

            <div className="admin-content">
                <div className="header-flex">
                    <h3>Xush kelibsiz, {adminName || 'Admin'}!</h3>
                </div>

                {activeTab === 'students' && (
                    <StudentsTab 
                        users={users} groups={groups} 
                        newUser={newUser} setNewUser={setNewUser}
                        handleAddUser={handleUserSubmit} 
                        handleDelete={handleDelete}
                        handleEditClick={handleEditClick}
                        handleCancelEdit={handleCancelEdit}
                        editingId={editingId}
                        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                        openMessageModal={(u) => setMessageModal({show: true, userId: u.id, userName: u.name})}
                        // --- YANGI PROP: XP MODALINI OCHISH ---
                        openXPModal={(u) => setXpModal({show: true, userId: u.id, userName: u.name})}
                    />
                )}

                {activeTab === 'groups' && (
                    <>
                        {viewingGroup ? (
                            <GroupDetails 
                                group={viewingGroup} 
                                onBack={() => setViewingGroup(null)} 
                                adminToken={adminToken}
                            />
                        ) : (
                            <GroupsTab 
                                groups={groups} 
                                groupName={groupName} setGroupName={setGroupName}
                                handleGroupSubmit={handleGroupSubmit} 
                                handleDelete={handleDelete}
                                handleEditGroupClick={handleEditGroupClick}
                                handleCancelGroupEdit={handleCancelGroupEdit}
                                editingGroupId={editingGroupId}
                                onGroupClick={(group) => setViewingGroup(group)} 
                            />
                        )}
                    </>
                )}

                {activeTab === 'stats' && <StatsTab stats={stats} />}
            </div>

            {/* XABAR YUBORISH MODALI */}
            <MessageModal 
                show={messageModal.show} userName={messageModal.userName}
                messageText={messageText} setMessageText={setMessageText}
                handleSendMessage={handleSendMessage}
                onClose={() => setMessageModal({show: false, userId: null, userName: ''})}
            />

            {/* --- YANGI: XP BERISH MODALI --- */}
            {xpModal.show && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>XP Berish: {xpModal.userName}</h3>
                        <p>Qancha XP qo'shmoqchisiz? (Ayirish uchun manfiy son yozing)</p>
                        <form onSubmit={handleGiveXP}>
                            <input 
                                type="number" 
                                placeholder="Masalan: 50" 
                                value={xpAmount} 
                                onChange={e => setXpAmount(e.target.value)} 
                                required 
                                autoFocus
                                style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#2c3e50'}}
                            />
                            <div className="modal-actions">
                                <button type="submit" className="send-btn" style={{backgroundColor: '#9b59b6'}}>Tasdiqlash</button>
                                <button type="button" onClick={() => setXpModal({show: false, userId: null, userName: ''})} className="cancel-btn">Bekor qilish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {message.text && <div className={`message-popup ${message.type}`}>{message.text}</div>}
        </div>
    );
}

export default AdminDashboardPage;