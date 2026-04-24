import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Layers, Fingerprint } from 'lucide-react';

const ResultsComponent = ({ data }) => {
    if (!data) return null;

    const { hierarchies, invalid_entries, duplicate_edges, summary, user_id, email_id, college_roll_number } = data;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <motion.div variants={itemVariants} className="stat-grid">
                <div className="minimal-stat">
                    <span className="val">{summary.total_trees}</span>
                    <span className="lbl" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Layers size={12}/> Disjoint Trees</span>
                </div>
                <div className="minimal-stat">
                    <span className="val" style={{ color: summary.total_cycles > 0 ? "var(--error)" : "var(--text-main)"}}>{summary.total_cycles}</span>
                    <span className="lbl" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertTriangle size={12}/> Closed Cycles</span>
                </div>
                <div className="minimal-stat">
                    <span className="val" style={{ fontSize: '1.25rem', marginTop: '0.5rem' }}>{summary.largest_tree_root || "N/A"}</span>
                    <span className="lbl">Deepest Root</span>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="stellar-card" style={{ padding: '0' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CheckCircle2 size={16} color="var(--success)"/> Computed Hierarchies
                    </h3>
                </div>
                
                <div style={{ padding: '1.5rem' }}>
                    {hierarchies.length === 0 ? (
                        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>No valid structural patterns detected in the dataset.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {hierarchies.map((h, idx) => (
                                <div key={idx} style={{ paddingLeft: '1rem', borderLeft: h.has_cycle ? '2px solid var(--error)' : '2px solid var(--border)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: "0.75rem" }}>
                                        <div className="badge-min">root: {h.root}</div>
                                        {h.depth !== undefined && <div className="badge-min">depth: {h.depth}</div>}
                                        {h.has_cycle && <div className="badge-min error">CYCLE DETECTED</div>}
                                    </div>
                                    <div className="code-block">
                                        <pre style={{ margin: 0 }}>{JSON.stringify(h.tree, null, 2)}</pre>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {(invalid_entries?.length > 0 || duplicate_edges?.length > 0) && (
                    <div className="stellar-card">
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>Data Anomalies</h3>
                        
                        {invalid_entries?.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Parse Failures</p>
                                <div>
                                    {invalid_entries.map((entry, idx) => (
                                        <span key={idx} className="badge-min error">{String(entry)}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {duplicate_edges?.length > 0 && (
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Redundant Edges</p>
                                <div>
                                    {duplicate_edges.map((entry, idx) => (
                                        <span key={idx} className="badge-min warn">{String(entry)}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
                
                <div className="stellar-card" style={{ flexGrow: 1 }}>
                     <h3 style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)', marginBottom: '1rem' }}>Raw Payload Output</h3>
                     <div className="code-block" style={{ maxHeight: '200px' }}>
                        <pre style={{ margin: 0, fontSize: '0.75rem', color: '#888' }}>
                            {JSON.stringify({ hierarchies, invalid_entries, duplicate_edges, summary }, null, 2)}
                        </pre>
                     </div>
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="user-identity">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', width: '100%', marginBottom: '0.5rem' }}>
                    <Fingerprint size={16}/> <strong>Authentication Trace</strong>
                </div>
                <div className="field">UID: <span>{user_id}</span></div>
                <div className="field">EMAIL: <span>{email_id}</span></div>
                <div className="field">ROLL: <span>{college_roll_number}</span></div>
            </motion.div>

        </motion.div>
    );
};

export default ResultsComponent;
