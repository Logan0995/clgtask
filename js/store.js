// =========================================================================
// CENTRAL DATA STORE & UTILITIES
// This file initializes the database. 
// =========================================================================

/*
 * =========================================================================
 * HOW TO MANUALLY ADD BOOKS TO THE SYSTEM DATABASE
 * =========================================================================
 * To add a new book manually, copy the template block below and paste it
 * INSIDE the `defaultBooks` array. Make sure you increment the ID (e.g. B005).
 * IF you don't have a cover image, just leave `coverUrl: ''`.
 * 
 * TEMPLATE:
    { 
        id: 'B999', 
        title: 'Your Exact Book Title', 
        author: 'Author Name', 
        category: 'Genre / Context', 
        coverUrl: 'https://link-to-your-image.com/cover.jpg',
        status: 'Available', 
        issuedTo: null, 
        dueDate: null 
    },
 * =========================================================================
 */

window.defaultBooks = [

    {
        id: 'B002',
        title: 'Calculus: Early Transcendentals',
        author: 'James Stewart',
        category: 'Mathematics',
        status: 'Issued', issuedTo: 'S001', dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        coverUrl: 'books/cc.jpg'
    },
    {
        id: 'B003',
        title: 'University Physics',
        author: 'Young and Freedman',
        category: 'Physics',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/phy.jpg'
    },
    {
        id: 'B012',
        title: 'Wings of Fire',
        author: 'Abdul Kalam',
        category: 'Biography',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/apj.jpg'
    },
    {
        id: 'B005',
        title: 'Why I am an Athiest',
        author: 'Bhagat Singh',
        category: 'Philosophy',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/why i am an athiest.jpg'
    },

    {
        id: 'B007',
        title: 'The Invisible Man',
        author: 'H.G.Wells',
        category: 'Science Fiction',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/im.jpg'
    },
    {
        id: 'B008',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        category: 'Fiction',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/pp.jpg'
    },
    {
        id: 'B001',
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt',
        category: 'Software Engineering',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'https://m.media-amazon.com/images/I/51W1sBPO7tL._AC_UY327_FMwebp_QL65_.jpg'
    },
    {
        id: 'B006',
        title: 'Moon Walk',
        author: 'Michael Jackson',
        category: 'Biography',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/mj.jpg'
    },
    {
        id: 'B009',
        title: 'The Dairy of a young girl',
        author: 'Anne Frank',
        category: 'History',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/af.jpg'
    },
    {
        id: 'B0010',
        title: '20000 Leagues under the Sea',
        author: 'Jules Verne',
        category: 'Science Fiction',
        status: 'Available', issuedTo: null, dueDate: null,
        coverUrl: 'books/20kl.jpg'
    },



    // ---> PASTE YOUR NEW BOOKS HERE <---

];

window.defaultMembers = [
    { name: 'Ananya Sharma', id: 'S001', role: 'Student' },
    { name: 'Dr. R. Mehta', id: 'F001', role: 'Faculty' }
];

// Initialize global state arrays
window.books = JSON.parse(localStorage.getItem('library_books')) || window.defaultBooks;
window.members = JSON.parse(localStorage.getItem('library_members')) || window.defaultMembers;
window.historyStore = JSON.parse(localStorage.getItem('library_history')) || [];
window.recommendations = JSON.parse(localStorage.getItem('library_recommendations')) || [];
window.issueRequests = JSON.parse(localStorage.getItem('library_issueRequests')) || [];

// Self-healing patch for old cached IDs
let needsSave = false;
window.members.forEach(m => {
    if(m.id === 'CS-2024-001') { m.id = 'S001'; needsSave = true; }
    if(m.id === 'FAC-001') { m.id = 'F001'; needsSave = true; }
});
window.books.forEach(b => {
    if(b.issuedTo === 'CS-2024-001') { b.issuedTo = 'S001'; needsSave = true; }
    if(b.issuedTo === 'FAC-001') { b.issuedTo = 'F001'; needsSave = true; }
});
if(needsSave) {
    localStorage.setItem('library_members', JSON.stringify(window.members));
}

// Save back to local storage
window.saveData = function () {
    localStorage.setItem('library_books', JSON.stringify(window.books));
    localStorage.setItem('library_members', JSON.stringify(window.members));
    localStorage.setItem('library_history', JSON.stringify(window.historyStore));
    localStorage.setItem('library_recommendations', JSON.stringify(window.recommendations));
    localStorage.setItem('library_issueRequests', JSON.stringify(window.issueRequests));
};

