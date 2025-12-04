import React from 'react';

function GroupsTab({ 
    groups, 
    groupName, 
    setGroupName, 
    handleGroupSubmit, 
    handleDelete, 
    handleEditGroupClick, 
    handleCancelGroupEdit, 
    editingGroupId,
    onGroupClick // <-- Bu funksiya guruh ichiga kirish uchun kerak
}) {
    return (
        <div>
            {/* --- 1. GURUH YARATISH / TAHRIRLASH FORMASI --- */}
            <div className="add-student-box">
                <h4>{editingGroupId ? "Guruh Nomini O'zgartirish" : "Yangi Guruh Yaratish"}</h4>
                
                <form onSubmit={handleGroupSubmit} className="inline-form">
                    <input 
                        type="text" 
                        placeholder="Guruh nomi" 
                        value={groupName} 
                        onChange={e => setGroupName(e.target.value)} 
                        required 
                    />
                    
                    <button type="submit" style={{backgroundColor: editingGroupId ? '#f39c12' : '#1abc9c'}}>
                        {editingGroupId ? "Saqlash" : "Yaratish"}
                    </button>

                    {editingGroupId && (
                        <button type="button" onClick={handleCancelGroupEdit} style={{backgroundColor: '#95a5a6'}}>
                            Bekor qilish
                        </button>
                    )}
                </form>
            </div>

            {/* --- 2. GURUHLAR JADVALI --- */}
            <div className="admin-table-wrapper">
                <h3>Guruhlar Ro'yxati</h3>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nomi</th>
                            <th>O'quvchilar Soni</th>
                            <th>O'rtacha Ball</th>
                            <th>Amal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {groups.map(g => (
                            <tr key={g.id} className={editingGroupId === g.id ? 'editing-row' : ''}>
                                <td>{g.id}</td>
                                <td>
                                    {/* Guruh nomi bosiladigan havola sifatida */}
                                    <strong 
                                        style={{cursor: 'pointer', color: '#007bff', textDecoration: 'underline'}} 
                                        onClick={() => onGroupClick(g)}
                                        title="Guruh a'zolarini ko'rish"
                                    >
                                        {g.name}
                                    </strong>
                                </td>
                                <td>{g.student_count} ta</td>
                                <td>
                                    {g.student_count > 0 
                                        ? Math.round(g.total_group_score / g.student_count) 
                                        : 0} XP
                                </td>
                                <td>
                                    {/* KIRISH TUGMASI */}
                                    <button 
                                        className="msg-btn" 
                                        style={{marginRight: '8px', backgroundColor: '#3498db'}}
                                        onClick={() => onGroupClick(g)}
                                    >
                                        Kirish
                                    </button>

                                    {/* TAHRIRLASH TUGMASI */}
                                    <button 
                                        className="edit-btn" 
                                        onClick={() => handleEditGroupClick(g)}
                                    >
                                        ✏️
                                    </button>

                                    {/* O'CHIRISH TUGMASI */}
                                    <button 
                                        className="delete-btn" 
                                        onClick={() => handleDelete('groups', g.id)}
                                    >
                                        O'chirish
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default GroupsTab;