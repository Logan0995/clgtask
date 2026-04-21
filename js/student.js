// ==========================================
// STUDENT DASHBOARD CONTROLLER
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    var memberId = localStorage.getItem('activeUser') || 'UNKNOWN';

    // Render My Issued Books with due date + Return button
    function renderMyBooks() {
        var list = document.getElementById('myStudentBooksList');
        if (!list) return;
        var myBooks = window.books.filter(function(b) { return b.issuedTo === memberId; });
        list.innerHTML = '';
        if (myBooks.length === 0) {
            list.innerHTML = '<li style="justify-content:center;color:var(--text-light);">You have no currently issued books.</li>';
            return;
        }
        myBooks.forEach(function(book) {
            var isLate = book.dueDate && new Date(book.dueDate) < new Date();
            var dueText = book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A';
            var alreadyRequested = window.issueRequests.some(function(r) {
                return r.bookId === book.id && r.memberId === memberId && r.type === 'return';
            });
            list.innerHTML += '<li>' +
                '<div class="item-info">' +
                    '<strong>' + book.title + '</strong>' +
                    '<span>ID: ' + book.id + ' &bull; By ' + book.author + '</span>' +
                    '<span>Due Date: <strong style="color:' + (isLate ? 'var(--danger)' : 'var(--success)') + '">' + dueText + (isLate ? ' ⚠ OVERDUE' : '') + '</strong></span>' +
                '</div>' +
                (alreadyRequested
                    ? '<span style="color:var(--text-light);font-size:0.85rem;">Return Requested</span>'
                    : '<button class="btn-outline" style="padding:0.5rem 1rem;white-space:nowrap;" onclick="requestReturn(\'' + book.id + '\')">Request Return</button>'
                ) +
            '</li>';
        });
    }

    // Request Return — queues a return request for librarian
    window.requestReturn = function(bookId) {
        var book = window.books.find(function(b) { return b.id === bookId; });
        if (!book) return;
        window.issueRequests.push({ bookId: book.id, bookTitle: book.title, memberId: memberId, type: 'return', status: 'Return Pending' });
        window.saveData();
        alert('Return request sent to librarian for "' + book.title + '".');
        renderMyBooks();
    };

    // Issue Request form
    var reqForm = document.getElementById('requestBookForm');
    if (reqForm) {
        reqForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var bookId = document.getElementById('requestId').value.trim();
            var book = window.books.find(function(b) { return b.id.toLowerCase() === bookId.toLowerCase(); });
            if (book) {
                window.issueRequests.push({ bookId: book.id, bookTitle: book.title, memberId: memberId, type: 'issue', status: 'Pending' });
                window.saveData();
                alert('Issue request sent to librarian for "' + book.title + '".');
                reqForm.reset();
            } else {
                alert('Invalid Book ID. Check the catalog for the correct ID.');
            }
        });
    }

    renderMyBooks();

});
