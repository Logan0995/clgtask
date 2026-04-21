// ==========================================
// FACULTY DASHBOARD CONTROLLER
// ==========================================

document.addEventListener('DOMContentLoaded', function () {

    let resForm = document.getElementById('reserveBookForm');
    if (resForm) {
        resForm.addEventListener('submit', function (e) {
            e.preventDefault();
            let rid = document.getElementById('reserveId');
            if(rid) {
                let bookId = rid.value.trim();
                let book = window.books.find(b => b.id.toLowerCase() === bookId.toLowerCase());
                
                if(book && book.status === 'Available') {
                    let memberId = localStorage.getItem('activeUser') || 'UNKNOWN';
                    window.issueRequests.push({ bookId: book.id, bookTitle: book.title, memberId: memberId, status: 'Faculty Long-term Reserve Pending' });
                    window.saveData(); 
                    resForm.reset();
                    alert('Academic Reservation Request physically dispatched to Librarian.');
                } else {
                    alert('ERROR: Book not found, ID invalid, or actively manually unavailable.');
                }
            }
        });
    }

    let recForm = document.getElementById('recommendBookForm');
    if (recForm) {
        recForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.recommendations.push({
                title: document.getElementById('recTitle').value,
                author: document.getElementById('recAuthor').value,
                reason: document.getElementById('recReason').value
            });
            window.saveData(); recForm.reset();
            alert('Recommendation successfully logged to the Administrative queue.');
        });
    }

});
