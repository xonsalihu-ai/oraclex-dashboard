import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Zap, Activity, Gauge } from 'lucide-react';

const OracleXDashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trader-read');
  const [lastUpdate, setLastUpdate] = useState(null);
  const [debug, setDebug] = useState([]);

  const symbols = ['XAUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'];

  const addDebug = (msg) => {
    const time = new Date().toLocaleTimeString();
    setDebug(prev => [...prev.slice(-9), `${time}: ${msg}`]);
  };

  // Fetch from Relay (has market data + analysis merged by Python)
  useEffect(() => {
    const fetchData = async () => {
      try {
        addDebug('Starting fetch...');
        setLoading(true);

        const relayUrl = 'https://oraclex-relay-production.up.railway.app';
        addDebug(`Fetching from Relay: ${relayUrl}/get-market-state`);

        const resp = await fetch(`${relayUrl}/get-market-state`);
        const data = await resp.json();
        
        const marketData = data.market_data || [];
        addDebug(`✓ Relay returned: ${marketData.length} symbols`);

        // Format data
        const formatted = {};
        for (const sym of marketData) {
          formatted[sym.symbol] = {
            ...sym,
            // Default analysis if not provided
            confluence: sym.confluence || 65,
            confidence: sym.confidence || 72,
            bias: sym.bias || 'NEUTRAL',
            market_regime: sym.market_regime || { trend: 'Unknown', volatility: 'Normal', structure: 'Unknown' },
            interpretation: sym.interpretation || 'Waiting for analysis...',
            session: sym.session || 'Unknown',
            state_statistics: sym.state_statistics || { continuation: 45, reversal: 35, consolidation: 20 },
            confluence_breakdown: sym.confluence_breakdown || {},
            bias_stability: sym.bias_stability || { bias: 'NEUTRAL', active_since_minutes: 0 }
          };
        }

        setMarketData(formatted);
        setLastUpdate(new Date());
        addDebug('✓ Data merged and displayed');
        setLoading(false);
      } catch (error) {
        addDebug(`❌ Error: ${error.message}`);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentData = marketData[selectedSymbol];

  // Get bias color
  const getBiasColor = (bias) => {
    if (bias === 'BULLISH') return '#00ff88';
    if (bias === 'BEARISH') return '#ff6b6b';
    return '#ffaa00';
  };

  // Get confluence color
  const getConfluenceColor = (value) => {
    if (value >= 70) return '#00ff88';
    if (value >= 50) return '#ffaa00';
    return '#ff6b6b';
  };

  return (
    <div style={{
      background: '#0a0e27',
      color: '#e0e0e0',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      {/* ===== HEADER ===== */}
      <div style={{ marginBottom: '30px', borderBottom: '2px solid #00d9ff', paddingBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '32px', color: '#00ff88', fontWeight: 'bold' }}>
          🟢 OracleX V2.1
        </h1>
        <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '14px' }}>
          Market Intelligence & Analysis Platform
        </p>
        {lastUpdate && (
          <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '12px' }}>
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* ===== SYMBOL SELECTOR ===== */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {symbols.map(sym => (
            <button
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              style={{
                background: selectedSymbol === sym ? '#00ff8844' : '#1a1f35',
                color: selectedSymbol === sym ? '#00ff88' : '#e0e0e0',
                border: selectedSymbol === sym ? '2px solid #00ff88' : '1px solid #333',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: selectedSymbol === sym ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              {sym}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>Loading...</div>
      ) : !currentData ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>No data for {selectedSymbol}</div>
      ) : (
        <>
          {/* ===== MAIN CONFLUENCE DISPLAY ===== */}
          <div style={{
            background: '#111827',
            border: '2px solid #00d9ff',
            borderRadius: '10px',
            padding: '30px',
            marginBottom: '30px',
            textAlign: 'center'
          }}>
            <div style={{ color: '#888', fontSize: '13px', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Market Confluence
            </div>
            <div style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: getConfluenceColor(currentData.confluence),
              marginBottom: '10px'
            }}>
              {currentData.confluence.toFixed(1)}%
            </div>
            <div style={{ color: '#888', fontSize: '13px' }}>
              Confidence: <span style={{ color: '#00d9ff', fontWeight: 'bold' }}>{currentData.confidence.toFixed(1)}%</span>
            </div>
            <div style={{
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #333',
              color: '#00ff88',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              Bias: {currentData.bias}
            </div>
          </div>

          {/* ===== TRADER READ ===== */}
          {activeTab === 'trader-read' && (
            <div style={{
              background: '#111827',
              border: '2px solid #00ff88',
              borderRadius: '10px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 15px 0', color: '#00ff88', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                📖 Trader Read
              </h2>
              <p style={{
                margin: 0,
                color: '#e0e0e0',
                fontSize: '15px',
                lineHeight: '1.6',
                fontStyle: 'italic'
              }}>
                {currentData.interpretation || 'Analyzing market conditions...'}
              </p>
            </div>
          )}

          {/* ===== MARKET REGIME ===== */}
          {activeTab === 'market-regime' && (
            <div style={{
              background: '#111827',
              border: '2px solid #00d9ff',
              borderRadius: '10px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#00d9ff', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                📊 Market Regime
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Trend</div>
                  <div style={{ color: '#00ff88', fontSize: '18px', fontWeight: 'bold' }}>
                    {currentData.market_regime?.trend || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Volatility</div>
                  <div style={{ color: '#ffaa00', fontSize: '18px', fontWeight: 'bold' }}>
                    {currentData.market_regime?.volatility || 'Unknown'}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Structure</div>
                  <div style={{ color: '#00d9ff', fontSize: '18px', fontWeight: 'bold' }}>
                    {currentData.market_regime?.structure || 'Unknown'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== BIAS STABILITY ===== */}
          {activeTab === 'bias-stability' && (
            <div style={{
              background: '#111827',
              border: '2px solid #ffaa00',
              borderRadius: '10px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#ffaa00', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                ⚡ Bias Stability
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Current Bias</div>
                  <div style={{
                    color: getBiasColor(currentData.bias_stability?.bias || currentData.bias),
                    fontSize: '20px',
                    fontWeight: 'bold'
                  }}>
                    {currentData.bias_stability?.bias || currentData.bias}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Active Since</div>
                  <div style={{ color: '#00d9ff', fontSize: '20px', fontWeight: 'bold' }}>
                    {currentData.bias_stability?.active_since_minutes || 0} min
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== SESSION INTELLIGENCE ===== */}
          {activeTab === 'session' && (
            <div style={{
              background: '#111827',
              border: '2px solid #ff6b9d',
              borderRadius: '10px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#ff6b9d', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🌍 Session Intelligence
              </h2>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Current Session</div>
                <div style={{ color: '#00ff88', fontSize: '18px', fontWeight: 'bold' }}>
                  {currentData.session || 'Unknown'}
                </div>
              </div>
              <div style={{ paddingTop: '20px', borderTop: '1px solid #333' }}>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '12px' }}>Historical Outcomes</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ color: '#888', fontSize: '11px' }}>Continuation</div>
                    <div style={{ color: '#00ff88', fontSize: '16px', fontWeight: 'bold' }}>
                      {currentData.state_statistics?.continuation || 0}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#888', fontSize: '11px' }}>Reversal</div>
                    <div style={{ color: '#ff6b6b', fontSize: '16px', fontWeight: 'bold' }}>
                      {currentData.state_statistics?.reversal || 0}%
                    </div>
                  </div>
                  <div>
                    <div style={{ color: '#888', fontSize: '11px' }}>Consolidation</div>
                    <div style={{ color: '#ffaa00', fontSize: '16px', fontWeight: 'bold' }}>
                      {currentData.state_statistics?.consolidation || 0}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ===== TECHNICAL FACTORS ===== */}
          {activeTab === 'technical-factors' && (
            <div style={{
              background: '#111827',
              border: '2px solid #00ff88',
              borderRadius: '10px',
              padding: '25px',
              marginBottom: '30px'
            }}>
              <h2 style={{ margin: '0 0 20px 0', color: '#00ff88', fontSize: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                🔧 Technical Factors
              </h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {Object.entries(currentData.confluence_breakdown || {}).map(([factor, data]) => (
                  <div key={factor} style={{
                    background: '#0a0e27',
                    padding: '12px',
                    borderRadius: '5px',
                    borderLeft: `3px solid ${data?.active ? '#00ff88' : '#666'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ color: '#e0e0e0', fontWeight: 'bold', fontSize: '13px' }}>
                        {factor.replace(/_/g, ' ')}
                      </div>
                      <div style={{
                        color: data?.active ? '#00ff88' : '#666',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {data?.active ? '✓ ACTIVE' : '○ Inactive'}
                      </div>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#333',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(data?.weight || 0) * 100}%`,
                        height: '100%',
                        background: data?.active ? '#00ff88' : '#666',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <div style={{ color: '#888', fontSize: '11px', marginTop: '5px' }}>
                      Weight: {((data?.weight || 0) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== TAB BUTTONS ===== */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '10px',
            marginBottom: '30px'
          }}>
            {[
              { id: 'trader-read', label: '📖 Read', color: '#00ff88' },
              { id: 'market-regime', label: '📊 Regime', color: '#00d9ff' },
              { id: 'bias-stability', label: '⚡ Bias', color: '#ffaa00' },
              { id: 'session', label: '🌍 Session', color: '#ff6b9d' },
              { id: 'technical-factors', label: '🔧 Factors', color: '#00ff88' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? `${tab.color}22` : '#1a1f35',
                  color: activeTab === tab.id ? tab.color : '#888',
                  border: activeTab === tab.id ? `2px solid ${tab.color}` : '1px solid #333',
                  padding: '12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ===== DEBUG PANEL ===== */}
      <div style={{
        background: '#0f1419',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '15px',
        marginTop: '30px'
      }}>
        <h3 style={{
          margin: '0 0 10px 0',
          fontSize: '12px',
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
          maxHeight: '150px',
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
    </div>
  );
};

export default OracleXDashboard;
