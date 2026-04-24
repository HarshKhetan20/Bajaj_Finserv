import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const InputComponent = ({ onSubmit, isLoading }) => {
    const [inputValue, setInputValue] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = () => {
        try {
            setError(null);
            if (!inputValue.trim()) {
                throw new Error("Input payload cannot be empty.");
            }

            let parsedData;
            try {
                parsedData = JSON.parse(inputValue);
                // Handle case where user wraps array inside an object { "data": [...] }
                if (parsedData && !Array.isArray(parsedData) && Array.isArray(parsedData.data)) {
                    parsedData = parsedData.data;
                }
            } catch (e) {
                parsedData = inputValue.split(/[\n,]+/).map(s => s.trim()).filter(s => s);
            }

            if (!Array.isArray(parsedData)) {
                throw new Error("Invalid structure. Must be JSON array or separated strings.");
            }

            onSubmit(parsedData);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <motion.div 
            className="stellar-card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--text-main)", marginBottom: "0.25rem" }}>Dataset Input</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Supply a JSON array or line-break separated structural links.
                </p>
            </div>
            
            <textarea
                className="stellar-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={'[\n  "A->B",\n  "B->C"\n]'}
                spellCheck="false"
            />
            
            {error && (
                <div className="badge-min error" style={{ marginTop: "1rem", display: 'block', width: 'fit-content' }}>
                    {error}
                </div>
            )}
            
            <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                <button 
                    className="stellar-btn" 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="spinner-minimal"></div> 
                            <span>Evaluating...</span>
                        </>
                    ) : (
                        <>
                            <Play size={16} fill="currentColor" /> 
                            <span>Compute Graph</span>
                        </>
                    )}
                </button>
            </div>
        </motion.div>
    );
};

export default InputComponent;
