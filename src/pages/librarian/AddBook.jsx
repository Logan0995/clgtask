import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const AddBook = () => {
    const { books, setBooks } = useContext(StoreContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [coverUrl, setCoverUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newBook = {
            id: 'B' + Math.floor(Math.random() * 10000),
            title: title.trim(),
            author: author.trim(),
            category: category.trim(),
            coverUrl: coverUrl.trim(),
            status: 'Available',
            issuedTo: null,
            dueDate: null
        };
        setBooks([...books, newBook]);
        alert('Book successfully added to the system catalog.');
        navigate('/librarian/books');
    };

    return (
        <Layout
            role="librarian"
            title="Add New Book"
            subtitle="Enter the details to add a new book to the catalog."
        >
            <div className="management-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
                <div className="card-header"><h3>📖 Book Details</h3></div>
                <div className="card-body" style={{ padding: '2.5rem' }}>
                    <form className="functional-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Book Title</label>
                            <input type="text" placeholder="e.g. Introduction to Algorithms" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Author Name</label>
                            <input type="text" placeholder="e.g. Thomas H. Cormen" value={author} onChange={e => setAuthor(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Category / Genre</label>
                            <input type="text" placeholder="e.g. Computer Science" value={category} onChange={e => setCategory(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Cover Photo URL (Optional)</label>
                            <input type="url" placeholder="https://example.com/cover.jpg" value={coverUrl} onChange={e => setCoverUrl(e.target.value)} />
                        </div>
                        <button type="submit" className="btn-primary w-100" style={{ marginTop: '0.75rem', padding: '1rem' }}>Add to Catalog</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AddBook;
