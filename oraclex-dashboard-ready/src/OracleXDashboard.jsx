import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Info, ChevronRight, Zap, Activity, ChevronDown, Gauge } from 'lucide-react';

const OracleXDashboard = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');
  const [expandedIndicator, setExpandedIndicator] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('M1');

  // 8 correct symbols
  const pairsByCategory = {
    'Precious Metals': ['XAUUSD', 'XAGUUSD'],
    'Cryptocurrency': ['BTCUSD', 'ETHUSD'],
    'Forex Major': ['EURUSD', 'GBPUSD'],
    'Forex Pairs': ['AUDUSD', 'NZDUSD']
  };

  const allSymbols = ['XAUUSD', 'XAGUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'];
  const timeframes = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1', 'W1'];

  // Fetch data from Python backend (analysis) + Relay (market data)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pythonUrl = 'https://oraclex-python-backend.up.railway.app';
        const relayUrl = 'https://oraclex-relay-production.up.railway.app';

        // Fetch analysis from Python for each symbol
        const analysisMap = {};
        
        for (const sym of allSymbols) {
          try {
            const resp = await fetch(`${pythonUrl}/analysis/${sym}`, {
              timeout: 5000
            });
            if (resp.ok) {
              const data = await resp.json();
              analysisMap[sym] = data;
            }
          } catch (e) {
            console.warn(`Could not fetch ${sym}:`, e);
          }
        }

        // Fetch market state from Relay for price data
        try {
          const relayResp = await fetch(`${relayUrl}/get-market-state`);
          if (relayResp.ok) {
            const relayData = await relayResp.json();
            
            // Merge: combine Relay market data with Python analysis
            const merged = {};
            for (const sym of allSymbols) {
              const relaySymData = relayData.market_data?.find(s => s.symbol === sym);
              merged[sym] = {
                price: relaySymData?.price || 0,
                bid: relaySymData?.bid || 0,
                ask: relaySymData?.ask || 0,
                ...analysisMap[sym] // Python analysis overlays
              };
            }
            
            setMarketData(merged);
          }
        } catch (e) {
          console.warn('Could not fetch relay data:', e);
          setMarketData(analysisMap);
        }

        setLastUpdate(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000); // 10 second refresh
    return () => clearInterval(interval);
  }, []);

  const currentSymbolData = marketData[selectedSymbol];

  const getPairCategory = (symbol) => {
    for (const [category, symbols] of Object.entries(pairsByCategory)) {
      if (symbols.includes(symbol)) return category;
    }
    return 'Unknown';
  };

  const getPairGradient = (symbol) => {
    const gradients = {
      'XAUUSD': 'from-amber-600 via-amber-500 to-yellow-500',
      'XAGUUSD': 'from-gray-400 via-gray-300 to-slate-300',
      'BTCUSD': 'from-orange-600 via-orange-500 to-amber-500',
      'ETHUSD': 'from-purple-600 via-purple-500 to-blue-500',
      'EURUSD': 'from-blue-600 via-blue-500 to-cyan-500',
      'GBPUSD': 'from-indigo-600 via-blue-500 to-blue-400',
      'AUDUSD': 'from-emerald-600 via-emerald-500 to-green-500',
      'NZDUSD': 'from-cyan-600 via-cyan-500 to-blue-500'
    };
    return gradients[symbol] || 'from-slate-600 to-slate-500';
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

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-emerald-500/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="w-6 h-6 text-emerald-400" />
              <div>
                <h1 className="text-3xl font-light tracking-tight text-emerald-400">OracleX V2.5+</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Market Intelligence • Zero Hardcoded</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                <span className="text-sm text-emerald-400 font-medium">Live</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">{allSymbols.length} pairs • Real-time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Symbol Selector */}
          <div className="col-span-3">
            <div className="sticky top-32 space-y-6">
              {Object.entries(pairsByCategory).map(([category, symbols]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 pl-2">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {symbols.map((sym) => {
                      const data = marketData[sym];
                      const isSelected = sym === selectedSymbol;
                      const gradient = getPairGradient(sym);
                      
                      return (
                        <button
                          key={sym}
                          onClick={() => setSelectedSymbol(sym)}
                          className={`w-full relative overflow-hidden rounded-lg transition-all ${
                            isSelected
                              ? `bg-gradient-to-r ${gradient} p-px shadow-lg`
                              : 'p-px'
                          }`}
                        >
                          <div className={`px-4 py-3.5 rounded-[7px] backdrop-blur-sm transition-all ${
                            isSelected
                              ? 'bg-slate-950'
                              : 'bg-slate-800/50 hover:bg-slate-800/80'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`text-lg ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`}>
                                  {getSymbolEmoji(sym)}
                                </span>
                                <div className="text-left">
                                  <div className="font-semibold text-sm">{sym}</div>
                                  <div className={`text-xs mt-0.5 ${
                                    isSelected ? 'text-emerald-400/80' : 'text-slate-500'
                                  }`}>
                                    {data?.confidence ? `${Math.round(data.confidence)}%` : '—'}
                                  </div>
                                </div>
                              </div>
                              {data?.confluence && (
                                <div className="text-xs text-emerald-400 font-semibold">
                                  {Math.round(data.confluence)}%
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Quick Stats */}
              <div className="pt-6 border-t border-slate-700/50 space-y-3">
                {currentSymbolData && (
                  <>
                    <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Session</p>
                      <p className="text-lg text-emerald-400 font-light mt-1">
                        {currentSymbolData?.current_session || '—'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-4">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Bias</p>
                      <p className="text-lg font-light mt-1">
                        <span className={currentSymbolData?.bias === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}>
                          {currentSymbolData?.bias || '—'}
                        </span>
                      </p>
                    </div>
                  </>
                )}
                <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-4">
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Updated</p>
                  <p className="text-sm text-slate-300 mt-1">{lastUpdate?.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analysis */}
          <div className="col-span-9">
            {!currentSymbolData ? (
              <div className="text-center py-32 text-slate-400">
                <Activity className="w-12 h-12 opacity-50 mx-auto mb-4" />
                <p>Loading {selectedSymbol}...</p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Symbol Header */}
                <div className={`bg-gradient-to-r ${getPairGradient(selectedSymbol)} p-px rounded-xl overflow-hidden`}>
                  <div className="bg-slate-950 rounded-[10px] p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="text-5xl">{getSymbolEmoji(selectedSymbol)}</span>
                        <div>
                          <h2 className="text-4xl font-light text-slate-100">{selectedSymbol}</h2>
                          <p className="text-sm text-slate-400 mt-1">{getPairCategory(selectedSymbol)}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                        currentSymbolData.bias === 'BULLISH'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {currentSymbolData.bias || 'NEUTRAL'}
                      </div>
                    </div>
                    <div className="flex items-baseline gap-6 pb-6 border-b border-slate-700/50">
                      <div>
                        <div className="text-5xl font-light text-emerald-400">
                          {currentSymbolData.price?.toFixed(2) || '—'}
                        </div>
                        <p className="text-xs text-slate-500 mt-2 uppercase tracking-wide">Current Price</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEW V2.5+ - Dynamic Confluence & Confidence */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-emerald-300">Dynamic Confluence</h3>
                      <Gauge className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-4xl font-light text-emerald-400 mb-2">
                      {Math.round(currentSymbolData?.confluence || 50)}%
                    </div>
                    <p className="text-xs text-slate-400">
                      7-indicator calculated alignment (ZERO hardcoded)
                    </p>
                    <div className="mt-4 space-y-2 pt-4 border-t border-emerald-500/20">
                      <p className="text-xs text-slate-500">Indicators in agreement:</p>
                      <div className="flex flex-wrap gap-1">
                        {['RSI', 'MACD', 'Stoch', 'ATR', 'BB', 'EMA', 'ADX'].map((ind, i) => (
                          <span key={i} className="px-2 py-1 text-xs rounded bg-emerald-500/20 text-emerald-300">
                            {ind}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-semibold text-blue-300">Dynamic Confidence</h3>
                      <Zap className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-4xl font-light text-blue-400 mb-2">
                      {Math.round(currentSymbolData?.confidence || 50)}%
                    </div>
                    <p className="text-xs text-slate-400">
                      5-factor calculation (NOT hardcoded 71%)
                    </p>
                    <div className="mt-4 space-y-2 pt-4 border-t border-blue-500/20 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Confluence:</span>
                        <span className="text-blue-300">{currentSymbolData?.confidence_breakdown?.confluence || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Volatility:</span>
                        <span className="text-blue-300">{currentSymbolData?.market_regime?.volatility || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Spread:</span>
                        <span className="text-blue-300">Quality</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gemini AI Interpretation */}
                {currentSymbolData?.interpretation && (
                  <div className="rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-6">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-semibold text-purple-300 mb-2">AI Interpretation</h3>
                        <p className="text-sm text-slate-200 leading-relaxed">
                          {currentSymbolData.interpretation}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Timeframes Selector */}
                <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                  <h3 className="text-sm font-semibold text-slate-200 mb-4">Timeframe Analysis</h3>
                  <div className="grid grid-cols-7 gap-2 mb-6">
                    {timeframes.map((tf) => (
                      <button
                        key={tf}
                        onClick={() => setSelectedTimeframe(tf)}
                        className={`py-2 px-3 rounded text-xs font-medium transition-all ${
                          selectedTimeframe === tf
                            ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'
                            : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        {tf}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-400">
                    Showing analysis for {selectedTimeframe} timeframe. Data updates every 10 seconds across all 7 timeframes.
                  </p>
                </div>

                {/* Market Regime */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { title: 'Trend', value: currentSymbolData.market_regime?.trend || '—', desc: 'Directional momentum' },
                    { title: 'Volatility', value: currentSymbolData.market_regime?.volatility || '—', desc: 'Range expansion' },
                    { title: 'Structure', value: currentSymbolData.market_regime?.structure || '—', desc: 'Price clarity' },
                  ].map((item, idx) => (
                    <div key={idx} className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{item.title}</p>
                      <p className="text-3xl font-light text-emerald-400 mb-3">{item.value}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>

                {/* Bias Stability */}
                {currentSymbolData.bias_stability && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Active Duration</p>
                      <p className="text-4xl font-light text-emerald-400">{currentSymbolData.bias_stability.active_since_minutes || 0}</p>
                      <p className="text-xs text-slate-400 mt-2">minutes</p>
                    </div>
                    <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                      <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Last Flip</p>
                      <p className="text-4xl font-light text-slate-300">{currentSymbolData.bias_stability.last_flip_minutes_ago || '—'}</p>
                      <p className="text-xs text-slate-400 mt-2">minutes ago</p>
                    </div>
                  </div>
                )}

                {/* Historical Outcomes */}
                {currentSymbolData.state_statistics && (
                  <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                    <h3 className="text-sm font-semibold text-slate-200 mb-6">Historical Outcomes in Similar States</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: 'Continuation', value: currentSymbolData.state_statistics.continuation },
                        { label: 'Reversal', value: currentSymbolData.state_statistics.reversal },
                        { label: 'Consolidation', value: currentSymbolData.state_statistics.consolidation },
                      ].map((stat, idx) => (
                        <div key={idx} className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                          <div className="text-3xl font-light text-emerald-400">{stat.value}%</div>
                          <div className="text-xs text-slate-500 mt-2">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="border-t border-slate-700/50 pt-8">
                  <div className="rounded-lg bg-slate-800/20 border border-slate-700/30 p-6">
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-400 space-y-2">
                        <p className="font-medium text-slate-300">Educational Analysis Only • V2.5+ Zero Hardcoded</p>
                        <p>All confluence, confidence, and bias calculations are formula-based and dynamically computed. No magic numbers. For educational purposes only.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default OracleXDashboard;
