import React, { useContext, useState } from 'react';
import { Modal, message } from 'antd';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const Dashboard = () => {
    const { books, setBooks, issueRequests, setIssueRequests, historyStore, setHistoryStore } = useContext(StoreContext);

    const [issueMemberId, setIssueMemberId] = useState('');
    const [issueBookId, setIssueBookId] = useState('');
    const [returnMemberId, setReturnMemberId] = useState('');
    const [returnBookId, setReturnBookId] = useState('');

    const [isIssueModalVisible, setIsIssueModalVisible] = useState(false);
    const [isReturnModalVisible, setIsReturnModalVisible] = useState(false);

    const handleProcessRequest = (index, isApproved) => {
        const req = issueRequests[index];
        if (isApproved) {
            const book = books.find(b => b.id === req.bookId);
            if (book) {
                if (req.type === 'return') {
                    setHistoryStore([...historyStore, { title: book.title, memberId: req.memberId, returnDate: new Date().toISOString() }]);
                    const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: 'Available', issuedTo: null, dueDate: null } : b);
                    setBooks(updatedBooks);
                    message.success(`Return approved. "${book.title}" is now available.`);
                } else {
                    if (book.status !== 'Issued') {
                        const newStatus = req.status.includes('Faculty') ? 'Reserved' : 'Issued';
                        const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: newStatus, issuedTo: req.memberId, dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() } : b);
                        setBooks(updatedBooks);
                        message.success(`Issue approved. "${book.title}" issued to ${req.memberId}.`);
                    } else {
                        message.error('Book is already issued or unavailable.');
                    }
                }
            }
        }

        const newRequests = [...issueRequests];
        newRequests.splice(index, 1);
        setIssueRequests(newRequests);
    };

    const handleIssueBook = (e) => {
        e.preventDefault();
        const book = books.find(b => b.id.toLowerCase() === issueBookId.trim().toLowerCase() && b.status !== 'Issued');
        if (book) {
            const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: 'Issued', issuedTo: issueMemberId.trim(), dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() } : b);
            setBooks(updatedBooks);
            message.success(`Success! "${book.title}" formally issued to ${issueMemberId.trim()}.`);
            setIssueMemberId('');
            setIssueBookId('');
            setIsIssueModalVisible(false);
        } else {
            message.error('Book not found or actively unavailable.');
        }
    };

    const handleReturnBook = (e) => {
        e.preventDefault();
        const book = books.find(b => b.id.toLowerCase() === returnBookId.trim().toLowerCase() && b.issuedTo === returnMemberId.trim());
        if (book) {
            setHistoryStore([...historyStore, { title: book.title, memberId: returnMemberId.trim(), returnDate: new Date().toISOString() }]);
            const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: 'Available', issuedTo: null, dueDate: null } : b);
            setBooks(updatedBooks);
            message.success(`Success! "${book.title}" recorded as returned by ${returnMemberId.trim()}.`);
            setReturnMemberId('');
            setReturnBookId('');
            setIsReturnModalVisible(false);
        } else {
            message.error('Active issue record not verifiable for this combination.');
        }
    };

    return (
        <Layout
            role="librarian"
            title="Issue & Return"
            subtitle="Issue books to members and process active returns."
        >
            <div className="management-grid">
                {/* Pending Requests Queue */}
                <div className="management-card" style={{ gridColumn: '1 / -1', border: '2px solid var(--primary)' }}>
                    <div className="card-header" style={{ background: 'var(--primary-light)' }}>
                        <h3>⚠ Pending Member Requests</h3>
                    </div>
                    <div className="card-body">
                        <ul className="functional-list">
                            {issueRequests.length === 0 ? (
                                <li style={{ justifyContent: 'center', color: 'var(--text-light)' }}>No active requests pending.</li>
                            ) : (
                                issueRequests.map((req, index) => {
                                    const isReturn = req.type === 'return';
                                    const label = isReturn ? '↩ Return Request' : '↗ Issue Request';

                                    return (
                                        <li key={index}>
                                            <div className="item-info">
                                                <strong>{label}: {req.bookTitle} ({req.bookId})</strong>
                                                <span>Member: <strong>{req.memberId}</strong> &bull; Status: {req.status}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className="btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => handleProcessRequest(index, true)}>Approve</button>
                                                <button className="btn-danger" style={{ padding: '0.5rem 1rem' }} onClick={() => handleProcessRequest(index, false)}>Deny</button>
                                            </div>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>⚡ Quick Actions</h3></div>
                    <div className="card-body" style={{ display: 'flex', gap: '1rem', padding: '1.5rem' }}>
                        <button className="btn-primary" onClick={() => setIsIssueModalVisible(true)}>↗ Issue Book Manually</button>
                        <button className="btn-outline" onClick={() => setIsReturnModalVisible(true)}>↩ Process Return Manually</button>
                    </div>
                </div>

                {/* Issue Book Modal */}
                <Modal title="Issue Book Manually" open={isIssueModalVisible} onCancel={() => setIsIssueModalVisible(false)} footer={null}>
                    <form className="functional-form" onSubmit={handleIssueBook} style={{ paddingTop: '1rem' }}>
                        <div className="input-group">
                            <label>Member ID</label>
                            <input type="text" placeholder="e.g. S001" value={issueMemberId} onChange={e => setIssueMemberId(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Book ID</label>
                            <input type="text" placeholder="e.g. B001" value={issueBookId} onChange={e => setIssueBookId(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-primary w-100" style={{ padding: '1rem' }}>Issue Book</button>
                    </form>
                </Modal>

                {/* Return Book Modal */}
                <Modal title="Process Return Manually" open={isReturnModalVisible} onCancel={() => setIsReturnModalVisible(false)} footer={null}>
                    <form className="functional-form" onSubmit={handleReturnBook} style={{ paddingTop: '1rem' }}>
                        <div className="input-group">
                            <label>Member ID</label>
                            <input type="text" placeholder="e.g. S001" value={returnMemberId} onChange={e => setReturnMemberId(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Book ID</label>
                            <input type="text" placeholder="e.g. B001" value={returnBookId} onChange={e => setReturnBookId(e.target.value)} required />
                        </div>
                        <button type="submit" className="btn-outline w-100" style={{ padding: '1rem', borderWidth: '2px' }}>Accept Return</button>
                    </form>
                </Modal>
            </div>
        </Layout>
    );
};

export default Dashboard;
