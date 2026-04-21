import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = ({ children, role, searchTerm, setSearchTerm, title, subtitle }) => {
    return (
        <div className="dashboard-body">
            <Sidebar role={role} />
            <main className="main-content">
                <TopNav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                <div className="page-section active-section">
                    <div className="dashboard-content">
                        {(title || subtitle) && (
                            <div className="page-header" style={{ textAlign: 'center' }}>
                                <h1>{title}</h1>
                                {subtitle && <p>{subtitle}</p>}
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
