import React, { useContext, useState } from 'react';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';

const Members = () => {
    const { members, setMembers } = useContext(StoreContext);
    const [searchTerm, setSearchTerm] = useState('');

    const handleRemoveMember = (idToRemove) => {
        setMembers(members.filter(m => m.id !== idToRemove));
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout
            role="admin"
            title="Members Registry"
            subtitle="All registered students, faculty, and staff."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
        >
            <div className="management-grid">
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>👥 Registered Members</h3></div>
                    <div className="card-body">
                        <ul className="functional-list">
                            {filteredMembers.length === 0 ? (
                                <li>No members found.</li>
                            ) : (
                                filteredMembers.map(member => {
                                    let badgeClass = 'badge-student';
                                    if (member.role === 'Faculty') badgeClass = 'badge-faculty';
                                    if (member.role === 'Librarian') badgeClass = 'badge-librarian';

                                    return (
                                        <li key={member.id}>
                                            <div className="item-info">
                                                <strong>{member.name}</strong>
                                                <span>ID: {member.id} &nbsp; <span className={`role-badge ${badgeClass}`}>{member.role}</span></span>
                                            </div>
                                            <button className="btn-danger" onClick={() => handleRemoveMember(member.id)}>Remove</button>
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Members;
