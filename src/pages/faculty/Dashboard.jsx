import React, { useState, useContext } from 'react';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const Dashboard = () => {
    const { historyStore, issueRequests, setIssueRequests, recommendations, setRecommendations, activeUser } = useContext(StoreContext);

    const [reserveId, setReserveId] = useState('');
    const [recTitle, setRecTitle] = useState('');
    const [recAuthor, setRecAuthor] = useState('');
    const [recReason, setRecReason] = useState('');

    const myHistory = historyStore.filter(h => h.memberId === activeUser);

    const handleReserve = (e) => {
        e.preventDefault();
        setIssueRequests([...issueRequests, { bookId: reserveId.trim(), bookTitle: 'Book ID: ' + reserveId.trim(), memberId: activeUser, status: 'Faculty Long-term Reserve Pending' }]);
        alert('Academic Reservation Request physically dispatched to Librarian.');
        setReserveId('');
    };

    const handleRecommend = (e) => {
        e.preventDefault();
        setRecommendations([...recommendations, { title: recTitle, author: recAuthor, reason: recReason }]);
        alert('Recommendation successfully logged to the Administrative queue.');
        setRecTitle('');
        setRecAuthor('');
        setRecReason('');
    };

    return (
        <Layout
            role="Faculty"
            title="Faculty Dashboard"
            subtitle="Long-term reservations, borrowing history, and recommendations."
        >
            <div className="management-grid">
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>📜 Borrowing History</h3></div>
                    <div className="card-body">
                        <ul className="functional-list">
                            {myHistory.length === 0 ? (
                                <li style={{ justifyContent: 'center' }}>No borrowing history.</li>
                            ) : (
                                myHistory.map((h, i) => (
                                    <li key={i}>
                                        <div className="item-info">
                                            <strong>{h.title}</strong>
                                            <span>Returned: {new Date(h.returnDate).toLocaleDateString()}</span>
                                        </div>
                                        <span className="role-badge badge-student">Returned</span>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>

                <div className="management-card">
                    <div className="card-header"><h3>📌 Reserve a Book</h3></div>
                    <div className="card-body">
                        <form className="functional-form" onSubmit={handleReserve}>
                            <div className="input-group">
                                <label>Book ID to Reserve</label>
                                <input type="text" placeholder="e.g. B001" value={reserveId} onChange={e => setReserveId(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-outline w-100" style={{ padding: '0.9rem' }}>Confirm Reservation</button>
                        </form>
                    </div>
                </div>

                <div className="management-card">
                    <div className="card-header"><h3>💡 Recommend a Book</h3></div>
                    <div className="card-body">
                        <form className="functional-form" onSubmit={handleRecommend}>
                            <div className="input-group">
                                <label>Book Title</label>
                                <input type="text" placeholder="e.g. Deep Learning" value={recTitle} onChange={e => setRecTitle(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Author / Publisher</label>
                                <input type="text" placeholder="e.g. Ian Goodfellow" value={recAuthor} onChange={e => setRecAuthor(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label>Why is this needed?</label>
                                <input type="text" placeholder="For CS-602 coursework..." value={recReason} onChange={e => setRecReason(e.target.value)} />
                            </div>
                            <button type="submit" className="btn-primary w-100" style={{ padding: '0.9rem' }}>Submit Recommendation</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
