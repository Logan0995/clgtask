import React, { useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { Badge } from 'antd';
import { Bell } from 'lucide-react';

const TopNav = ({ searchTerm, setSearchTerm }) => {
    const { activeUserName, activeUserRole, activeUser, issueRequests } = useContext(StoreContext);

    let avatarColor = 'linear-gradient(135deg, var(--primary), var(--primary-dark))';
    if (activeUserRole === 'librarian') avatarColor = 'linear-gradient(135deg, var(--success), #059669)';
    if (activeUserRole === 'Student') avatarColor = 'linear-gradient(135deg, #3b82f6, #2563eb)';
    if (activeUserRole === 'Faculty') avatarColor = 'linear-gradient(135deg, var(--warning), #d97706)';

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
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {(activeUserRole === 'librarian' || activeUserRole === 'admin') && (
                    <Badge count={issueRequests ? issueRequests.length : 0} size="small" style={{ backgroundColor: 'var(--primary)' }}>
                        <Bell size={20} color="var(--text-light)" style={{ cursor: 'pointer' }} />
                    </Badge>
                )}
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
