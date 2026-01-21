import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Info, ChevronRight, Zap, Activity, ChevronDown, Gauge, Globe } from 'lucide-react';

const OracleXDashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');
  const [lastUpdate, setLastUpdate] = useState(null);

  // All 8 symbols - restored including XAGUUSD
  const pairsByCategory = {
    'Precious Metals': ['XAUUSD', 'XAGUUSD'],
    'Cryptocurrency': ['BTCUSD', 'ETHUSD'],
    'Forex Major': ['EURUSD', 'GBPUSD'],
    'Forex Pairs': ['AUDUSD', 'NZDUSD']
  };

  const allSymbols = ['XAUUSD', 'XAGUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'];

  // Get decimal places based on symbol type
  const getDecimalPlaces = (symbol) => {
    if (['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'].includes(symbol)) {
      return 5; // Forex pairs: 5 decimals
    }
    if (['XAUUSD', 'XAGUUSD'].includes(symbol)) {
      return 2; // Precious metals: 2 decimals
    }
    return 2; // Crypto: 2 decimals
  };

  // Fetch data from Relay + Python analysis
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const relayUrl = 'https://oraclex-relay-production.up.railway.app';

        // Fetch market state from Relay
        const relayResp = await fetch(`${relayUrl}/get-market-state`);
        const relayData = await relayResp.json();
        
        // Fetch analysis from Relay proxy to Python
        let analysisData = {};
        try {
          const analysisResp = await fetch(`${relayUrl}/latest-analysis`);
          if (analysisResp.ok) {
            const data = await analysisResp.json();
            // Map analyses by symbol for easy lookup
            if (data.analyses && Array.isArray(data.analyses)) {
              data.analyses.forEach(analysis => {
                analysisData[analysis.symbol] = analysis;
              });
            }
          }
        } catch (e) {
          console.warn('Could not fetch analysis:', e);
        }

        // Merge market data + analysis
        const merged = {};
        for (const sym of allSymbols) {
          const symMarketData = relayData.market_data?.find(s => s.symbol === sym);
          const symAnalysis = analysisData[sym] || {};
          
          merged[sym] = {
            symbol: sym,
            price: symMarketData?.price || 0,
            bid: symMarketData?.bid || 0,
            ask: symMarketData?.ask || 0,
            spread_points: symMarketData?.spread_points || 0,
            ...symAnalysis // Analysis overlays everything
          };
        }

        setMarketData(merged);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentSymbolData = marketData[selectedSymbol];

  const getConfluenceColor = (value) => {
    if (!value) return 'text-slate-400';
    if (value >= 70) return 'text-emerald-400';
    if (value >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBiasColor = (bias) => {
    if (bias === 'BULLISH') return 'text-emerald-400';
    if (bias === 'BEARISH') return 'text-red-400';
    return 'text-amber-400';
  };

  const getSymbolEmoji = (symbol) => {
    const emojis = {
      'XAUUSD': '⊙',
      'XAGUUSD': '◇',
      'BTCUSD': '₿',
      'ETHUSD': 'Ξ',
      'EURUSD': '€',
      'GBPUSD': '£',
      'AUDUSD': '🇦🇺',
      'NZDUSD': '🇳🇿'
    };
    return emojis[symbol] || '●';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="inline-block">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20"></div>
              <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-emerald-400 border-r-emerald-400 animate-spin"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-light text-emerald-400 tracking-wide">OracleX V2.5+</h2>
            <p className="text-sm text-slate-400 mt-2">Loading market intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-20 bg-slate-900/50">
          <div className="max-w-[1920px] mx-auto px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-light text-emerald-400 tracking-tight">OracleX</h1>
                <p className="text-sm text-slate-500 mt-1">Market Intelligence Platform</p>
              </div>
              {lastUpdate && (
                <div className="text-right text-xs text-slate-500">
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          <div className="grid grid-cols-5 gap-8">
            {/* Left Sidebar - Symbol Selector */}
            <div className="col-span-1">
              <div className="space-y-8 sticky top-24">
                {Object.entries(pairsByCategory).map(([category, symbols]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{category}</h3>
                    <div className="space-y-2">
                      {symbols.map(symbol => {
                        const data = marketData[symbol];
                        const isSelected = selectedSymbol === symbol;
                        const confluence = data?.confluence || 0;

                        return (
                          <button
                            key={symbol}
                            onClick={() => setSelectedSymbol(symbol)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              isSelected
                                ? 'bg-slate-800/40 border border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                                : 'bg-slate-900/30 border border-slate-800/30 hover:border-slate-700/50'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getSymbolEmoji(symbol)}</span>
                                <span className={`font-medium ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                                  {symbol}
                                </span>
                              </div>
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1"></div>
                              )}
                            </div>
                            <div className={`text-sm mt-2 ${getConfluenceColor(confluence)}`}>
                              {confluence ? `${confluence.toFixed(1)}%` : '—'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Main Content */}
            <div className="col-span-4">
              {currentSymbolData ? (
                <div className="space-y-6">
                  {/* Main Card */}
                  <div className="bg-gradient-to-br from-slate-800/20 to-slate-900/20 border border-slate-700/30 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h2 className="text-2xl font-light text-slate-100 mb-1">{selectedSymbol}</h2>
                        <p className="text-sm text-slate-500">Precious Metals</p>
                      </div>
                      <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                        currentSymbolData.bias === 'BULLISH' ? 'bg-emerald-500/20 text-emerald-400' :
                        currentSymbolData.bias === 'BEARISH' ? 'bg-red-500/20 text-red-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {currentSymbolData.bias || 'NEUTRAL'}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-slate-500 text-sm mb-2">Price</p>
                        <p className="text-3xl font-light text-slate-100">
                          ${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol)) || '0.00'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm mb-2">Confluence</p>
                        <p className={`text-3xl font-light ${getConfluenceColor(currentSymbolData.confluence)}`}>
                          {currentSymbolData.confluence ? `${currentSymbolData.confluence.toFixed(1)}%` : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-sm mb-2">Confidence</p>
                        <p className={`text-3xl font-light ${getConfluenceColor(currentSymbolData.confidence)}`}>
                          {currentSymbolData.confidence ? `${currentSymbolData.confidence.toFixed(1)}%` : '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tab Navigation */}
                  <div className="flex gap-2 border-b border-slate-700/30 overflow-x-auto">
                    {[
                      { id: 'analysis', label: 'Analysis', icon: Eye },
                      { id: 'bias', label: 'Bias Stability', icon: Zap },
                      { id: 'confluence', label: 'Confluence', icon: BarChart3 },
                      { id: 'session', label: 'Session', icon: Globe },
                      { id: 'timeline', label: 'Timeline', icon: Clock }
                    ].map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                            activeTab === tab.id
                              ? 'text-emerald-400 border-b-2 border-emerald-400'
                              : 'text-slate-400 hover:text-slate-300'
                          }`}
                        >
                          <Icon size={16} />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Tab Content - Analysis */}
                  {activeTab === 'analysis' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4">Market Interpretation</h3>
                      <p className="text-slate-300 leading-relaxed mb-6">
                        {currentSymbolData.interpretation || 'Analyzing market conditions...'}
                      </p>

                      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/30">
                        <div>
                          <p className="text-xs text-slate-500 mb-2">TREND</p>
                          <p className="text-slate-300 font-medium">{currentSymbolData.market_regime?.trend || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-2">VOLATILITY</p>
                          <p className="text-slate-300 font-medium">{currentSymbolData.market_regime?.volatility || '—'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-2">STRUCTURE</p>
                          <p className="text-slate-300 font-medium">{currentSymbolData.market_regime?.structure || '—'}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content - Bias Stability */}
                  {activeTab === 'bias' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4">Bias Stability Analysis</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-slate-500 text-sm mb-2">Current Bias</p>
                          <p className={`text-2xl font-medium ${getBiasColor(currentSymbolData.bias_stability?.bias)}`}>
                            {currentSymbolData.bias_stability?.bias || 'NEUTRAL'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-sm mb-2">Active Since</p>
                          <p className="text-2xl font-medium text-slate-300">
                            {currentSymbolData.bias_stability?.active_since_minutes || 0} min
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content - Confluence */}
                  {activeTab === 'confluence' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Confluence Breakdown</h3>
                      <div className="space-y-4">
                        {Object.entries(currentSymbolData.confluence_breakdown || {}).map(([factor, data]) => (
                          <div key={factor}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-slate-400">{factor.replace(/_/g, ' ')}</span>
                              <span className={`text-xs font-medium ${data?.active ? 'text-emerald-400' : 'text-slate-500'}`}>
                                {data?.active ? '✓ Active' : '○ Inactive'} • {((data?.weight || 0) * 100).toFixed(0)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all ${data?.active ? 'bg-emerald-500' : 'bg-slate-600'}`}
                                style={{ width: `${(data?.weight || 0) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab Content - Session Intelligence */}
                  {activeTab === 'session' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Session Intelligence</h3>
                      <div className="mb-6">
                        <p className="text-slate-500 text-sm mb-2">Current Session</p>
                        <p className="text-2xl font-medium text-emerald-400">
                          {currentSymbolData.session || 'Unknown'}
                        </p>
                      </div>
                      
                      <div className="bg-slate-900/50 border border-slate-700/30 rounded-lg p-4 mb-6">
                        <p className="text-xs text-slate-500 mb-3">Session Description</p>
                        <p className="text-sm text-slate-300">
                          {currentSymbolData.session === 'Asia' && 'Low volatility session with focus on yen pairs and Asian indices. Volume typically ramps up mid-session.'}
                          {currentSymbolData.session === 'Europe' && 'High volatility session with strong participation. This is when major technical moves often occur.'}
                          {currentSymbolData.session === 'US' && 'Peak volatility with US economic data releases. Largest volume and most directional moves.'}
                          {currentSymbolData.session === 'Overlap' && 'Session overlap period. Mixed volatility with opportunities at market transitions.'}
                          {!currentSymbolData.session || (currentSymbolData.session !== 'Asia' && currentSymbolData.session !== 'Europe' && currentSymbolData.session !== 'US' && currentSymbolData.session !== 'Overlap') && 'Analyzing current session...'}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                          <p className="text-xs text-slate-500 mb-2">Typical Reaction</p>
                          <p className="text-sm font-medium text-emerald-400">Continuation</p>
                          <p className="text-xs text-slate-400 mt-1">{currentSymbolData.state_statistics?.continuation || 0}%</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                          <p className="text-xs text-slate-500 mb-2">Typical Reaction</p>
                          <p className="text-sm font-medium text-red-400">Reversal</p>
                          <p className="text-xs text-slate-400 mt-1">{currentSymbolData.state_statistics?.reversal || 0}%</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700/30">
                          <p className="text-xs text-slate-500 mb-2">Typical Reaction</p>
                          <p className="text-sm font-medium text-amber-400">Consolidation</p>
                          <p className="text-xs text-slate-400 mt-1">{currentSymbolData.state_statistics?.consolidation || 0}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab Content - Timeline */}
                  {activeTab === 'timeline' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Historical Outcomes</h3>
                      <div className="grid grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-4xl font-light text-emerald-400 mb-2">
                            {currentSymbolData.state_statistics?.continuation || 0}%
                          </div>
                          <p className="text-sm text-slate-500">Continuation</p>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-light text-red-400 mb-2">
                            {currentSymbolData.state_statistics?.reversal || 0}%
                          </div>
                          <p className="text-sm text-slate-500">Reversal</p>
                        </div>
                        <div className="text-center">
                          <div className="text-4xl font-light text-amber-400 mb-2">
                            {currentSymbolData.state_statistics?.consolidation || 0}%
                          </div>
                          <p className="text-sm text-slate-500">Consolidation</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <AlertCircle className="mx-auto mb-4 opacity-50" size={48} />
                  <p>No data available for {selectedSymbol}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleXDashboard;
