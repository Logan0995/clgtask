import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const Dashboard = () => {
    const { books, issueRequests, setIssueRequests, activeUser } = useContext(StoreContext);
    const [requestId, setRequestId] = useState('');

    const myBooks = books.filter(b => b.issuedTo === activeUser);

    const handleRequestReturn = (bookId) => {
        const book = books.find(b => b.id === bookId);
        if (!book) return;
        setIssueRequests([...issueRequests, { bookId: book.id, bookTitle: book.title, memberId: activeUser, type: 'return', status: 'Return Pending' }]);
        alert(`Return request sent to librarian for "${book.title}".`);
    };

    const handleRequestIssue = (e) => {
        e.preventDefault();
        const book = books.find(b => b.id.toLowerCase() === requestId.trim().toLowerCase());
        if (book) {
            setIssueRequests([...issueRequests, { bookId: book.id, bookTitle: book.title, memberId: activeUser, type: 'issue', status: 'Pending' }]);
            alert(`Issue request sent to librarian for "${book.title}".`);
            setRequestId('');
        } else {
            alert('Invalid Book ID. Check the catalog for the correct ID.');
        }
    };

    return (
        <Layout
            role="Student"
            title="My Dashboard"
            subtitle="Track your currently issued books and pending requests."
        >
            <div className="management-grid">
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>📚 My Issued Books</h3></div>
                    <div className="card-body">
                        <ul className="functional-list">
                            {myBooks.length === 0 ? (
                                <li style={{ justifyContent: 'center', color: 'var(--text-light)' }}>You have no currently issued books.</li>
                            ) : (
                                myBooks.map(book => {
                                    const isLate = book.dueDate && new Date(book.dueDate) < new Date();
                                    const dueText = book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A';
                                    const alreadyRequested = issueRequests.some(r => r.bookId === book.id && r.memberId === activeUser && r.type === 'return');

                                    return (
                                        <li key={book.id}>
                                            <div className="item-info">
                                                <strong>{book.title}</strong>
                                                <span>ID: {book.id} &bull; By {book.author}</span>
                                                <span>Due Date: <strong style={{ color: isLate ? 'var(--danger)' : 'var(--success)' }}>
                                                    {dueText} {isLate && ' ⚠ OVERDUE'}
                                                </strong></span>
                                            </div>
                                            {alreadyRequested ? (
                                                <span style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Return Requested</span>
                                            ) : (
                                                <button className="btn-outline" style={{ padding: '0.5rem 1rem', whiteSpace: 'nowrap' }} onClick={() => handleRequestReturn(book.id)}>
                                                    Request Return
                                                </button>
                                            )}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                </div>

                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>📬 Request Book Issue</h3></div>
                    <div className="card-body">
                        <form className="functional-form" onSubmit={handleRequestIssue}>
                            <div className="input-group">
                                <label>Book ID to Request</label>
                                <input type="text" placeholder="e.g. B001" value={requestId} onChange={e => setRequestId(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primary w-100" style={{ padding: '0.9rem' }}>Send Request to Librarian</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
