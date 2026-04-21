// ==========================================
// ADMIN DASHBOARD CONTROLLER
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    
    // Add Book
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
            window.location.href = '../admin/books.html';
        });
    }

    // Add Member
    let addMemberForm = document.getElementById('addMemberForm');
    if (addMemberForm) {
        addMemberForm.addEventListener('submit', function (e) {
            e.preventDefault();
            window.members.push({ 
                name: document.getElementById('memberName').value.trim(), 
                id: document.getElementById('memberId').value.trim(), 
                role: document.getElementById('memberRole').value 
            });
            window.saveData(); addMemberForm.reset(); window.renderMembers();
            alert('Member safely registered in the database.');
            
            // Redirect to Members View
            window.location.href = '../admin/members.html';
        });
    }

    // Admin DB Reports & Backup Logic
    let btnAdminReports = document.getElementById('btnAdminReports');
    if(btnAdminReports) {
        btnAdminReports.addEventListener('click', () => {
             alert(`System Report:\nTotal Books: ${window.books.length}\nIssued Books: ${window.books.filter(b=>b.status==='Issued').length}\nTotal Members: ${window.members.length}`);
        });
    }

    let btnDbBackup = document.getElementById('btnAdminBackup');
    if(btnDbBackup) {
        btnDbBackup.addEventListener('click', () => {
             let exportData = { books: window.books, members: window.members, history: window.historyStore, recommendations: window.recommendations };
             let blob = new Blob([JSON.stringify(exportData, null, 2)], {type: "application/json"});
             let url  = URL.createObjectURL(blob);
             let a = document.createElement('a');
             a.href = url;
             a.download = 'library_backup.json';
             a.click();
             URL.revokeObjectURL(url);
             alert('Database Backup safely downloaded.');
        });
    }

    let dbRestoreFile = document.getElementById('dbRestoreFile');
    if(dbRestoreFile) {
        dbRestoreFile.addEventListener('change', function(e) {
             let file = e.target.files[0];
             if(!file) return;
             let reader = new FileReader();
             reader.onload = function(evt) {
                 try {
                     let data = JSON.parse(evt.target.result);
                     window.books = data.books || []; window.members = data.members || []; 
                     window.historyStore = data.history || []; window.recommendations = data.recommendations || [];
                     window.saveData(); window.renderBooks(); window.renderMembers();
                     alert('Database Local Storage restitched successfully!');
                 } catch(err) { alert('CRITICAL: Invalid JSON Backup format.'); }
             };
             reader.readAsText(file);
        });
    }

});
