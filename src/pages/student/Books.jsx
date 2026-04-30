import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import BookList from '../../components/BookList';
import { message } from 'antd';
import { StoreContext } from '../../contexts/StoreContext';

const Books = () => {
    const { books, issueRequests, setIssueRequests, activeUser } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRequestIssue = (book) => {
        setIssueRequests([...issueRequests, { bookId: book.id, bookTitle: book.title, memberId: activeUser, type: 'issue', status: 'Pending' }]);
        alert(`Issue request sent for ${book.title}`);
    };

    const actionRender = (book) => {
        const isUnavailable = book.status !== 'Available';
        return (
            <button
                className="btn-primary"
                style={{
                    padding: '0.5rem',
                    fontSize: '0.8rem',
                    height: '36px',
                    width: '100%',
                    borderRadius: '6px',
                    opacity: isUnavailable ? 0.5 : 1,
                    cursor: isUnavailable ? 'not-allowed' : 'pointer'
                }}
                onClick={() => !isUnavailable && handleRequestIssue(book)}
                disabled={isUnavailable}
            >
                Request Issue
            </button>
        );
    };

    return (
        <Layout
            role="Student"
            title="Library Catalog"
            subtitle="Search and request available books."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
        >
            <div className="management-grid">
                <div className="management-card" style={{ gridColumn: '1 / -1', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                    <BookList books={filteredBooks} isGrid={true} actionRender={actionRender} />
                </div>
            </div>
        </Layout>
    );
};

export default Books;
