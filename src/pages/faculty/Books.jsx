import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import BookList from '../../components/BookList';
import { StoreContext } from '../../contexts/StoreContext';

const Books = () => {
    const { books, setBooks } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleReserve = (book) => {
        const updatedBooks = books.map(b => b.id === book.id ? { ...b, status: 'Reserved' } : b);
        setBooks(updatedBooks);
        alert(book.title + ' reserved successfully.');
    };

    const actionRender = (book) => (
        <button
            className="btn-outline"
            style={{ padding: '0.5rem', fontSize: '0.8rem', height: '36px', width: '100%', borderRadius: '6px' }}
            onClick={() => handleReserve(book)}
        >
            Reserve (Long)
        </button>
    );

    return (
        <Layout
            role="Faculty"
            title="Search & Reserve"
            subtitle="Browse catalog and reserve books for coursework."
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
