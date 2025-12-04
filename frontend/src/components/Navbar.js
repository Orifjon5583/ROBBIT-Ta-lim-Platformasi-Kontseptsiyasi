import React from 'react';
import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import './Navbar.css';

function Navbar() {
    const { userName, handleLogout } = useAuth();
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="navbar-header"><h3>ROBBIT</h3></div>
                <ul className="nav-links">
                    <li><NavLink to="/" end>Asosiy Panel</NavLink></li>
                    <li><NavLink to="/groups">Guruhlarim</NavLink></li>
                    <li><NavLink to="/tasks">Topshiriqlar</NavLink></li>
                    <li><NavLink to="/profile">Mening profilim</NavLink></li>
                </ul>
                <div className="user-profile">
                    <div className="user-info"><strong>{userName}</strong></div>
                    <button onClick={handleLogout} className="logout-button">Chiqish</button>
                </div>
            </nav>
        </div>
    );
}
export default Navbar;