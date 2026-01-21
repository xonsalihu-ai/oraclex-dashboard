import React, { useEffect, useState } from 'react';

export default function OracleXDashboard() {
  const [data, setData] = useState(null);
  const [debug, setDebug] = useState([]);

  const addDebug = (msg) => {
    const time = new Date().toLocaleTimeString();
    setDebug(prev => [...prev.slice(-9), `${time}: ${msg}`]);
  };

  const fetchData = async () => {
    try {
      addDebug('Starting fetch...');
      
      // Only call Relay - it handles Python internally
      const relayUrl = 'https://oraclex-relay-production.up.railway.app';
      
      addDebug(`Fetching from Relay: ${relayUrl}/get-market-state`);
      const relayResp = await fetch(`${relayUrl}/get-market-state`);
      const relayData = await relayResp.json();
      
      const marketData = relayData.market_data || [];
      addDebug(`✓ Relay returned: ${marketData.length} symbols`);
      
      // Format for display
      const formatted = {};
      for (const sym of marketData) {
        formatted[sym.symbol] = sym;
      }
      
      setData(formatted);
      addDebug('✓ Display updated');
    } catch (error) {
      addDebug(`❌ Error: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 second refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#0a0e27', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#00ff88' }}>🟢 OracleX V2.1</h1>
      <p>Market Intelligence Dashboard</p>

      {/* Market Data Grid */}
      <div style={{ marginTop: '30px' }}>
        <h2>Market Data</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
          {data ? (
            Object.entries(data).map(([symbol, symData]) => (
              <div key={symbol} style={{
                border: '1px solid #00ff88',
                padding: '15px',
                borderRadius: '5px',
                background: '#111'
              }}>
                <h3 style={{ color: '#00ff88', margin: '0 0 10px 0' }}>{symbol}</h3>
                <div style={{ fontSize: '14px' }}>
                  <p>Price: ${(symData.price || 0).toFixed(2)}</p>
                  <p>Spread: {symData.spread_points || 0} pts</p>
                  <p>Timeframes: {symData.timeframes ? symData.timeframes.length : 0}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>

      {/* Debug Panel */}
      <div style={{ marginTop: '40px', padding: '15px', background: '#111', border: '1px solid #666', borderRadius: '5px' }}>
        <h3 style={{ color: '#ffaa00', margin: '0 0 10px 0' }}>Debug</h3>
        {debug.map((msg, i) => (
          <div key={i} style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
}
