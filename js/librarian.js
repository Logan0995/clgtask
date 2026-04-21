// ==========================================
// LIBRARIAN DASHBOARD CONTROLLER
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    // Add Book (Librarian)
    let addBookForm = document.getElementById('addBookForm');
    if (addBookForm) {
        addBookForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let coverInput = document.getElementById('bookCover');
            window.books.push({ 
                id: 'B' + Math.floor(Math.random()*10000), 
                title: document.getElementById('bookTitle').value.trim(), 
                author: document.getElementById('bookAuthor').value.trim(), 
                category: document.getElementById('bookCategory').value.trim(), 
                coverUrl: coverInput ? coverInput.value.trim() : '',
                status: 'Available', issuedTo: null, dueDate: null 
            });
            window.saveData(); addBookForm.reset(); window.renderBooks();
            alert('Book successfully added to the system catalog.');
            
            // Redirect to Catalog View
            window.location.href = '../librarian/books.html';
        });
    }

    // Issue Book
    let issueForm = document.getElementById('issueBookForm');
    if (issueForm) {
        issueForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let memberId = document.getElementById('issueMemberId').value.trim();
            let bookId = document.getElementById('issueTitle').value.trim();
            let book = window.books.find(b => b.id.toLowerCase() === bookId.toLowerCase() && b.status !== 'Issued');
            
            if(book) {
                book.status = 'Issued';
                book.issuedTo = memberId;
                book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
                window.saveData(); window.renderBooks(); issueForm.reset();
                alert(`Success! "${book.title}" formally issued to ${memberId}.`);
            } else {
                alert('ERROR: Book not found or actively unavailable.');
            }
        });
    }

    // Return Book
    let returnForm = document.getElementById('returnBookForm');
    if (returnForm) {
        returnForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let memberId = document.getElementById('returnMemberId').value.trim();
            let bookId = document.getElementById('returnTitle').value.trim();
            let book = window.books.find(b => b.id.toLowerCase() === bookId.toLowerCase() && b.issuedTo === memberId);
            
            if(book) {
                window.historyStore.push({ title: book.title, memberId: memberId, returnDate: new Date().toISOString() });
                book.status = 'Available';
                book.issuedTo = null;
                book.dueDate = null;
                window.saveData(); window.renderBooks(); returnForm.reset();
                alert(`Success! "${book.title}" recorded as returned by ${memberId}.`);
            } else {
                alert('ERROR: Active issue record not verifiable for this combination.');
            }
        });
    }

    // Fine Calculation Engine
    let finesForm = document.getElementById('finesForm');
    if (finesForm) {
        finesForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let memberId = document.getElementById('fineMemberId').value.trim();
            let overdueBooks = window.books.filter(b => b.issuedTo === memberId && new Date(b.dueDate) < new Date());
            
            if(overdueBooks.length > 0) {
                let totalDays = 0;
                overdueBooks.forEach(b => {
                    let diff = new Date() - new Date(b.dueDate);
                    totalDays += Math.floor(diff / (1000 * 60 * 60 * 24));
                });
                document.getElementById('fineResult').innerText = `Calculated Fine: $${totalDays}.00 for ${overdueBooks.length} overdue books.`;
            } else {
                document.getElementById('fineResult').innerText = "Account holds no outstanding fines.";
            }
        });
    }

    let btnGenReport = document.getElementById('btnGenerateIssueReport');
    if(btnGenReport) {
        btnGenReport.addEventListener('click', () => {
            let active = window.books.filter(b=>b.status==='Issued').length;
            alert(`Librarian Report:\nCurrently active issues: ${active}\nOverdue items: ${window.books.filter(b=>b.status==='Issued' && new Date(b.dueDate) < new Date()).length}`);
        });
    }

    // Pending Request Queue Rendering
    window.renderRequests = function() {
        var list = document.getElementById('pendingRequestsList');
        if(!list) return;
        list.innerHTML = '';
        if(window.issueRequests.length === 0) {
            list.innerHTML = '<li style="justify-content:center;color:var(--text-light);">No active requests pending.</li>';
            return;
        }
        window.issueRequests.forEach(function(req, index) {
            var isReturn = req.type === 'return';
            var label = isReturn ? '&#8617; Return Request' : '&#8599; Issue Request';
            var labelColor = isReturn ? 'var(--warning, #f59e0b)' : 'var(--primary)';
            list.innerHTML += '<li>' +
                '<div class="item-info">' +
                    '<strong>' + label + ': ' + req.bookTitle + ' (' + req.bookId + ')</strong>' +
                    '<span>Member: <strong>' + req.memberId + '</strong> &bull; Status: ' + req.status + '</span>' +
                '</div>' +
                '<div style="display:flex; gap:0.5rem;">' +
                    '<button class="btn-primary" style="padding: 0.5rem 1rem;" onclick="processRequest(' + index + ', true)">Approve</button>' +
                    '<button class="btn-danger" style="padding: 0.5rem 1rem;" onclick="processRequest(' + index + ', false)">Deny</button>' +
                '</div>' +
            '</li>';
        });
    };

    window.processRequest = function(index, isApproved) {
        var req = window.issueRequests[index];
        if(isApproved) {
            var book = window.books.find(function(b) { return b.id === req.bookId; });
            if(book) {
                if(req.type === 'return') {
                    // Process return
                    window.historyStore.push({ title: book.title, memberId: req.memberId, returnDate: new Date().toISOString() });
                    book.status = 'Available';
                    book.issuedTo = null;
                    book.dueDate = null;
                    alert('Return approved. "' + book.title + '" is now available.');
                } else {
                    // Process issue
                    if(book.status !== 'Issued') {
                        book.status = req.status.includes('Faculty') ? 'Reserved' : 'Issued';
                        book.issuedTo = req.memberId;
                        book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
                        alert('Issue approved. "' + book.title + '" issued to ' + req.memberId + '.');
                    } else {
                        alert('ERROR: Book is already issued or unavailable.');
                    }
                }
            }
        }
        window.issueRequests.splice(index, 1);
        window.saveData(); window.renderBooks(); window.renderRequests();
    };

    // Initialize list if on page
    window.renderRequests();

    // Tab switcher for librarian catalog page
    window.showTab = function(tab) {
        var viewAll = document.getElementById('viewAll');
        var viewIssued = document.getElementById('viewIssued');
        var tabAll = document.getElementById('tabAll');
        var tabIssued = document.getElementById('tabIssued');
        if(!viewAll || !viewIssued) return;

        if(tab === 'all') {
            viewAll.style.display = '';
            viewIssued.style.display = 'none';
            tabAll.className = 'btn-primary';
            tabIssued.className = 'btn-outline';
        } else {
            viewAll.style.display = 'none';
            viewIssued.style.display = '';
            tabAll.className = 'btn-outline';
            tabIssued.className = 'btn-primary';
            renderIssuedBooks();
        }
    };

    function renderIssuedBooks() {
        var list = document.getElementById('issuedBooksList');
        if(!list) return;
        var issued = window.books.filter(function(b) { return b.status === 'Issued' || b.status === 'Reserved'; });
        list.innerHTML = '';
        if(issued.length === 0) {
            list.innerHTML = '<li style="justify-content:center;color:var(--text-light);">No books currently issued.</li>';
            return;
        }
        issued.forEach(function(book) {
            var isLate = book.dueDate && new Date(book.dueDate) < new Date();
            var dueText = book.dueDate ? new Date(book.dueDate).toLocaleDateString() : 'N/A';
            list.innerHTML += '<li>' +
                '<div class="item-info">' +
                    '<strong>' + book.title + '</strong>' +
                    '<span>ID: ' + book.id + ' &bull; Issued to: <strong>' + (book.issuedTo || '—') + '</strong> &bull; Due: <span style="color:' + (isLate ? 'var(--danger)' : 'var(--success)') + '">' + dueText + (isLate ? ' ⚠ OVERDUE' : '') + '</span></span>' +
                '</div>' +
                '<span class="status-badge ' + (book.status === 'Issued' ? 'status-issued' : 'status-reserved') + '">' + book.status + '</span>' +
            '</li>';
        });
    }

});
