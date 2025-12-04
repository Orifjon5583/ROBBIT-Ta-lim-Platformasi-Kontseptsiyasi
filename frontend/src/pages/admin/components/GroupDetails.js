import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5001';

function GroupDetails({ group, onBack, adminToken }) {
    const [students, setStudents] = useState([]);
    const [xpAmount, setXpAmount] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    // Guruh o'quvchilarini yuklash
    const fetchStudents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/admin/groups/${group.id}/students`, {
                headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [group]);

    // XP berish funksiyasi
    const handleGiveXP = async (e) => {
        e.preventDefault();
        if (!selectedStudent || !xpAmount) return;

        try {
            const res = await fetch(`${API_URL}/api/admin/users/${selectedStudent.id}/xp`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminToken}` },
                body: JSON.stringify({ amount: parseInt(xpAmount) })
            });
            const data = await res.json();
            
            if (res.ok) {
                setMessage({ text: `Muvaffaqiyatli: ${xpAmount} XP berildi!`, type: 'success' });
                setXpAmount('');
                setSelectedStudent(null); // Modalni yopish
                fetchStudents(); // Jadvalni yangilash
            } else {
                setMessage({ text: data.message, type: 'error' });
            }
        } catch (error) {
            setMessage({ text: "Server xatoligi", type: 'error' });
        }
    };

    // Xabarni o'chirish
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ text: '', type: '' }), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <div>
            <button className="back-btn" onClick={onBack}>← Ortga (Guruhlar)</button>
            
            <div className="header-flex">
                <h3>{group.name} - O'quvchilar Ro'yxati</h3>
            </div>

            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Ism</th>
                            <th>Email</th>
                            <th>Jami XP</th>
                            <th>Amal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.length > 0 ? (
                            students.map(s => (
                                <tr key={s.id}>
                                    <td>{s.id}</td>
                                    <td>{s.name}</td>
                                    <td>{s.email}</td>
                                    <td style={{fontWeight:'bold', color:'#1abc9c'}}>{s.total_score} XP</td>
                                    <td>
                                        <button 
                                            className="edit-btn" 
                                            style={{backgroundColor: '#9b59b6'}}
                                            onClick={() => setSelectedStudent(s)}
                                        >
                                            ★ XP Berish
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{textAlign:'center'}}>Bu guruhda o'quvchilar yo'q.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* XP BERISH MODAL OYNASI */}
            {selectedStudent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>XP Berish: {selectedStudent.name}</h3>
                        <p>Qancha XP qo'shmoqchisiz? (Ayirish uchun manfiy son yozing, masalan -10)</p>
                        <form onSubmit={handleGiveXP}>
                            <input 
                                type="number" 
                                placeholder="Masalan: 50" 
                                value={xpAmount} 
                                onChange={e => setXpAmount(e.target.value)} 
                                required 
                                autoFocus
                            />
                            <div className="modal-actions">
                                <button type="submit" className="send-btn">Tasdiqlash</button>
                                <button type="button" onClick={() => setSelectedStudent(null)} className="cancel-btn">Bekor qilish</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {message.text && <div className={`message-popup ${message.type}`}>{message.text}</div>}
        </div>
    );
}

export default GroupDetails;