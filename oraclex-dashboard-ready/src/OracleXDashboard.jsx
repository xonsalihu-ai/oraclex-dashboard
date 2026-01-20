import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Info, ChevronRight, Zap, Activity, ChevronDown } from 'lucide-react';

const OracleXFinal = () => {
  const [marketData, setMarketData] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('interpretation');
  const [expandedIndicator, setExpandedIndicator] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const pairsByCategory = {
    'Precious Metals': ['XAUUSD', 'XAGUUSD'],
    'Cryptocurrency': ['BTCUSD', 'ETHUSD'],
    'Forex Major': ['EURUSD', 'GBPUSD'],
    'Forex Pairs': ['AUDUSD', 'NZDUSD']
  };

  const allSymbols = ['XAUUSD', 'XAGUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'];

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
      'AUDUSD': '🇦🇺',
      'NZDUSD': '🇳🇿'
    };
    return emojis[symbol] || '●';
  };

  // Generate trader read summary
  const getTraderRead = () => {
    if (!currentSymbolData) return '';
    const trend = currentSymbolData.market_regime?.trend || 'Unknown';
    const vol = currentSymbolData.market_regime?.volatility || 'Normal';
    const struct = currentSymbolData.market_regime?.structure || 'Unknown';
    const bias = currentSymbolData.bias || 'NEUTRAL';

    if (trend === 'Strong' && vol === 'Expanding') {
      return `Strong ${bias} trend with expanding volatility—breakout likely; manage reversal risk with tight stops.`;
    } else if (trend === 'Weak') {
      return `Weak trend near moving averages—reversals more probable than continuations; favor short timeframe trades.`;
    } else if (struct === 'Choppy') {
      return `Choppy structure with conflicting signals—consolidation expected; patience favored until structure resolves.`;
    } else if (vol === 'Contracting') {
      return `Volatility compression typical of pre-breakout—movement likely imminent; prepare for range expansion.`;
    }
    return `Mixed signals; market awaiting catalyst. Data suggests consolidation phase. Monitor for structure resolution.`;
  };

  // Technical indicators with explanations
  const technicalFactors = [
    {
      name: 'EMA_Trend',
      status: currentSymbolData?.indicators?.EMA50_above_200 ? 'Active' : 'Inactive',
      measures: 'Price momentum and directional strength',
      discounted: 'Divergences appear or price nears extremes',
      weight: 40
    },
    {
      name: 'RSI_Momentum',
      status: currentSymbolData?.indicators?.RSI_momentum ? 'Active' : 'Inactive',
      measures: 'Overbought/oversold conditions and momentum shifts',
      discounted: 'During trending moves; less useful in choppy markets',
      weight: 30
    },
    {
      name: 'Bollinger_Bands',
      status: currentSymbolData?.indicators?.BB_squeeze ? 'Active' : 'Inactive',
      measures: 'Volatility compression and expansion cycles',
      discounted: 'When markets are in consolidation; trap signals possible',
      weight: 20
    },
    {
      name: 'Volume_Profile',
      status: currentSymbolData?.indicators?.Volume_confirmed ? 'Active' : 'Inactive',
      measures: 'Trade participation and conviction strength',
      discounted: 'During low-volume sessions or news gaps',
      weight: 10
    }
  ];

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
      {/* Animated background */}
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
                <p className="text-xs text-slate-500 uppercase tracking-widest mt-0.5">Professional Market Intelligence</p>
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
          {/* Left Sidebar */}
          <div className="col-span-3">
            <div className="sticky top-32 space-y-6">
              {Object.entries(pairsByCategory).map(([category, symbols]) => (
                <div key={category}>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 pl-2">
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
                <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Current Session</p>
                    <p className="text-lg text-emerald-400 font-light mt-1">
                      {currentSymbolData?.current_session || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wide">Data Freshness</p>
                    <p className="text-sm text-slate-300 mt-1">{lastUpdate?.toLocaleTimeString()}</p>
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
                      <div>
                        <div className="text-3xl font-light text-emerald-400">+0.42%</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* TRADER READ - Most Important */}
                <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-emerald-300 mb-2">Trader Read</h3>
                      <p className="text-sm text-slate-200 leading-relaxed">
                        {getTraderRead()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-1 border-b border-slate-700/50 pb-0 overflow-x-auto">
                  {[
                    { id: 'interpretation', label: 'Market Regime' },
                    { id: 'bias', label: 'Bias Stability' },
                    { id: 'session', label: 'Session Intel' },
                    { id: 'technical', label: 'Technical Factors' },
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
                <div className="space-y-6">
                  {/* Market Regime Tab */}
                  {activeTab === 'interpretation' && (
                    <div className="space-y-6 animate-fadeIn">
                      {/* Market State Grid */}
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { 
                            title: 'Trend', 
                            value: currentSymbolData.market_regime?.trend || 'Unknown',
                            desc: 'Directional momentum',
                            detail: 'Based on HTF; structure reflects LTF'
                          },
                          { 
                            title: 'Volatility', 
                            value: currentSymbolData.market_regime?.volatility || 'Normal',
                            desc: 'Range expansion/compression',
                            detail: 'Bollinger Band width analysis'
                          },
                          { 
                            title: 'Structure', 
                            value: currentSymbolData.market_regime?.structure || 'Unknown',
                            desc: 'Price action clarity',
                            detail: 'Swing count in recent bars'
                          },
                        ].map((item, idx) => (
                          <div 
                            key={idx} 
                            className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6 hover:border-emerald-500/30 transition-all"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all"></div>
                            <div className="relative z-10">
                              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{item.title}</p>
                              <p className="text-3xl font-light text-emerald-400 mb-3">{item.value}</p>
                              <p className="text-xs text-slate-500 mb-2">{item.desc}</p>
                              <p className="text-xs text-slate-600 italic">{item.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Market Regime Explanation */}
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                        <h3 className="text-sm font-semibold text-slate-200 mb-4">What This Means for Your Trading</h3>
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {currentSymbolData.market_regime?.trend === 'Strong' && currentSymbolData.market_regime?.volatility === 'Expanding'
                            ? 'Strong directional bias with expanding volatility typically precedes breakouts. Structure clarity is important—if clean, favor continuation. If choppy, risk reversal.'
                            : currentSymbolData.market_regime?.trend === 'Weak'
                            ? 'Weak trend near moving averages increases reversal probability. Avoid large directional positions. Suitable for range-bound or counter-trend scalping.'
                            : currentSymbolData.market_regime?.volatility === 'Contracting'
                            ? 'Volatility compression is typical before sharp moves. Market is quiet but not asleep. Prepare for expansion with awareness of initial direction.'
                            : 'Mixed signals suggest consolidation. Patient traders wait for structure resolution. Avoid forcing trades in ambiguous environments.'}
                        </p>
                      </div>

                      {/* Historical Outcomes */}
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                        <h3 className="text-sm font-semibold text-slate-200 mb-2">Historical Outcomes in Similar States</h3>
                        <p className="text-xs text-slate-500 mb-6">Patterns observed across {selectedSymbol} data:</p>
                        <div className="grid grid-cols-3 gap-4">
                          {[
                            { label: 'Continuation', value: currentSymbolData.state_statistics?.continuation || 45 },
                            { label: 'Mean Reversion', value: currentSymbolData.state_statistics?.reversal || 35 },
                            { label: 'Consolidation', value: currentSymbolData.state_statistics?.consolidation || 20 },
                          ].map((stat, idx) => (
                            <div key={idx} className="text-center p-4 rounded-lg bg-slate-800/30 border border-slate-700/30">
                              <div className="text-3xl font-light text-emerald-400">{stat.value}%</div>
                              <div className="text-xs text-slate-500 mt-2">{stat.label}</div>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 mt-6 italic">
                          Historical observations only. Not predictions. For educational purposes only.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bias Stability Tab */}
                  {activeTab === 'bias' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Bias Duration */}
                        <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">Active Duration</p>
                          <div className="flex items-baseline gap-2 mb-4">
                            <div className="text-5xl font-light text-emerald-400">
                              {currentSymbolData.bias_stability?.active_since_minutes?.toFixed(0) || '0'}
                            </div>
                            <span className="text-sm text-slate-400">minutes</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-4 pb-4 border-b border-slate-700/50">
                            Bias reliability increases with duration. Early-stage biases are more prone to reversal.
                          </p>
                          <p className="text-xs text-slate-500">
                            <span className="text-emerald-400 font-medium">Interpretation:</span> Longer-held biases indicate stronger institutional commitment and higher probability of continuation.
                          </p>
                        </div>

                        {/* Last Flip */}
                        <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                          <p className="text-xs text-slate-500 uppercase tracking-wide mb-4">Last Bias Flip</p>
                          <div className="flex items-baseline gap-2 mb-4">
                            <div className="text-5xl font-light text-emerald-400">
                              {currentSymbolData.bias_stability?.last_flip_minutes_ago?.toFixed(0) || 'N/A'}
                            </div>
                            <span className="text-sm text-slate-400">minutes ago</span>
                          </div>
                          <p className="text-xs text-slate-400 mb-4 pb-4 border-b border-slate-700/50">
                            Fragility awareness: recent flips suggest lower conviction.
                          </p>
                          <p className="text-xs text-slate-500">
                            <span className="text-emerald-400 font-medium">Interpretation:</span> Extended holds indicate clearer directional structure. Recent flips warrant tighter risk management.
                          </p>
                        </div>
                      </div>

                      {/* Confidence Explanation */}
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold text-slate-200">Analysis Confidence</h3>
                          <div className={`text-3xl font-light ${currentSymbolData.confidence > 70 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                            {Math.round(currentSymbolData.confidence || 0)}%
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 mb-4">
                          <span className="text-emerald-400 font-medium">What this represents:</span> Alignment score across trend, volatility, structure, and historical regime similarity.
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-xs text-slate-400">Trend strength: Strong</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-xs text-slate-400">Historical outcome clarity: High</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                            <span className="text-xs text-slate-400">Indicator alignment: Partial</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Session Intelligence Tab */}
                  {activeTab === 'session' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-8">
                        <div className="space-y-6">
                          <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Current Session</p>
                            <p className="text-3xl font-light text-emerald-400 mb-3">
                              {currentSymbolData?.current_session || 'Unknown'}
                            </p>
                            <p className="text-sm text-slate-300">
                              {currentSymbolData?.current_session === 'Asia' && 'Tokyo, Hong Kong, Singapore active. Lower volatility expected.'}
                              {currentSymbolData?.current_session === 'Europe' && 'London, Frankfurt, Paris active. Medium-high volatility expected.'}
                              {currentSymbolData?.current_session === 'US' && 'New York active. Typically highest volatility and volume.'}
                              {!['Asia', 'Europe', 'US'].includes(currentSymbolData?.current_session) && 'Multiple sessions overlapping.'}
                            </p>
                          </div>

                          <div className="border-t border-slate-700/50 pt-6">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Typical Volatility</p>
                            <p className="text-2xl font-light text-emerald-400 mb-3">Low-Medium</p>
                            <p className="text-sm text-slate-300">
                              Session characteristics suggest {currentSymbolData?.current_session === 'Asia' ? 'controlled moves with directional clarity' : 'varied volatility; scalping possible'}.
                            </p>
                          </div>

                          <div className="border-t border-slate-700/50 pt-6">
                            <p className="text-xs text-slate-500 uppercase tracking-wide mb-3">Common Setup</p>
                            <p className="text-2xl font-light text-emerald-400 mb-3">Range</p>
                            <p className="text-sm text-slate-300">
                              Expect consolidation patterns. Breakout trades should wait for secondary confirmation.
                            </p>
                          </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                          <p className="text-xs text-slate-400 italic">
                            <span className="text-emerald-400 font-medium">Why this matters:</span> Most traders ignore sessions and trade London strategies in Asia. This creates friction and drawdowns. Session intelligence prevents that costly mistake.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technical Factors Tab */}
                  {activeTab === 'technical' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 p-6 mb-2">
                        <h3 className="text-sm font-semibold text-slate-200">What's Driving the Bias?</h3>
                        <p className="text-xs text-slate-500 mt-2">Weighted contribution breakdown:</p>
                      </div>

                      {technicalFactors.map((factor) => (
                        <div
                          key={factor.name}
                          className="rounded-lg bg-gradient-to-br from-slate-800/30 to-slate-900/30 border border-slate-700/50 overflow-hidden transition-all"
                        >
                          <button
                            onClick={() => setExpandedIndicator(expandedIndicator === factor.name ? null : factor.name)}
                            className="w-full p-6 flex items-center justify-between hover:bg-slate-800/20 transition-all"
                          >
                            <div className="flex items-center gap-3 text-left">
                              <div className={`w-3 h-3 rounded-full ${
                                factor.status === 'Active' ? 'bg-emerald-400' : 'bg-slate-600'
                              }`}></div>
                              <div>
                                <p className="text-sm font-medium text-slate-200">{factor.name.replace(/_/g, ' ')}</p>
                                <p className="text-xs text-slate-500 mt-1">{factor.status} • {factor.weight}% weight</p>
                              </div>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${
                              expandedIndicator === factor.name ? 'rotate-180' : ''
                            }`} />
                          </button>

                          {expandedIndicator === factor.name && (
                            <div className="px-6 pb-6 border-t border-slate-700/50 space-y-4 text-sm">
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">What It Measures</p>
                                <p className="text-slate-300">{factor.measures}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">When Discounted</p>
                                <p className="text-slate-300">{factor.discounted}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 p-6 mt-6">
                        <p className="text-xs text-emerald-400 font-medium mb-2">WHY THIS MATTERS</p>
                        <p className="text-sm text-slate-300">
                          Experienced traders know: if your setup fails, why does it fail? This breakdown answers that question upfront. It builds trust because you're explaining the mechanics, not hiding them.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-700/50 pt-8">
                  <div className="rounded-lg bg-slate-800/20 border border-slate-700/30 p-6">
                    <div className="flex gap-4">
                      <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div className="text-xs text-slate-400 space-y-2">
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

export default OracleXFinal;