// --- Universal Array Mutators ---
window.removeBook = function (index) { window.books.splice(index, 1); window.saveData(); window.renderBooks(); };
window.removeMember = function (index) { window.members.splice(index, 1); window.saveData(); window.renderMembers(); };
window.formatDate = function (isoString) {
    if (!isoString) return '';
    var d = new Date(isoString);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// =========================================================================
// UNIVERSAL RENDERERS (Attached to window so all modules can call them)
// =========================================================================
window.updateStats = function () {
    var students = window.members.filter(m => m.role.toLowerCase() === 'student').length;
    var faculty = window.members.filter(m => m.role.toLowerCase() === 'faculty').length;

    const setVal = (id, val) => { let el = document.getElementById(id); if (el) el.innerText = val; };
    setVal('totalBooksCount', window.books.length);
    setVal('totalMembersCount', window.members.length);
    setVal('totalStudentsCount', students);
    setVal('totalFacultyCount', faculty);
    setVal('bookCountBadge', window.books.length);
    setVal('memberCountBadge', window.members.length);
};

window.renderBooks = function () {
    var adminList = document.getElementById('booksList');
    var studentList = document.getElementById('studentBooksList');
    var facultyList = document.getElementById('facultyBooksList');

    var lists = [adminList, studentList, facultyList].filter(l => l !== null);

    lists.forEach(list => {
        list.innerHTML = '';
        if (window.books.length === 0) {
            list.innerHTML = '<li style="justify-content:center;color:var(--text-light);border:none;background:transparent;grid-column: 1/-1;">No books available.</li>';
            return;
        }

        window.books.forEach((book, index) => {
            var isGrid = list.classList.contains('book-grid-view');
            var statusClass = book.status === 'Issued' ? 'status-issued' : (book.status === 'Reserved' ? 'status-reserved' : 'status-available');

            var li = document.createElement('li');
            var html = '';

            if (isGrid) {
                html += `<div class="status-badge ${statusClass}">${book.status}</div>`;
                // Fix path: local covers need ../ prefix since HTML files are in subfolders
                var coverSrc = book.coverUrl;
                if(coverSrc && !coverSrc.startsWith('http') && !coverSrc.startsWith('..')) {
                    coverSrc = '../' + coverSrc;
                }
                if (coverSrc) {
                    html += `<img src="${coverSrc}" alt="Cover" class="book-cover-image" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div class="book-cover-placeholder" style="display:none;">📖</div>`;
                } else {
                    html += `<div class="book-cover-placeholder">📖</div>`;
                }
            }

            html += `<div class="item-info">
                        <strong>${book.title}</strong>
                        <span>ID: ${book.id} ${isGrid ? '<br/>' : '&nbsp;&bull;&nbsp;'} By ${book.author} ${isGrid ? '<br/>' : '&nbsp;&bull;&nbsp;'} ${book.category}</span>
                     </div>`;

            if (list.id === 'booksList') {
                html += `<button class="btn-danger" onclick="removeBook(${index})" style="width: 100%; border-radius: 6px; padding: 0.5rem; margin-top: 1rem;">Remove Book</button>`;
            } else if (list.id === 'studentBooksList') {
                html += `<button class="btn-primary" style="padding: 0.5rem; font-size: 0.8rem; height: 36px; width: 100%; border-radius: 6px;" onclick="window.requestIssue('${book.title}')" ${book.status !== 'Available' ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>Request Issue</button>`;
            } else if (list.id === 'facultyBooksList') {
                html += `<button class="btn-outline" style="padding: 0.5rem; font-size: 0.8rem; height: 36px; width: 100%; border-radius: 6px;" onclick="window.reserveBook('${book.title}')">Reserve (Long)</button>`;
            }
            li.innerHTML = html;
            list.appendChild(li);
        });
    });

    // Student specific Active list mock
    var myStuList = document.getElementById('myStudentBooksList');
    if (myStuList) {
        myStuList.innerHTML = '';
        var myBooks = window.books.filter(b => b.status === 'Issued');
        if (myBooks.length === 0) myStuList.innerHTML = '<li style="justify-content:center;">No active issued books.</li>';
        myBooks.forEach(b => {
            let isLate = new Date(b.dueDate) < new Date();
            let dueColor = isLate ? 'var(--danger)' : 'var(--success)';
            let fineBadge = isLate ? '<span class="role-badge badge-admin">Overdue Fine</span>' : '<span class="role-badge badge-librarian">Active</span>';
            myStuList.innerHTML += `
                <li>
                    <div class="item-info">
                        <strong>${b.title}</strong>
                        <span>Issued to: ${b.issuedTo} <span>&nbsp;&bull;&nbsp;</span> <span style="color:${dueColor}; font-weight:bold;">Due: ${window.formatDate(b.dueDate)}</span></span>
                    </div>
                    ${fineBadge}
                </li>`;
        });
    }

    // Faculty specific History list mock
    var myFacList = document.getElementById('facultyHistoryList');
    if (myFacList) {
        myFacList.innerHTML = '';
        if (window.historyStore.length === 0) myFacList.innerHTML = '<li style="justify-content:center;">No borrowing history.</li>';
        window.historyStore.forEach(h => {
            myFacList.innerHTML += `
                <li>
                    <div class="item-info">
                        <strong>${h.title}</strong>
                        <span>Returned: ${window.formatDate(h.returnDate)}</span>
                    </div>
                    <span class="role-badge badge-student">Returned</span>
                </li>`;
        });
    }

    window.updateStats();
};

window.renderMembers = function () {
    var list = document.getElementById('membersList');
    if (!list) return;
    list.innerHTML = '';
    if (window.members.length === 0) { list.innerHTML = '<li>No members.</li>'; return; }

    window.members.forEach((member, index) => {
        var badgeClass = member.role === 'Faculty' ? 'badge-faculty' : (member.role === 'Librarian' ? 'badge-librarian' : 'badge-student');
        list.innerHTML += `
            <li>
                <div class="item-info">
                    <strong>${member.name}</strong>
                    <span>ID: ${member.id} &nbsp; <span class="role-badge ${badgeClass}">${member.role}</span></span>
                </div>
                <button class="btn-danger" onclick="removeMember(${index})">Remove</button>
            </li>`;
    });
    window.updateStats();
};

window.requestIssue = function (title) { alert('Issue request sent for ' + title); };
window.reserveBook = function (title) {
    let b = window.books.find(x => x.title === title);
    if (b) { b.status = 'Reserved'; window.saveData(); window.renderBooks(); alert(title + ' reserved successfully.'); }
};
