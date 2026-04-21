import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';

const Sidebar = ({ role }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { logout } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { path: '/admin', label: 'Dashboard', icon: '🏠' },
        { path: '/admin/books', label: 'View Catalog', icon: '📖' },
        { path: '/admin/add-book', label: 'Add Book', icon: '➕' },
        { path: '/admin/members', label: 'View Members', icon: '👥' },
        { path: '/admin/add-member', label: 'Add Member', icon: '➕' }
    ];

    const librarianLinks = [
        { path: '/librarian/books', label: 'View Catalog', icon: '📖' },
        { path: '/librarian/add-book', label: 'Add Book', icon: '➕' },
        { path: '/librarian', label: 'Issue & Return', icon: '📝' },
        { path: '/librarian/fines', label: 'Fines & Reports', icon: '💰' }
    ];

    const studentLinks = [
        { path: '/student', label: 'My Dashboard', icon: '🏠' },
        { path: '/student/books', label: 'Search Books', icon: '📖' }
    ];

    const facultyLinks = [
        { path: '/faculty', label: 'Faculty Dashboard', icon: '🏠' },
        { path: '/faculty/books', label: 'Search & Reserve', icon: '📖' }
    ];

    let links = [];
    if (role === 'admin') links = adminLinks;
    if (role === 'librarian') links = librarianLinks;
    if (role === 'Student') links = studentLinks;
    if (role === 'Faculty') links = facultyLinks;

    return (
        <nav className={`sidebar ${collapsed ? 'collapsed' : ''}`} id="sidebar">
            <div className="sidebar-header">
                <div className="logo">
                    <span>📚</span>
                    <h2>Central Library</h2>
                </div>
                <button onClick={() => setCollapsed(!collapsed)} className="toggle-btn">☰</button>
            </div>
            <ul className="nav-links">
                {links.map((link) => (
                    <li key={link.path}>
                        <NavLink to={link.path} className={({ isActive }) => isActive ? "active" : ""}>
                            {link.icon} <span className="nav-text">{link.label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>
            <div className="sidebar-footer">
                <a href="#" onClick={handleLogout} className="logout-link">← <span className="nav-text">Logout</span></a>
            </div>
        </nav>
    );
};

export default Sidebar;
