import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import BookList from '../../components/BookList';
import { StoreContext } from '../../contexts/StoreContext';

const Books = () => {
    const { books, setBooks } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRemoveBook = (idToRemove) => {
        setBooks(books.filter(b => b.id !== idToRemove));
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const actionRender = (book) => (
        <button
            className="btn-danger"
            onClick={() => handleRemoveBook(book.id)}
            style={{ width: '100%', borderRadius: '6px', padding: '0.5rem', marginTop: '1rem' }}
        >
            Remove Book
        </button>
    );

    return (
        <Layout
            role="admin"
            title="Library Catalog"
            subtitle="Complete view of all books in the system."
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
