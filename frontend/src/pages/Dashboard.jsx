import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const STATUS_COLORS = {
    applied: { bg: 'rgba(102,126,234,0.2)', color: '#667eea' },
    interview: { bg: 'rgba(99,255,160,0.2)', color: '#63ffa0' },
    rejected: { bg: 'rgba(255,99,99,0.2)', color: '#ff6363' },
    offered: { bg: 'rgba(255,200,99,0.2)', color: '#ffc863' },
    accepted: { bg: 'rgba(99,200,255,0.2)', color: '#63c8ff' },
};

export default function Dashboard() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editJob, setEditJob] = useState(null);
    const { logout } = useAuth();
    const navigate = useNavigate();

    const fetchJobs = async () => {
        try {
            const params = {};
            if (search) params.search = search;
            if (statusFilter) params.status = statusFilter;
            const res = await api.get('/api/jobs/', { params });
            setJobs(res.data.results || res.data);
        } catch {
            logout();
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJobs(); }, [search, statusFilter]);

    const handleDelete = async (id) => {
        if (!confirm('Delete this application?')) return;
        await api.delete(`/api/jobs/${id}/`);
        fetchJobs();
    };

    const handleEdit = (job) => {
        setEditJob(job);
        setShowForm(true);
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <div>
                    <h1 style={{ fontSize: '26px', fontWeight: '700' }}>Job Applications</h1>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{jobs.length} total</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={() => { setEditJob(null); setShowForm(true); }}>
                        + Add Job
                    </button>
                    <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={() => { logout(); navigate('/'); }}>
                        Logout
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="glass" style={{ padding: '16px 20px', marginBottom: '24px', display: 'flex', gap: '12px' }}>
                <input
                    placeholder="Search company, title, notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1 }}
                />
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ width: '160px' }}>
                    <option value="">All Status</option>
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="rejected">Rejected</option>
                    <option value="offered">Offered</option>
                    <option value="accepted">Accepted</option>
                </select>
            </div>

            {/* Job Cards */}
            {loading ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
            ) : jobs.length === 0 ? (
                <div className="glass" style={{ padding: '60px', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '16px' }}>No applications yet. Add your first one!</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {jobs.map((job) => {
                        const s = STATUS_COLORS[job.status] || STATUS_COLORS.applied;
                        return (
                            <div key={job.id} className="glass" style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{job.job_title}</h3>
                                        <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' }}>
                                            {job.status}
                                        </span>
                                    </div>
                                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{job.company}</p>
                                    {job.notes && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginTop: '4px' }}>{job.notes}</p>}
                                </div>
                                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                                    <button className="btn btn-success" onClick={() => handleEdit(job)}>Edit</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(job.id)}>Delete</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Form Modal */}
            {showForm && (
                <JobForm
                    job={editJob}
                    onClose={() => setShowForm(false)}
                    onSave={() => { setShowForm(false); fetchJobs(); }}
                />
            )}
        </div>
    );
}

function JobForm({ job, onClose, onSave }) {
    const [form, setForm] = useState({
        company: job?.company || '',
        job_title: job?.job_title || '',
        job_url: job?.job_url || '',
        status: job?.status || 'applied',
        date_applied: job?.date_applied || new Date().toISOString().split('T')[0],
        notes: job?.notes || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (job) {
                await api.put(`/api/jobs/${job.id}/`, form);
            } else {
                await api.post('/api/jobs/', form);
            }
            onSave();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '32px' }}>
                <h2 style={{ marginBottom: '24px' }}>{job ? 'Edit Application' : 'Add Application'}</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gap: '16px' }}>
                        <div><label>Company</label><input placeholder="e.g. Google" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required /></div>
                        <div><label>Job Title</label><input placeholder="e.g. Backend Developer" value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} required /></div>
                        <div><label>Job URL (optional)</label><input placeholder="https://..." value={form.job_url} onChange={(e) => setForm({ ...form, job_url: e.target.value })} /></div>
                        <div>
                            <label>Status</label>
                            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                                <option value="applied">Applied</option>
                                <option value="interview">Interview</option>
                                <option value="rejected">Rejected</option>
                                <option value="offered">Offered</option>
                                <option value="accepted">Accepted</option>
                            </select>
                        </div>
                        <div><label>Date Applied</label><input type="date" value={form.date_applied} onChange={(e) => setForm({ ...form, date_applied: e.target.value })} required /></div>
                        <div><label>Notes (optional)</label><textarea placeholder="Any notes..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} /></div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                        <button className="btn btn-primary" type="submit" style={{ flex: 1 }}>
                            {loading ? 'Saving...' : job ? 'Update' : 'Add Application'}
                        </button>
                        <button className="btn" type="button" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff' }} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}