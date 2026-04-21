import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const AddMember = () => {
    const { members, setMembers } = useContext(StoreContext);
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [memberId, setMemberId] = useState('');
    const [role, setRole] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic check if member ID exists
        if (members.find(m => m.id === memberId.trim())) {
            alert('Member ID already exists!');
            return;
        }

        const newMember = {
            name: name.trim(),
            id: memberId.trim(),
            role: role
        };
        setMembers([...members, newMember]);
        alert('Member safely registered in the database.');
        navigate('/admin/members');
    };

    return (
        <Layout
            role="admin"
            title="Register Member"
            subtitle="Add a new student, faculty, or staff member to the system."
        >
            <div className="management-card" style={{ maxWidth: '640px', margin: '0 auto' }}>
                <div className="card-header"><h3>👤 Member Details</h3></div>
                <div className="card-body" style={{ padding: '2.5rem' }}>
                    <form className="functional-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Full Name</label>
                            <input type="text" placeholder="e.g. Ananya Sharma" value={name} onChange={e => setName(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Member ID</label>
                            <input type="text" placeholder="e.g. S002" value={memberId} onChange={e => setMemberId(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label>Role</label>
                            <select className="functional-form-select" value={role} onChange={e => setRole(e.target.value)} required>
                                <option value="">-- Select Role --</option>
                                <option value="Student">Student</option>
                                <option value="Faculty">Faculty</option>
                                <option value="Librarian">Librarian</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary w-100" style={{ marginTop: '0.75rem', padding: '1rem' }}>Register Member</button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AddMember;
