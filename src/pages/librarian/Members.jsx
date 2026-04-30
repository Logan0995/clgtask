import React, { useContext, useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { StoreContext } from '../../contexts/StoreContext';
import API from '../../api';

const API_URL = '/api';

const LibrarianMembers = () => {
    const { members } = useContext(StoreContext);
    const [allMembers, setAllMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState('All');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await API.get(`${API_URL}/members/all`);
                setAllMembers(res.data);
            } catch (err) {
                // fallback to context members
                setAllMembers(members);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [members]);

    const filtered = allMembers.filter(m => {
        const matchesSearch =
            m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.role.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'All' || m.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const studentCount = allMembers.filter(m => m.role === 'Student').length;
    const facultyCount = allMembers.filter(m => m.role === 'Faculty').length;
    const librarianCount = allMembers.filter(m => m.role === 'Librarian').length;

    return (
        <Layout
            role="librarian"
            title="Member Directory"
            subtitle="Browse all registered library members and their IDs."
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
        >
            <div className="management-grid">

                {/* Stats Row */}
                <div className="management-card" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{studentCount}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>📘 Students</div>
                    </div>
                </div>
                <div className="management-card" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--warning)' }}>{facultyCount}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>🎓 Faculty</div>
                    </div>
                </div>
                <div className="management-card" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--success)' }}>{librarianCount}</div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>📚 Librarians</div>
                    </div>
                </div>

                {/* Member Table */}
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>👥 All Members ({filtered.length})</h3>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['All', 'Student', 'Faculty', 'Librarian'].map(r => (
                                <button
                                    key={r}
                                    onClick={() => setFilterRole(r)}
                                    style={{
                                        padding: '0.4rem 0.9rem',
                                        borderRadius: '999px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        fontWeight: 600,
                                        background: filterRole === r ? 'var(--primary)' : 'var(--bg-card)',
                                        color: filterRole === r ? '#fff' : 'var(--text-light)',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="card-body">
                        {loading ? (
                            <p style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>Loading members...</p>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                    <thead>
                                        <tr style={{ borderBottom: '2px solid var(--border)' }}>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-light)', fontWeight: 600 }}>#</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-light)', fontWeight: 600 }}>Member ID</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-light)', fontWeight: 600 }}>Full Name</th>
                                            <th style={{ textAlign: 'left', padding: '0.75rem 1rem', color: 'var(--text-light)', fontWeight: 600 }}>Role</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filtered.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
                                                    No members found.
                                                </td>
                                            </tr>
                                        ) : (
                                            filtered.map((member, index) => {
                                                let badgeColor = 'var(--primary)';
                                                let bgColor = 'var(--primary-light)';
                                                if (member.role === 'Faculty') { badgeColor = 'var(--warning)'; bgColor = 'var(--warning-light)'; }
                                                if (member.role === 'Librarian') { badgeColor = 'var(--success)'; bgColor = 'var(--success-light)'; }

                                                return (
                                                    <tr key={member.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card)'}
                                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                    >
                                                        <td style={{ padding: '0.85rem 1rem', color: 'var(--text-light)' }}>{index + 1}</td>
                                                        <td style={{ padding: '0.85rem 1rem' }}>
                                                            <code style={{
                                                                background: 'var(--bg-card)',
                                                                padding: '0.2rem 0.5rem',
                                                                borderRadius: '4px',
                                                                fontFamily: 'monospace',
                                                                fontSize: '0.875rem',
                                                                fontWeight: 700,
                                                                color: 'var(--primary)'
                                                            }}>{member.id}</code>
                                                        </td>
                                                        <td style={{ padding: '0.85rem 1rem', fontWeight: 500 }}>{member.name}</td>
                                                        <td style={{ padding: '0.85rem 1rem' }}>
                                                            <span style={{
                                                                background: bgColor,
                                                                color: badgeColor,
                                                                padding: '0.2rem 0.65rem',
                                                                borderRadius: '999px',
                                                                fontSize: '0.78rem',
                                                                fontWeight: 700
                                                            }}>{member.role}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default LibrarianMembers;
