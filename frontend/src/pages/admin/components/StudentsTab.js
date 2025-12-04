import React from 'react';

function StudentsTab({ 
    users, groups, newUser, setNewUser, handleAddUser, handleDelete, 
    searchTerm, setSearchTerm, openMessageModal,
    handleEditClick, editingId, handleCancelEdit // <-- YANGI PROPLAR
}) {
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="add-student-box">
                {/* Sarlavha o'zgaradi */}
                <h4>{editingId ? "O'quvchi Ma'lumotlarini Tahrirlash" : "Yangi O'quvchi Qo'shish"}</h4>
                
                <form onSubmit={handleAddUser} className="inline-form">
                    <input type="text" placeholder="Ism Familiya" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
                    <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
                    
                    {/* Parol tahrirlashda majburiy emas */}
                    <input type="password" placeholder={editingId ? "Yangi parol (ixtiyoriy)" : "Parol"} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required={!editingId} />
                    
                    <input type="date" value={newUser.birthDate} onChange={e => setNewUser({...newUser, birthDate: e.target.value})} />
                    
                    <select value={newUser.groupId} onChange={e => setNewUser({...newUser, groupId: e.target.value})}>
                        <option value="">Guruh tanlang...</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    
                    {/* Tugmalar o'zgaradi */}
                    <button type="submit" style={{backgroundColor: editingId ? '#f39c12' : '#1abc9c'}}>
                        {editingId ? "Saqlash" : "Qo'shish"}
                    </button>
                    
                    {/* Tahrirlash paytida Bekor qilish tugmasi chiqadi */}
                    {editingId && (
                        <button type="button" onClick={handleCancelEdit} style={{backgroundColor: '#95a5a6'}}>
                            Bekor qilish
                        </button>
                    )}
                </form>
            </div>

            <div className="admin-table-wrapper">
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
                    <h3>Barcha O'quvchilar ({users.length})</h3>
                    <input 
                        type="text" 
                        placeholder="Qidirish..." 
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ism</th>
                            <th>Email</th>
                            <th>Tug'ilgan sana</th>
                            <th>Guruh</th>
                            <th>Jami XP</th>
                            <th>Amallar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(u => (
                            <tr key={u.id} className={editingId === u.id ? 'editing-row' : ''}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.birth_date || '-'}</td>
                                <td>{u.group_name || <span style={{color:'red'}}>Guruhsiz</span>}</td>
                                <td style={{fontWeight:'bold', color:'#1abc9c'}}>{u.total_score} XP</td>
                                <td>
                                    {/* TAHRIRLASH TUGMASI */}
                                    <button className="edit-btn" onClick={() => handleEditClick(u)} style={{marginRight: '5px', backgroundColor: '#f39c12', border:'none', padding:'5px 10px', color:'white', borderRadius:'4px', cursor:'pointer'}}>
                                        ✏️
                                    </button>
                                    
                                    <button className="msg-btn" onClick={() => openMessageModal(u)}>✉️</button>
                                    <button className="delete-btn" onClick={() => handleDelete('users', u.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default StudentsTab;