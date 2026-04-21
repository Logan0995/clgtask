import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './contexts/StoreContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBooks from './pages/admin/Books';
import AdminAddBook from './pages/admin/AddBook';
import AdminMembers from './pages/admin/Members';
import AdminAddMember from './pages/admin/AddMember';
import LibrarianDashboard from './pages/librarian/Dashboard';
import LibrarianBooks from './pages/librarian/Books';
import LibrarianAddBook from './pages/librarian/AddBook';
import LibrarianFines from './pages/librarian/Fines';
import StudentDashboard from './pages/student/Dashboard';
import StudentBooks from './pages/student/Books';
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyBooks from './pages/faculty/Books';

const App = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/books" element={<AdminBooks />} />
          <Route path="/admin/add-book" element={<AdminAddBook />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/add-member" element={<AdminAddMember />} />
          
          {/* Librarian Routes */}
          <Route path="/librarian" element={<LibrarianDashboard />} />
          <Route path="/librarian/books" element={<LibrarianBooks />} />
          <Route path="/librarian/add-book" element={<LibrarianAddBook />} />
          <Route path="/librarian/fines" element={<LibrarianFines />} />
          
          {/* Student Routes */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/books" element={<StudentBooks />} />

          {/* Faculty Routes */}
          <Route path="/faculty" element={<FacultyDashboard />} />
          <Route path="/faculty/books" element={<FacultyBooks />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
};

export default App;
