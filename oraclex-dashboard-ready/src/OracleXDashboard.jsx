import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, Globe, AlertCircle, ChevronRight } from 'lucide-react';

const OracleXDashboardV31 = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');

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

  // Fetch data ONCE on mount, no auto-refresh
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
    // NO interval - removed auto-refresh
  }, []);

  const currentSymbolData = marketData[selectedSymbol];

  const getConfluenceColor = (value) => {
    if (!value) return 'text-slate-400';
    if (value >= 75) return 'text-emerald-400';
    if (value >= 60) return 'text-green-400';
    if (value >= 45) return 'text-amber-400';
    return 'text-red-400';
  };

  const getBiasColor = (bias) => {
    if (bias === 'BULLISH') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (bias === 'BEARISH') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  const getGradeColor = (grade) => {
    if (grade === 'A+') return 'text-emerald-400';
    if (grade === 'A') return 'text-green-400';
    if (grade === 'B+') return 'text-amber-400';
    if (grade === 'B') return 'text-yellow-400';
    return 'text-red-400';
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
                <p className="text-sm text-slate-500 mt-1">Institutional Market Intelligence</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-[1920px] mx-auto px-8 py-8">
          <div className="grid grid-cols-5 gap-8">
            {/* Left Sidebar - Symbol Selection */}
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
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{getSymbolEmoji(symbol)}</span>
                                <span className={`font-medium text-sm ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                                  {symbol}
                                </span>
                              </div>
                            </div>
                            <div className={`text-sm mt-2 font-semibold ${getConfluenceColor(confluence)}`}>
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

            {/* Main Content Area */}
            <div className="col-span-4">
              {currentSymbolData ? (
                <div className="space-y-6">
                  {/* Price and Key Metrics - Clean Card */}
                  <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                    <div className="grid grid-cols-5 gap-6">
                      <div>
                        <p className="text-slate-500 text-xs mb-2">Price</p>
                        <p className="text-3xl font-light text-slate-100">
                          ${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol)) || '0.00'}
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs mb-2">Bias</p>
                        <div className={`text-sm font-medium px-3 py-1 rounded-full border w-fit ${getBiasColor(currentSymbolData.bias)}`}>
                          {currentSymbolData.bias || '—'}
                        </div>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs mb-2">Confluence</p>
                        <p className={`text-3xl font-light ${getConfluenceColor(currentSymbolData.confluence)}`}>
                          {currentSymbolData.confluence?.toFixed(1) || '0'}%
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs mb-2">Confidence</p>
                        <p className="text-3xl font-light text-slate-300">
                          {currentSymbolData.confidence?.toFixed(1) || '0'}%
                        </p>
                      </div>

                      <div>
                        <p className="text-slate-500 text-xs mb-2">Grade</p>
                        <p className={`text-3xl font-light ${getGradeColor(currentSymbolData.risk_opportunity?.grade)}`}>
                          {currentSymbolData.risk_opportunity?.grade || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Interpretation */}
                  {currentSymbolData.interpretation && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                        <AlertCircle size={14} className="text-emerald-400" /> Market Interpretation
                      </p>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {currentSymbolData.interpretation}
                      </p>
                    </div>
                  )}

                  {/* Two Column Section */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Multi-Timeframe */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                        <BarChart3 size={16} className="text-emerald-400" /> Multi-Timeframe
                      </h3>
                      {currentSymbolData.multi_timeframe?.timeframe_bias && Object.keys(currentSymbolData.multi_timeframe.timeframe_bias).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(currentSymbolData.multi_timeframe.timeframe_bias).map(([tf, data]) => (
                            <div key={tf}>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium text-slate-400">{tf}</span>
                                <span className={`text-xs font-medium ${data.bias === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {data.bias}
                                </span>
                              </div>
                              <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                <div
                                  className={`h-full transition-all ${data.bias === 'BULLISH' ? 'bg-emerald-500' : 'bg-red-500'}`}
                                  style={{ width: '80%' }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-500 text-xs">Insufficient data</p>
                      )}
                    </div>

                    {/* Risk/Opportunity */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                        <Activity size={16} className="text-emerald-400" /> Risk Assessment
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-slate-500 text-xs mb-2">Risk Level: {currentSymbolData.risk_opportunity?.risk_level || '—'}</p>
                          <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                currentSymbolData.risk_opportunity?.risk_score < 33
                                  ? 'bg-emerald-500'
                                  : currentSymbolData.risk_opportunity?.risk_score < 66
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                              style={{ width: `${currentSymbolData.risk_opportunity?.risk_score || 0}%` }}
                            ></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs mb-1">Opportunity</p>
                          <p className="text-2xl font-light text-emerald-400">
                            {currentSymbolData.risk_opportunity?.opportunity_score?.toFixed(0) || '0'}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liquidity Levels */}
                  {currentSymbolData.liquidity && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-4">Key Levels</h3>
                      <div className="space-y-3">
                        {currentSymbolData.liquidity.resistance && currentSymbolData.liquidity.resistance.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Resistance</p>
                            {currentSymbolData.liquidity.resistance.map((level, idx) => (
                              <div key={idx} className="text-xs text-red-400 mb-1">
                                ${level.price?.toFixed(getDecimalPlaces(selectedSymbol))}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between bg-slate-700/20 border border-slate-600/30 rounded p-2 my-2">
                          <span className="text-xs text-slate-400">Current</span>
                          <span className="text-sm font-medium text-emerald-400">${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol))}</span>
                        </div>

                        {currentSymbolData.liquidity.support && currentSymbolData.liquidity.support.length > 0 && (
                          <div>
                            <p className="text-xs text-slate-500 mb-2">Support</p>
                            {currentSymbolData.liquidity.support.map((level, idx) => (
                              <div key={idx} className="text-xs text-emerald-400 mb-1">
                                ${level.price?.toFixed(getDecimalPlaces(selectedSymbol))}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-slate-700/30">
                    {[
                      { id: 'analysis', label: 'Analysis' },
                      { id: 'microstructure', label: 'Microstructure' },
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

                  {/* Tab Content */}
                  {activeTab === 'analysis' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm space-y-4 text-sm">
                      <div>
                        <p className="text-slate-500 mb-2">Bias</p>
                        <p className="text-slate-300">{currentSymbolData.bias_stability?.bias || '—'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-2">Active Since</p>
                        <p className="text-slate-300">{currentSymbolData.bias_stability?.active_since_minutes || 0} min</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-2">Multi-TF Agreement</p>
                        <p className="text-emerald-400 font-medium">{currentSymbolData.bias_stability?.multi_tf_agreement?.toFixed(0) || 0}%</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'microstructure' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm space-y-4 text-sm">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <p className="text-slate-500 mb-2">Bid</p>
                          <p className="text-slate-300">${currentSymbolData.microstructure?.bid?.toFixed(getDecimalPlaces(selectedSymbol))}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-2">Ask</p>
                          <p className="text-slate-300">${currentSymbolData.microstructure?.ask?.toFixed(getDecimalPlaces(selectedSymbol))}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 mb-2">Spread</p>
                          <p className="text-emerald-400">{currentSymbolData.microstructure?.spread_pct?.toFixed(3)}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'session' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm space-y-4 text-sm">
                      <div>
                        <p className="text-slate-500 mb-2">Session</p>
                        <p className="text-slate-300 text-lg font-medium">{currentSymbolData.session?.current_session || '—'}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-2">Hours</p>
                        <p className="text-slate-300">{currentSymbolData.session?.session_hours}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 mb-2">Typical Volatility</p>
                        <p className="text-slate-300">{currentSymbolData.session?.typical_volatility || 0}%</p>
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

export default OracleXDashboardV31;
