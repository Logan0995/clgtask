// ==========================================
// UNIVERSAL UI CONTROLLER (Sidebar & Tabs)
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    var toggleBtn = document.getElementById('toggleSidebar');
    var sidebar = document.getElementById('sidebar');
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
    }

    // Tab Navigation
    var navItems = document.querySelectorAll('.nav-links li[data-section]');
    navItems.forEach(item => {
        item.querySelector('a').addEventListener('click', function (e) {
            e.preventDefault();
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-section'));
            var ts = document.getElementById(item.getAttribute('data-section'));
            if (ts) ts.classList.add('active-section');
        });
    });

    // Initial Renders (Depends on store.js loading first)
    if(typeof window.renderBooks === 'function') window.renderBooks();
    if(typeof window.renderMembers === 'function') window.renderMembers();
    if(typeof window.updateStats === 'function') window.updateStats();

    // Setup User Profile globally
    let activeUser = localStorage.getItem('activeUser');
    let activeUserName = localStorage.getItem('activeUserName');
    let activeUserRole = localStorage.getItem('activeUserRole');

    if(activeUser) {
        let nameEl = document.querySelector('.user-profile .name');
        let roleEl = document.querySelector('.user-profile .role');
        let avatarEl = document.querySelector('.user-profile .avatar');
        
        if(activeUser === 'admin') {
            if(nameEl) nameEl.textContent = 'Admin Supervisor';
            if(roleEl) roleEl.textContent = 'admin';
            if(avatarEl) avatarEl.textContent = 'A';
        } else if(activeUser === 'librarian') {
            if(nameEl) nameEl.textContent = 'Library Staff';
            if(roleEl) roleEl.textContent = 'librarian';
            if(avatarEl) avatarEl.textContent = 'L';
        } else {
            if(nameEl) nameEl.textContent = activeUserName || activeUser;
            if(roleEl) roleEl.textContent = activeUserRole + ' (' + activeUser + ')';
            if(avatarEl) avatarEl.textContent = (activeUserName || activeUser).charAt(0).toUpperCase();
        }
    }
});
