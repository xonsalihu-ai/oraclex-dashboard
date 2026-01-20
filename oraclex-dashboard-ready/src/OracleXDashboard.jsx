import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Info, ChevronRight, Zap, Activity } from 'lucide-react';

const OracleXPremiumDashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('interpretation');
  const [lastUpdate, setLastUpdate] = useState(null);

  // All 8 pairs grouped by category
  const pairsByCategory = {
    'Precious Metals': ['XAUUSD', 'XAGUUSD'],
    'Cryptocurrency': ['BTCUSD', 'ETHUSD'],
    'Forex': ['EURUSD', 'GBPUSD'],
    'Indices': ['SPX', 'CCMP']
  };

  const allSymbols = ['XAUUSD', 'XAGUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'SPX', 'CCMP'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://oraclex-relay-production.up.railway.app/get-market-state');
        const data = await response.json();
        setMarketData(data);
        setLastUpdate(new Date());
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentSymbolData = marketData?.market_data?.find(s => s.symbol === selectedSymbol);

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
      'SPX': 'from-emerald-600 via-emerald-500 to-green-500',
      'CCMP': 'from-cyan-600 via-blue-500 to-purple-500'
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
      'SPX': 'S',
      'CCMP': 'N'
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
              <div className="absolute inset-4 rounded-full border border-emerald-500/30"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-light text-emerald-400 tracking-wide">OracleX</h2>
            <p className="text-sm text-slate-400 mt-2">Connecting to market intelligence...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-emerald-500/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-lg blur opacity-50"></div>
                <div className="relative bg-slate-950 rounded-lg p-2.5">
                  <Activity className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-light tracking-tight text-emerald-400">OracleX</h1>
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Market Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
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
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Watchlist */}
          <div className="col-span-3">
            <div className="sticky top-32 space-y-6">
              {Object.entries(pairsByCategory).map(([category, symbols]) => (
                <div key={category} className="group">
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 pl-2 group-hover:text-emerald-400/60 transition-colors">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {symbols.map((sym) => {
                      const data = marketData?.market_data?.find(s => s.symbol === sym);
                      const isSelected = sym === selectedSymbol;
                      const gradient = getPairGradient(sym);
                      
                      return (
                        <button
                          key={sym}
                          onClick={() => setSelectedSymbol(sym)}
                          className={`w-full relative group/item overflow-hidden rounded-lg transition-all duration-300 ${
                            isSelected
                              ? `bg-gradient-to-r ${gradient} p-px shadow-lg shadow-emerald-500/20`
                              : 'p-px hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600'
                          }`}
                        >
                          <div className={`px-4 py-3.5 rounded-[7px] backdrop-blur-sm transition-all ${
                            isSelected
                              ? 'bg-slate-950'
                              : 'bg-slate-800/50 group-hover/item:bg-slate-800/80'
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
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
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
              <div className="pt-6 border-t border-slate-700/50">
                <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Last Update</p>
                    <p className="text-sm text-slate-300 mt-1">{lastUpdate?.toLocaleTimeString()}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-700/50">
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Coverage</p>
                    <p className="text-2xl font-light text-emerald-400 mt-1">{allSymbols.length}</p>
                    <p className="text-xs text-slate-500 mt-1">Professional pairs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Analysis Area */}
          <div className="col-span-9">
            {!currentSymbolData ? (
              <div className="text-center py-32 text-slate-400">
                <Activity className="w-12 h-12 opacity-50 mx-auto mb-4" />
                <p className="text-lg">Loading {selectedSymbol} analysis...</p>
              </div>
            ) : (
              <div className="space-y-8 animate-fadeIn">
                {/* Symbol Header Card */}
                <div className={`bg-gradient-to-r ${getPairGradient(selectedSymbol)} p-px rounded-xl overflow-hidden`}>
                  <div className="bg-slate-950 rounded-[10px] p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-5xl">{getSymbolEmoji(selectedSymbol)}</span>
                          <div>
                            <h2 className="text-4xl font-light text-slate-100">{selectedSymbol}</h2>
                            <p className="text-sm text-slate-400 mt-1">{getPairCategory(selectedSymbol)}</p>
                          </div>
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
                      <div className="flex items-baseline gap-2">
                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                        <div className="text-2xl font-light text-emerald-400">+0.42%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 border-b border-slate-700/50 pb-0 overflow-x-auto">
                  {[
                    { id: 'interpretation', label: '📊 Analysis', icon: null },
                    { id: 'bias', label: '⏱️ Bias Stability', icon: null },
                    { id: 'confluence', label: '🎯 Confluence', icon: null },
                    { id: 'context', label: '📈 Timeline', icon: null },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-emerald-400 text-emerald-400'
                          : 'border-transparent text-slate-400 hover:text-emerald-400/70'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-8">
                  {/* Interpretation Tab */}
                  {activeTab === 'interpretation' && (
                    <div className="space-y-8 animate-fadeIn">
                      {/* Market State Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { 
                            title: 'Trend', 
                            value: currentSymbolData.market_regime?.trend || 'Unknown',
                            desc: 'Directional momentum',
                            icon: '📍'
                          },
                          { 
                            title: 'Volatility', 
                            value: currentSymbolData.market_regime?.volatility || 'Normal',
                            desc: 'Price range expansion',
                            icon: '〰️'
                          },
                          { 
                            title: 'Structure', 
                            value: currentSymbolData.market_regime?.structure || 'Unknown',
                            desc: 'Price action clarity',
                            icon: '⬚'
                          },
                        ].map((item, idx) => (
                          <div 
                            key={idx} 
                            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all hover:bg-gradient-to-br hover:from-slate-800/50 hover:to-slate-900/50"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all"></div>
                            <div className="relative z-10">
                              <div className="flex items-start justify-between mb-3">
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{item.title}</p>
                                <span className="text-lg">{item.icon}</span>
                              </div>
                              <p className="text-3xl font-light text-emerald-400 mb-2">{item.value}</p>
                              <p className="text-xs text-slate-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Market Analysis Box */}
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <div className="flex items-start gap-3 mb-4">
                          <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <h3 className="text-sm font-semibold text-slate-200">Market Interpretation</h3>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          The {selectedSymbol} market exhibits a <span className="text-emerald-400 font-medium">{currentSymbolData.market_regime?.trend}</span> trend 
                          with <span className="text-emerald-400 font-medium">{currentSymbolData.market_regime?.volatility}</span> volatility. 
                          Price structure shows <span className="text-emerald-400 font-medium">{currentSymbolData.market_regime?.structure}</span> characteristics, 
                          indicating {currentSymbolData.market_regime?.structure === 'Clean' ? 'coherent directional movement with reduced noise' : 'multiple competing forces with lower conviction'}.
                        </p>
                      </div>

                      {/* Historical Outcomes */}
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <h3 className="text-sm font-semibold text-slate-200 mb-2">Historical Outcomes</h3>
                        <p className="text-xs text-slate-500 mb-6">In similar market states, we historically observe:</p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: 'Continuation', value: currentSymbolData.state_statistics?.continuation || 45, icon: '→' },
                            { label: 'Mean Reversion', value: currentSymbolData.state_statistics?.reversal || 35, icon: '↶' },
                            { label: 'Consolidation', value: currentSymbolData.state_statistics?.consolidation || 20, icon: '═' },
                          ].map((stat, idx) => (
                            <div key={idx} className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                              <div className="text-2xl mb-2">{stat.icon}</div>
                              <div className="text-3xl font-light text-emerald-400">{stat.value}%</div>
                              <div className="text-xs text-slate-500 mt-2">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 mt-6 italic">
                          Historical observations only. Not predictions or trading signals. For educational purposes.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bias Tab */}
                  {activeTab === 'bias' && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <h3 className="text-sm font-semibold text-slate-200 mb-6">Bias Stability Analysis</h3>
                        <div className="grid grid-cols-2 gap-8">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Active Duration</p>
                            <div className="flex items-baseline gap-2">
                              <div className="text-5xl font-light text-emerald-400">
                                {currentSymbolData.bias_stability?.active_since_minutes?.toFixed(0) || '0'}
                              </div>
                              <span className="text-sm text-slate-400">minutes</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">How long the current bias has been active</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Last Flip</p>
                            <div className="flex items-baseline gap-2">
                              <div className="text-5xl font-light text-emerald-400">
                                {currentSymbolData.bias_stability?.last_flip_minutes_ago?.toFixed(0) || 'N/A'}
                              </div>
                              <span className="text-sm text-slate-400">minutes ago</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-3">Longer periods = stronger conviction</p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <h3 className="text-sm font-semibold text-slate-200 mb-4">What This Means</h3>
                        <div className="space-y-4 text-sm text-slate-300">
                          <p>
                            <span className="text-emerald-400 font-medium">Bias Duration:</span> Longer-held biases indicate stronger institutional commitment. Newly-established biases may be more fragile.
                          </p>
                          <p>
                            <span className="text-emerald-400 font-medium">Recent Flips:</span> Frequent bias flips suggest lower market conviction and higher reversibility. Extended holds indicate clearer directional structure.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Confluence Tab */}
                  {activeTab === 'confluence' && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <h3 className="text-sm font-semibold text-slate-200 mb-6">Confluence Breakdown</h3>
                        <div className="space-y-5">
                          {currentSymbolData.confluence_breakdown && Object.entries(currentSymbolData.confluence_breakdown).map(([key, comp]) => (
                            <div key={key} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-300 font-medium">{key.replace(/_/g, ' ')}</span>
                                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                  comp.active 
                                    ? 'bg-emerald-500/20 text-emerald-400' 
                                    : 'bg-slate-700/50 text-slate-400'
                                }`}>
                                  {comp.active ? 'Active' : 'Inactive'} • {comp.weight}%
                                </span>
                              </div>
                              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    comp.active 
                                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                                      : 'bg-slate-600/50'
                                  }`}
                                  style={{ width: `${(comp.active ? comp.weight : comp.weight * 0.3)}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timeline Tab */}
                  {activeTab === 'context' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <h3 className="text-sm font-semibold text-slate-200 mb-4">Recent Market Evolution</h3>
                        <p className="text-xs text-slate-500 mb-6">Last 90 minutes of activity</p>
                        {currentSymbolData.context_history && currentSymbolData.context_history.length > 0 ? (
                          <div className="space-y-2 max-h-96 overflow-y-auto">
                            {currentSymbolData.context_history.slice(-15).reverse().map((entry, idx) => (
                              <div key={idx} className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/30 group hover:border-emerald-500/20 transition-all">
                                <div className="text-xs text-slate-500 min-w-12 font-mono">{idx * 6}m ago</div>
                                <div className={`px-3 py-1.5 rounded-md text-xs font-semibold min-w-16 text-center ${
                                  entry.bias === 'BULLISH'
                                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                }`}>
                                  {entry.bias}
                                </div>
                                <div className="text-sm text-slate-400">
                                  Vol: <span className="text-slate-300 font-medium">{entry.volatility}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 text-slate-500 text-sm">
                            Building historical timeline...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Notice */}
                <div className="border-t border-slate-700/50 pt-8">
                  <div className="rounded-lg bg-slate-800/20 border border-slate-700/30 p-6">
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-400 space-y-1">
                        <p className="font-medium text-slate-300">Educational Analysis Only</p>
                        <p>OracleX provides market clarity for thinking, not trading signals. All analysis is for educational purposes. Past performance doesn't guarantee future results. Trading decisions remain your responsibility.</p>
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

export default OracleXPremiumDashboard;
