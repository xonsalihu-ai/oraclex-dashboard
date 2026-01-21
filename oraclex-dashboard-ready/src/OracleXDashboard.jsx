import React, { useState, useEffect } from 'react';
import { BarChart3, Activity, Globe, AlertCircle, TrendingUp, TrendingDown, Zap } from 'lucide-react';

const OracleXDashboardV4 = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const pairsByCategory = {
    'Precious Metals': ['XAUUSD', 'XAGUUSD'],
    'Cryptocurrency': ['BTCUSD', 'ETHUSD'],
    'Forex Major': ['EURUSD', 'GBPUSD'],
    'Forex Pairs': ['AUDUSD', 'NZDUSD']
  };

  const allSymbols = ['XAUUSD', 'XAGUUSD', 'BTCUSD', 'ETHUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'];

  const getDecimalPlaces = (symbol) => {
    if (['EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD'].includes(symbol)) return 5;
    return 2;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const relayUrl = 'https://oraclex-relay-production.up.railway.app';

        const relayResp = await fetch(`${relayUrl}/get-market-state`);
        const relayData = await relayResp.json();
        
        let merged = {};
        for (const sym of allSymbols) {
          try {
            const analysisResp = await fetch(`${relayUrl}/analysis/${sym}`);
            if (analysisResp.ok) {
              const analysis = await analysisResp.json();
              const symMarketData = relayData.market_data?.find(s => s.symbol === sym);
              merged[sym] = { ...symMarketData, ...analysis };
            }
          } catch (e) {
            console.warn(`Could not fetch ${sym}:`, e);
          }
        }

        setMarketData(merged);
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const currentSymbolData = marketData[selectedSymbol];

  const getConfluenceLevel = (value) => {
    if (value >= 75) return { color: 'text-emerald-400', label: 'Very Strong', bg: 'from-emerald-600 to-emerald-800' };
    if (value >= 60) return { color: 'text-green-400', label: 'Strong', bg: 'from-green-600 to-green-800' };
    if (value >= 45) return { color: 'text-amber-400', label: 'Moderate', bg: 'from-amber-600 to-amber-800' };
    return { color: 'text-red-400', label: 'Weak', bg: 'from-red-600 to-red-800' };
  };

  const getBiasDisplay = (bias) => {
    if (bias === 'BULLISH') return { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/20', border: 'border-emerald-500/30' };
    if (bias === 'BEARISH') return { icon: TrendingDown, color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
    return { icon: AlertCircle, color: 'text-slate-400', bg: 'bg-slate-500/20', border: 'border-slate-500/30' };
  };

  const getVolatilityColor = (vol) => {
    if (vol === 'Extreme') return 'text-red-400';
    if (vol === 'Elevated') return 'text-amber-400';
    if (vol === 'Quiet') return 'text-emerald-400';
    return 'text-slate-400';
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
            <h2 className="text-2xl font-light text-emerald-400 tracking-wide">OracleX</h2>
            <p className="text-sm text-slate-400 mt-2">Market Intelligence Platform</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-slate-800/50 backdrop-blur-sm sticky top-0 z-20 bg-slate-900/50">
          <div className="max-w-[1920px] mx-auto px-8 py-6">
            <div>
              <h1 className="text-3xl font-light text-emerald-400 tracking-tight">OracleX</h1>
              <p className="text-sm text-slate-500 mt-1">Professional Market Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          <div className="grid grid-cols-5 gap-8">
            {/* Sidebar */}
            <div className="col-span-1">
              <div className="space-y-6 sticky top-24">
                {Object.entries(pairsByCategory).map(([category, symbols]) => (
                  <div key={category}>
                    <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">{category}</h3>
                    <div className="space-y-2">
                      {symbols.map(symbol => {
                        const data = marketData[symbol];
                        const isSelected = selectedSymbol === symbol;
                        const confluence = data?.confluence || 0;
                        const confluenceLevel = getConfluenceLevel(confluence);

                        return (
                          <button
                            key={symbol}
                            onClick={() => setSelectedSymbol(symbol)}
                            className={`w-full text-left p-3 rounded-lg transition-all ${
                              isSelected
                                ? 'bg-slate-800/40 border border-emerald-500/50'
                                : 'bg-slate-900/30 border border-slate-800/30 hover:border-slate-700/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getSymbolEmoji(symbol)}</span>
                                <span className={`font-medium text-sm ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                                  {symbol}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-semibold ${confluenceLevel.color}`}>
                                {confluence ? `${confluence.toFixed(0)}%` : '—'}
                              </span>
                              <span className="text-xs text-slate-500">{confluenceLevel.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Main Panel */}
            <div className="col-span-4">
              {currentSymbolData ? (
                <div className="space-y-6">
                  {/* Price Header */}
                  <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-8 backdrop-blur-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-slate-500 text-sm mb-2">Current Price</p>
                        <p className="text-5xl font-light text-slate-100 mb-6">
                          ${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol)) || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-500 text-sm mb-2">Market Bias</p>
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${getBiasDisplay(currentSymbolData.bias).bg} ${getBiasDisplay(currentSymbolData.bias).border}`}>
                          <span className={`font-medium text-sm ${getBiasDisplay(currentSymbolData.bias).color}`}>
                            {currentSymbolData.bias || 'NEUTRAL'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Market Interpretation */}
                  {currentSymbolData.interpretation && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <p className="text-sm text-slate-400 mb-4 flex items-center gap-2">
                        <Zap size={14} className="text-emerald-400" /> Market Analysis
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {currentSymbolData.interpretation}
                      </p>
                    </div>
                  )}

                  {/* Three Column Analysis */}
                  <div className="grid grid-cols-3 gap-6">
                    {/* Confluence Analysis */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Technical Confluence</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-500 text-xs mb-3">Confluence Score</p>
                          <div className="relative h-16 flex items-center justify-center">
                            <div className="text-center">
                              <p className={`text-4xl font-light ${getConfluenceLevel(currentSymbolData.confluence).color}`}>
                                {currentSymbolData.confluence?.toFixed(0) || '0'}%
                              </p>
                              <p className="text-xs text-slate-500 mt-2">
                                {getConfluenceLevel(currentSymbolData.confluence).label} Agreement
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-slate-700/30 pt-4">
                          <p className="text-xs text-slate-500 mb-2">Confidence Level</p>
                          <p className="text-2xl font-light text-slate-300">{currentSymbolData.confidence?.toFixed(0) || '0'}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Market Regime */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Market Regime</h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-500 text-xs mb-2">Trend</p>
                          <p className="text-slate-300 font-medium">{currentSymbolData.market_regime?.trend || '—'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-2">Volatility</p>
                          <p className={`font-medium ${getVolatilityColor(currentSymbolData.market_regime?.volatility)}`}>
                            {currentSymbolData.market_regime?.volatility || '—'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-2">Structure</p>
                          <p className="text-slate-300">{currentSymbolData.market_regime?.structure || '—'}</p>
                        </div>
                      </div>
                    </div>

                    {/* Multi-Timeframe */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Timeframe Alignment</h3>
                      {currentSymbolData.multi_timeframe?.timeframe_bias && Object.keys(currentSymbolData.multi_timeframe.timeframe_bias).length > 0 ? (
                        <div className="space-y-2">
                          {Object.entries(currentSymbolData.multi_timeframe.timeframe_bias).slice(0, 5).map(([tf, data]) => (
                            <div key={tf} className="flex items-center justify-between text-sm">
                              <span className="text-slate-400">{tf}</span>
                              <span className={`font-medium ${data.bias === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {data.bias === 'BULLISH' ? '↑' : '↓'}
                              </span>
                            </div>
                          ))}
                          {currentSymbolData.multi_timeframe?.dominant_tf && (
                            <div className="border-t border-slate-700/30 pt-3 mt-3">
                              <p className="text-xs text-slate-500 mb-1">Dominant TF</p>
                              <p className="text-emerald-400 font-medium">{currentSymbolData.multi_timeframe.dominant_tf}</p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-sm">Insufficient data</p>
                      )}
                    </div>
                  </div>

                  {/* Key Levels */}
                  {currentSymbolData.liquidity && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6">Key Price Levels</h3>
                      <div className="space-y-4">
                        {currentSymbolData.liquidity.resistance && currentSymbolData.liquidity.resistance.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Resistance</p>
                            <div className="flex gap-2 flex-wrap">
                              {currentSymbolData.liquidity.resistance.map((level, idx) => (
                                <div key={idx} className="bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                                  <p className="text-sm text-red-400 font-medium">
                                    ${level.price?.toFixed(getDecimalPlaces(selectedSymbol))}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="bg-slate-700/20 border border-slate-600/30 rounded-lg p-4">
                          <p className="text-xs text-slate-500 mb-2">Current Price</p>
                          <p className="text-2xl font-light text-emerald-400">
                            ${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol))}
                          </p>
                        </div>

                        {currentSymbolData.liquidity.support && currentSymbolData.liquidity.support.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider">Support</p>
                            <div className="flex gap-2 flex-wrap">
                              {currentSymbolData.liquidity.support.map((level, idx) => (
                                <div key={idx} className="bg-emerald-500/10 border border-emerald-500/20 rounded px-3 py-2">
                                  <p className="text-sm text-emerald-400 font-medium">
                                    ${level.price?.toFixed(getDecimalPlaces(selectedSymbol))}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-slate-700/30">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'details', label: 'Details' },
                      { id: 'session', label: 'Session' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                          activeTab === tab.id
                            ? 'text-emerald-400 border-b-2 border-emerald-400'
                            : 'text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab: Overview */}
                  {activeTab === 'overview' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm text-sm space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-slate-500 mb-2">Current Bias</p>
                          <p className="text-slate-300">{currentSymbolData.bias_stability?.bias || '—'}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-2">Bias Active Since</p>
                          <p className="text-slate-300">{currentSymbolData.bias_stability?.active_since_minutes || 0} minutes</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-2">Multi-TF Agreement</p>
                          <p className="text-emerald-400 font-medium">{currentSymbolData.bias_stability?.multi_tf_agreement?.toFixed(0) || 0}%</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-2">Technical Strength</p>
                          <p className="text-slate-300">{getConfluenceLevel(currentSymbolData.confluence).label}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Details */}
                  {activeTab === 'details' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm text-sm space-y-6">
                      <div>
                        <h4 className="text-slate-400 text-xs uppercase tracking-wider mb-4">Microstructure</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-slate-900/30 rounded p-3">
                            <p className="text-slate-500 text-xs mb-2">Bid</p>
                            <p className="text-slate-300">${currentSymbolData.microstructure?.bid?.toFixed(getDecimalPlaces(selectedSymbol))}</p>
                          </div>
                          <div className="bg-slate-900/30 rounded p-3">
                            <p className="text-slate-500 text-xs mb-2">Ask</p>
                            <p className="text-slate-300">${currentSymbolData.microstructure?.ask?.toFixed(getDecimalPlaces(selectedSymbol))}</p>
                          </div>
                          <div className="bg-slate-900/30 rounded p-3">
                            <p className="text-slate-500 text-xs mb-2">Spread</p>
                            <p className="text-emerald-400">{currentSymbolData.microstructure?.spread_pct?.toFixed(3)}%</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Spread Interpretation</p>
                        <p className="text-slate-300 text-sm">{currentSymbolData.microstructure?.interpretation || '—'}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab: Session */}
                  {activeTab === 'session' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm text-sm space-y-4">
                      <div>
                        <p className="text-slate-500 mb-2">Current Session</p>
                        <p className="text-2xl font-light text-emerald-400">{currentSymbolData.session?.current_session || '—'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-2">Session Hours</p>
                        <p className="text-slate-300">{currentSymbolData.session?.session_hours}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-2">Typical Volatility</p>
                        <p className="text-slate-300">{currentSymbolData.session?.typical_volatility || 0}% historical average</p>
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

export default OracleXDashboardV4;
