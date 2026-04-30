import React from 'react';

const BookList = ({ books, isGrid, actionRender, emptyMessage = "No books available." }) => {
    if (!books || books.length === 0) {
        return (
            <ul className={`functional-list ${isGrid ? 'book-grid-view' : ''}`}>
                <li style={{ justifyContent: 'center', color: 'var(--text-light)', border: 'none', background: 'transparent', gridColumn: '1/-1' }}>
                    {emptyMessage}
                </li>
            </ul>
        );
    }

    return (
        <ul className={`functional-list ${isGrid ? 'book-grid-view' : ''}`}>
            {books.map((book) => {
                let statusClass = 'status-available';
                if (book.status === 'Issued') statusClass = 'status-issued';
                if (book.status === 'Reserved') statusClass = 'status-reserved';

                let coverSrc = book.coverUrl;
                if (coverSrc) {
                    const filename = coverSrc.split('/').pop();
                    coverSrc = `/images/${filename}`;
                } else {
                    coverSrc = "/images/default.png";
                }

                return (
                    <li key={book.id}>
                        {isGrid && (
                            <>
                                <div className={`status-badge ${statusClass}`}>{book.status}</div>
                                <img
                                    src={coverSrc}
                                    alt="Cover"
                                    className="book-cover-image"
                                    onError={(e) => { e.target.src = '/images/default.png'; }}
                                />
                            </>
                        )}
                        <div className="item-info">
                            <strong>{book.title}</strong>
                            <span>
                                ID: {book.id} {isGrid ? <br /> : <>&nbsp;&bull;&nbsp;</>}
                                By {book.author} {isGrid ? <br /> : <>&nbsp;&bull;&nbsp;</>}
                                {book.category}
                            </span>
                        </div>
                        {actionRender && actionRender(book)}
                    </li>
                );
            })}
        </ul>
    );
};

export default BookList;
