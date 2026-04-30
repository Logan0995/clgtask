import React, { useState, useContext } from 'react';
import Layout from '../../components/Layout';
import { message } from 'antd';
import { StoreContext } from '../../contexts/StoreContext';

const Fines = () => {
    const { books } = useContext(StoreContext);
    const [memberId, setMemberId] = useState('');
    const [fineResult, setFineResult] = useState('');

    const handleCalculateFines = (e) => {
        e.preventDefault();
        const overdueBooks = books.filter(b => b.issuedTo === memberId.trim() && new Date(b.dueDate) < new Date());

        if (overdueBooks.length > 0) {
            let totalDays = 0;
            overdueBooks.forEach(b => {
                const diff = new Date() - new Date(b.dueDate);
                totalDays += Math.floor(diff / (1000 * 60 * 60 * 24));
            });
            setFineResult(`Calculated Fine: $${totalDays}.00 for ${overdueBooks.length} overdue books.`);
        } else {
            setFineResult("Account holds no outstanding fines.");
        }
    };

    const handleGenerateReport = () => {
        const active = books.filter(b => b.status === 'Issued').length;
        const overdue = books.filter(b => b.status === 'Issued' && new Date(b.dueDate) < new Date()).length;
        alert(`Librarian Report:\nCurrently active issues: ${active}\nOverdue items: ${overdue}`);
    };

    return (
        <Layout
            role="librarian"
            title="Fines & Reports"
            subtitle="Calculate member fines and generate librarian reports."
        >
            <div className="management-grid">
                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>💰 Fine Calculator</h3></div>
                    <div className="card-body" style={{ padding: '2rem 1.5rem' }}>
                        <form className="functional-form" onSubmit={handleCalculateFines}>
                            <div className="input-group">
                                <label>Member ID</label>
                                <input type="text" placeholder="e.g. S001" value={memberId} onChange={e => setMemberId(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn-primary w-100" style={{ padding: '1rem' }}>Calculate Member Fines</button>
                        </form>
                        {fineResult && (
                            <div className="result-banner" style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                                <strong>{fineResult}</strong>
                            </div>
                        )}
                    </div>
                </div>

                <div className="management-card" style={{ gridColumn: '1 / -1' }}>
                    <div className="card-header"><h3>📊 Daily Reports</h3></div>
                    <div className="card-body" style={{ padding: '2rem 1.5rem' }}>
                        <button className="btn-outline" onClick={handleGenerateReport} style={{ padding: '1rem 2rem' }}>
                            Generate Active Issue Report
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Fines;
