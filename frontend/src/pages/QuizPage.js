import React from 'react';
import Navbar from '../components/Navbar';
import useAuth from '../hooks/useAuth';

function QuizPage() {
    const { userName, handleLogout } = useAuth();
    return (
        <div className="dashboard-layout">
            <Navbar userName={userName} handleLogout={handleLogout} />
            <main className="dashboard-content">
                <h1>Quiz</h1>
            </main>
        </div>
    );
}
export default QuizPage;