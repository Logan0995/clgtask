import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import BookList from '../../components/BookList';
import { StoreContext } from '../../contexts/StoreContext';

const Books = () => {
    const { books } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [tab, setTab] = useState('all');

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const issuedBooks = filteredBooks.filter(b => b.status === 'Issued' || b.status === 'Reserved');

    return (
        <Layout
            role="librarian"
            title="Library Catalog"
            subtitle="Browse and manage the complete book inventory."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
        >
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <button
                    className={tab === 'all' ? 'btn-primary' : 'btn-outline'}
                    onClick={() => setTab('all')}
                >
                    All Books
                </button>
                <button
                    className={tab === 'issued' ? 'btn-primary' : 'btn-outline'}
                    onClick={() => setTab('issued')}
                >
                    Currently Issued
                </button>
            </div>

            {tab === 'all' && (
                <div className="management-grid">
                    <div className="management-card" style={{ gridColumn: '1/-1', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                        <BookList books={filteredBooks} isGrid={true} />
                    </div>
                </div>
            )}

            {tab === 'issued' && (
                <div className="management-grid">
                    <div className="management-card" style={{ gridColumn: '1/-1' }}>
                        <div className="card-header"><h3>📋 Currently Issued Books</h3></div>
                        <div className="card-body">
                            <ul className="functional-list">
                                {issuedBooks.length === 0 ? (
                                    <li style={{ justifyContent: 'center', color: 'var(--text-light)' }}>No books currently issued.</li>
                                ) : (
                                    issuedBooks.map(book => {
                                        const isLate = book.dueDate && new Date(book.dueDate) < new Date();
                                        const dueText = book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A';

                                        return (
                                            <li key={book.id}>
                                                <div className="item-info">
                                                    <strong>{book.title}</strong>
                                                    <span>
                                                        ID: {book.id} &bull; Issued to: <strong>{book.issuedTo || '—'}</strong> &bull;
                                                        Due: <span style={{ color: isLate ? 'var(--danger)' : 'var(--success)' }}>
                                                            {dueText} {isLate && ' ⚠ OVERDUE'}
                                                        </span>
                                                    </span>
                                                </div>
                                                <span className={`status-badge ${book.status === 'Issued' ? 'status-issued' : 'status-reserved'}`}>
                                                    {book.status}
                                                </span>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Books;
