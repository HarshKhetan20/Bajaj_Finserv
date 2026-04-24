import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network } from 'lucide-react';
import InputComponent from './components/InputComponent';
import ResultsComponent from './components/ResultsComponent';
import { submitGraphData } from './services/api';
import './index.css';

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [appReady, setAppReady] = useState(false);

  // Initial Sharp Loader
  useEffect(() => {
    const timer = setTimeout(() => setAppReady(true), 2100);
    return () => clearTimeout(timer);
  }, []);

  const handleGraphSubmission = async (dataArray) => {
    setLoading(true);
    setGlobalError(null);
    try {
      const response = await submitGraphData(dataArray);
      setResults(response);
    } catch (err) {
      setGlobalError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bgtwo"></div>
      <div className="bgone"></div>
      <div className="grid-bg"></div>

      <AnimatePresence>
        {!appReady && (
          <motion.div
            key="loader"
            className="loader-container"
            exit={{ y: '-100vh', opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <Network size={48} color="#fff" strokeWidth={1} style={{ marginBottom: '1rem' }} />
              <motion.div
                initial={{ opacity: 0, letterSpacing: '10px' }}
                animate={{ opacity: 1, letterSpacing: '2px' }}
                transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                style={{ fontFamily: 'Inter', fontSize: '1rem', textTransform: 'uppercase', color: '#fff', letterSpacing: '2px' }}
              >
                Topological Engine
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {appReady && (
        <motion.div 
          className="layout-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <header style={{ marginBottom: '3rem' }}>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="typo-h1"
            >
              Graph Analyzer
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="typo-sub"
            >
              Advanced topological analysis and cyclic mapping engine for the SRM challenge. Enter your node metrics to compute hierarchical matrices.
            </motion.p>
          </header>

          <main style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <InputComponent onSubmit={handleGraphSubmission} isLoading={loading} />
            
            <AnimatePresence>
              {globalError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="stellar-card" 
                  style={{ borderColor: 'var(--error-bg)' }}
                >
                  <p style={{ color: 'var(--error)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--error)'}}></span>
                    {globalError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <ResultsComponent data={results} />
          </main>
        </motion.div>
      )}
    </>
  );
}

export default App;
