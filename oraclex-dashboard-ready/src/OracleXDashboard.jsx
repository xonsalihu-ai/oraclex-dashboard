import React, { useEffect, useState } from 'react';

export default function OracleXDashboard() {
  const [symbols, setSymbols] = useState({});
  const [debug, setDebug] = useState([]);
  const [loading, setLoading] = useState(true);

  const addDebug = (msg) => {
    const time = new Date().toLocaleTimeString();
    setDebug(prev => [...prev.slice(-14), `${time}: ${msg}`]);
  };

  const fetchData = async () => {
    try {
      addDebug('Starting fetch...');
      setLoading(true);
      
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
      
      setSymbols(formatted);
      addDebug('✓ Data merged and displayed');
      setLoading(false);
    } catch (error) {
      addDebug(`❌ Error: ${error.message}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30 second refresh
    return () => clearInterval(interval);
  }, []);

  const symbolList = ['XAUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'];

  return (
    <div style={{
      background: '#0a0e27',
      color: '#e0e0e0',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '40px', borderBottom: '2px solid #00d9ff', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', color: '#00ff88' }}>
          🟢 OracleX V2.1
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>
          Market Intelligence & Analysis Platform
        </p>
        {loading && <p style={{ color: '#ffaa00', marginTop: '10px' }}>Loading...</p>}
      </div>

      {/* Market Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '18px', color: '#00d9ff', marginBottom: '15px' }}>
          Market Data ({Object.keys(symbols).length} symbols)
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '15px'
        }}>
          {symbolList.map(sym => {
            const data = symbols[sym];
            const hasData = !!data;
            
            return (
              <div key={sym} style={{
                background: '#111827',
                border: `2px solid ${hasData ? '#00ff88' : '#444'}`,
                borderRadius: '8px',
                padding: '15px',
                position: 'relative'
              }}>
                {/* Symbol Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px',
                  paddingBottom: '12px',
                  borderBottom: '1px solid #333'
                }}>
                  <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    color: '#00ff88',
                    fontWeight: 'bold'
                  }}>
                    {sym}
                  </h3>
                  {hasData && (
                    <span style={{
                      background: '#00ff8833',
                      color: '#00ff88',
                      padding: '2px 8px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      fontWeight: 'bold'
                    }}>
                      LIVE
                    </span>
                  )}
                </div>

                {hasData ? (
                  <>
                    {/* Price Info */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>Price</div>
                      <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#00d9ff' }}>
                        ${(data.price || 0).toFixed(2)}
                      </div>
                    </div>

                    {/* Spread */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '3px' }}>Spread</div>
                      <div style={{ fontSize: '14px', color: '#e0e0e0' }}>
                        {data.spread_points || 0} pts
                      </div>
                    </div>

                    {/* Timeframes */}
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '5px' }}>Timeframes</div>
                      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                        {data.timeframes ? data.timeframes.map((tf, i) => (
                          <span key={i} style={{
                            background: '#00ff8844',
                            color: '#00ff88',
                            padding: '2px 6px',
                            borderRadius: '3px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}>
                            {tf.timeframe}
                          </span>
                        )) : <span style={{ color: '#666', fontSize: '12px' }}>No data</span>}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ color: '#666', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                    Waiting for data...
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Debug Panel */}
      <div style={{
        background: '#0f1419',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '15px',
        marginTop: '30px'
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '13px',
          color: '#ffaa00',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          System Debug
        </h3>
        <div style={{
          background: '#000',
          borderRadius: '4px',
          padding: '10px',
          fontFamily: 'monospace',
          fontSize: '11px',
          maxHeight: '200px',
          overflowY: 'auto'
        }}>
          {debug.length === 0 ? (
            <div style={{ color: '#666' }}>Initializing...</div>
          ) : (
            debug.map((msg, i) => (
              <div key={i} style={{
                color: msg.includes('❌') ? '#ff6b6b' : msg.includes('✓') ? '#00ff88' : '#888',
                marginBottom: '2px',
                lineHeight: '1.4'
              }}>
                {msg}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '30px',
        paddingTop: '20px',
        borderTop: '1px solid #333',
        textAlign: 'center',
        color: '#666',
        fontSize: '12px'
      }}>
        Updating every 30 seconds • Data from Relay • Python Analysis
      </div>
    </div>
  );
}
