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
                if (coverSrc && !coverSrc.startsWith('http') && !coverSrc.startsWith('..') && !coverSrc.startsWith('/')) {
                    coverSrc = '/' + coverSrc;
                }

                return (
                    <li key={book.id}>
                        {isGrid && (
                            <>
                                <div className={`status-badge ${statusClass}`}>{book.status}</div>
                                {coverSrc ? (
                                    <img
                                        src={coverSrc}
                                        alt="Cover"
                                        className="book-cover-image"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className="book-cover-placeholder" style={{ display: coverSrc ? 'none' : 'flex' }}>📖</div>
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
