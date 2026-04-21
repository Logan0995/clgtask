import React, { useContext, useRef } from 'react';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const Dashboard = () => {
    const { books, members, historyStore, recommendations } = useContext(StoreContext);
    const fileInputRef = useRef(null);
    const { setBooks, setMembers, setHistoryStore, setRecommendations } = useContext(StoreContext);

    const students = members.filter(m => m.role.toLowerCase() === 'student').length;
    const faculty = members.filter(m => m.role.toLowerCase() === 'faculty').length;
    const issuedBooks = books.filter(b => b.status === 'Issued').length;

    const handleGenerateReports = () => {
        alert(`System Report:\nTotal Books: ${books.length}\nIssued Books: ${issuedBooks}\nTotal Members: ${members.length}`);
    };

    const handleBackup = () => {
        const exportData = { books, members, history: historyStore, recommendations };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'library_backup.json';
        a.click();
        URL.revokeObjectURL(url);
        alert('Database Backup safely downloaded.');
    };

    const handleRestore = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (evt) {
            try {
                const data = JSON.parse(evt.target.result);
                if (data.books) setBooks(data.books);
                if (data.members) setMembers(data.members);
                if (data.history) setHistoryStore(data.history);
                if (data.recommendations) setRecommendations(data.recommendations);
                alert('Database Local Storage restitched successfully!');
            } catch (err) {
                alert('CRITICAL: Invalid JSON Backup format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <Layout
            role="admin"
            title="Overview"
            subtitle="Welcome back, Admin. Here is the library at a glance."
        >
            <div className="stats-grid">
                <div className="stat-card primary-accent">
                    <div className="stat-icon primary">📖</div>
                    <div className="stat-info">
                        <h3>Total Books</h3>
                        <h2>{books.length}</h2>
                    </div>
                </div>
                <div className="stat-card warning-accent">
                    <div className="stat-icon warning">👥</div>
                    <div className="stat-info">
                        <h3>Total Members</h3>
                        <h2>{members.length}</h2>
                    </div>
                </div>
                <div className="stat-card success-accent">
                    <div className="stat-icon success">🎓</div>
                    <div className="stat-info">
                        <h3>Students</h3>
                        <h2>{students}</h2>
                    </div>
                </div>
                <div className="stat-card rose-accent">
                    <div className="stat-icon accent">📋</div>
                    <div className="stat-info">
                        <h3>Faculty</h3>
                        <h2>{faculty}</h2>
                    </div>
                </div>
            </div>

            <div className="management-grid mt-4">
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>⚙ System Administration</h3></div>
                    <div className="card-body" style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', padding: '1.5rem' }}>
                        <button onClick={handleGenerateReports} className="btn-primary" style={{ padding: '0.85rem 1.75rem' }}>Generate Overall Reports</button>
                        <button onClick={handleBackup} className="btn-outline" style={{ padding: '0.85rem 1.75rem' }}>Backup Database</button>
                        <button onClick={() => fileInputRef.current.click()} className="btn-outline" style={{ padding: '0.85rem 1.75rem' }}>Restore Database</button>
                        <input type="file" ref={fileInputRef} onChange={handleRestore} style={{ display: 'none' }} accept=".json" />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
