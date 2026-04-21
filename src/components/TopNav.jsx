import React, { useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';

const TopNav = ({ searchTerm, setSearchTerm }) => {
    const { activeUserName, activeUserRole, activeUser } = useContext(StoreContext);

    let avatarColor = 'linear-gradient(135deg, var(--primary), var(--accent))';
    if (activeUserRole === 'librarian') avatarColor = 'linear-gradient(135deg,#10b981,#059669)';
    if (activeUserRole === 'Student') avatarColor = 'linear-gradient(135deg,#6366f1,#8b5cf6)';
    if (activeUserRole === 'Faculty') avatarColor = 'linear-gradient(135deg,#f59e0b,#d97706)';

    const initial = activeUserName ? activeUserName.charAt(0).toUpperCase() : (activeUserRole ? activeUserRole.charAt(0).toUpperCase() : 'U');

    return (
        <header className="top-nav">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                />
            </div>
            <div className="user-profile">
                <div className="profile-info">
                    <div className="avatar" style={{ background: avatarColor }}>
                        {initial}
                    </div>
                    <div className="details">
                        <span className="name">{activeUserName || activeUser}</span>
                        <span className="role">{activeUserRole}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TopNav;
