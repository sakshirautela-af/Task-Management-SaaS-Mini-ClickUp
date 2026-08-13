import './RightSidebar.css';

export default function RightSidebar({ projects = [] }) {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'INPROGRESS' || p.status === 'TODO').length;
    const completed = projects.filter(p => p.status === 'COMPLETED').length;
    const onHold = projects.filter(p => p.status === 'CANCELLED').length;

    // Calculate conic gradient percentages
    let activePct = 0, completedPct = 0, onHoldPct = 0;
    if (total > 0) {
        activePct = Math.round((active / total) * 100);
        completedPct = Math.round((completed / total) * 100);
        onHoldPct = 100 - activePct - completedPct;
    } else {
        // Default gradient if empty
        activePct = 100;
        completedPct = 0;
        onHoldPct = 0;
    }

    const gradient = `conic-gradient(
        #4f46e5 0% ${activePct}%, 
        #10b981 ${activePct}% ${activePct + completedPct}%, 
        #f59e0b ${activePct + completedPct}% 100%
    )`;

    return (
        <div className="right-sidebar">
            <div className="rs-widget">
                <div className="rs-header">
                    <h4>Recent Activity</h4>
                    <a href="#">View All</a>
                </div>
                <div className="activity-list" style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8', fontSize: '0.9rem' }}>
                    No recent activity.
                </div>
            </div>

            <div className="rs-widget">
                <div className="rs-header">
                    <h4>Project Stats</h4>
                </div>
                <div className="stats-chart-container">
                    <div className="donut-chart" style={{ background: gradient }}>
                        <div className="donut-inner">
                            <strong>{total}</strong>
                            <span>Total</span>
                        </div>
                    </div>
                    <div className="chart-legend">
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#4f46e5'}}></span> Active ({active})</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#10b981'}}></span> Completed ({completed})</div>
                        <div className="legend-item"><span className="dot" style={{backgroundColor: '#f59e0b'}}></span> On Hold ({onHold})</div>
                    </div>
                </div>
            </div>

            <div className="rs-widget">
                <div className="rs-header">
                    <h4>Quick Links</h4>
                </div>
                <div className="quick-links">
                    <a href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        View Calendar
                        <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                    <a href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        My Tasks
                        <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                    <a href="#">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                        Team Members
                        <svg className="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
