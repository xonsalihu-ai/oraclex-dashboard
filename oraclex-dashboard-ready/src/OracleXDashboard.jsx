import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Globe, Zap, Activity, ChevronRight } from 'lucide-react';

const OracleXDashboardV3 = () => {
  const [marketData, setMarketData] = useState({});
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analysis');
  const [lastUpdate, setLastUpdate] = useState(null);

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

        // Fetch market state
        const relayResp = await fetch(`${relayUrl}/get-market-state`);
        const relayData = await relayResp.json();
        
        // Fetch full analysis for each symbol
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
    if (value >= 75) return 'text-emerald-400';
    if (value >= 60) return 'text-green-400';
    if (value >= 45) return 'text-amber-400';
    return 'text-red-400';
  };

  const getConfluenceBgGradient = (value) => {
    if (!value) return 'from-slate-700 to-slate-800';
    if (value >= 75) return 'from-emerald-600 to-emerald-800';
    if (value >= 60) return 'from-green-600 to-green-800';
    if (value >= 45) return 'from-amber-600 to-amber-800';
    return 'from-red-600 to-red-800';
  };

  const getBiasColor = (bias) => {
    if (bias === 'BULLISH') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (bias === 'BEARISH') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
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
            {/* Left Sidebar */}
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
                                <span className={`font-medium text-sm ${isSelected ? 'text-slate-100' : 'text-slate-400'}`}>
                                  {symbol}
                                </span>
                              </div>
                              {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1"></div>}
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
                  {/* HERO CARD - Market Overview with Confluence */}
                  <div className={`bg-gradient-to-br ${getConfluenceBgGradient(currentSymbolData.confluence)} rounded-xl p-8 backdrop-blur-sm border border-slate-700/30 shadow-2xl`}>
                    <div className="grid grid-cols-4 gap-8">
                      {/* Price & Bias */}
                      <div className="col-span-1">
                        <p className="text-slate-400 text-sm mb-2">Price</p>
                        <p className="text-4xl font-light text-slate-100 mb-4">
                          ${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol)) || '0.00'}
                        </p>
                        <div className={`text-sm font-medium px-3 py-1 rounded-full border ${getBiasColor(currentSymbolData.bias)}`}>
                          {currentSymbolData.bias || 'NEUTRAL'}
                        </div>
                      </div>

                      {/* HERO: Confluence % */}
                      <div className="col-span-1">
                        <p className="text-slate-400 text-sm mb-2">Confluence</p>
                        <div className="relative w-full h-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <p className="text-5xl font-light text-white mb-1">
                                {currentSymbolData.confluence?.toFixed(1) || '0'}%
                              </p>
                              <p className="text-xs text-slate-300">Technical Agreement</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Confidence & Volatility */}
                      <div className="col-span-1">
                        <p className="text-slate-400 text-sm mb-2">Confidence</p>
                        <p className="text-3xl font-light text-slate-100 mb-4">
                          {currentSymbolData.confidence?.toFixed(1) || '0'}%
                        </p>
                        <p className="text-slate-400 text-sm">Volatility</p>
                        <p className="text-xl font-medium text-slate-300">
                          {currentSymbolData.market_regime?.volatility || '—'}
                        </p>
                      </div>

                      {/* Trend & Structure */}
                      <div className="col-span-1">
                        <p className="text-slate-400 text-sm mb-2">Trend</p>
                        <p className="text-sm font-medium text-emerald-300 mb-4">
                          {currentSymbolData.market_regime?.trend || '—'}
                        </p>
                        <p className="text-slate-400 text-sm mb-2">Structure</p>
                        <p className="text-sm font-medium text-slate-300">
                          {currentSymbolData.market_regime?.structure || '—'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Gemini Interpretation */}
                  {currentSymbolData.interpretation && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                        <Zap size={14} className="text-emerald-400" /> Market Interpretation (AI)
                      </p>
                      <p className="text-slate-300 leading-relaxed">
                        {currentSymbolData.interpretation}
                      </p>
                    </div>
                  )}

                  {/* Two Column Section */}
                  <div className="grid grid-cols-2 gap-6">
                    {/* Multi-Timeframe Confluence */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
                        <BarChart3 size={16} className="text-emerald-400" /> Multi-Timeframe Confluence
                      </h3>
                      <div className="space-y-3">
                        {currentSymbolData.multi_timeframe?.timeframe_bias && Object.entries(currentSymbolData.multi_timeframe.timeframe_bias).map(([tf, data]) => (
                          <div key={tf}>
                            <div className="flex justify-between items-center mb-2">
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
                      {currentSymbolData.multi_timeframe?.dominant_tf && (
                        <div className="mt-4 pt-4 border-t border-slate-700/30">
                          <p className="text-xs text-slate-500 mb-2">Dominant TF</p>
                          <p className="text-lg font-medium text-emerald-400">{currentSymbolData.multi_timeframe.dominant_tf}</p>
                        </div>
                      )}
                    </div>

                    {/* Risk/Opportunity Grade */}
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                      <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
                        <AlertCircle size={16} className="text-emerald-400" /> Setup Quality
                      </h3>
                      <div className="space-y-6">
                        {/* Grade */}
                        <div>
                          <p className="text-slate-500 text-xs mb-2">Overall Grade</p>
                          <p className={`text-6xl font-light ${getGradeColor(currentSymbolData.risk_opportunity?.grade)}`}>
                            {currentSymbolData.risk_opportunity?.grade || '—'}
                          </p>
                        </div>

                        {/* Risk Level */}
                        <div>
                          <p className="text-slate-500 text-xs mb-3">Risk Assessment</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="w-full h-3 bg-slate-700/50 rounded-full overflow-hidden">
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
                            <span className="text-sm font-medium text-slate-300 w-12">
                              {currentSymbolData.risk_opportunity?.risk_level || '—'}
                            </span>
                          </div>
                        </div>

                        {/* Opportunity Score */}
                        <div>
                          <p className="text-slate-500 text-xs mb-2">Opportunity</p>
                          <p className="text-3xl font-light text-emerald-400">
                            {currentSymbolData.risk_opportunity?.opportunity_score?.toFixed(0) || '0'}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Liquidity Heatmap */}
                  <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm">
                    <h3 className="text-sm font-semibold text-slate-300 mb-6 flex items-center gap-2">
                      <Activity size={16} className="text-emerald-400" /> Liquidity Levels & Key Support/Resistance
                    </h3>
                    <div className="space-y-4">
                      {/* Resistance */}
                      {currentSymbolData.liquidity?.resistance && currentSymbolData.liquidity.resistance.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Resistance Levels</p>
                          <div className="space-y-2">
                            {currentSymbolData.liquidity.resistance.map((level, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded p-2">
                                <span className="text-xs text-red-400">${level.price?.toFixed(getDecimalPlaces(selectedSymbol))}</span>
                                <span className="text-xs text-slate-500">{level.strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Current Price Line */}
                      <div className="flex items-center justify-between bg-slate-700/20 border border-slate-600/30 rounded p-3 my-2">
                        <span className="text-sm font-medium text-slate-300">Current</span>
                        <span className="text-lg font-medium text-emerald-400">${currentSymbolData.price?.toFixed(getDecimalPlaces(selectedSymbol))}</span>
                      </div>

                      {/* Support */}
                      {currentSymbolData.liquidity?.support && currentSymbolData.liquidity.support.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Support Levels</p>
                          <div className="space-y-2">
                            {currentSymbolData.liquidity.support.map((level, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded p-2">
                                <span className="text-xs text-emerald-400">${level.price?.toFixed(getDecimalPlaces(selectedSymbol))}</span>
                                <span className="text-xs text-slate-500">{level.strength}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex gap-2 border-b border-slate-700/30 overflow-x-auto">
                    {[
                      { id: 'analysis', label: 'Analysis', icon: Eye },
                      { id: 'microstructure', label: 'Microstructure', icon: Activity },
                      { id: 'session', label: 'Session', icon: Globe }
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

                  {/* Tab: Analysis */}
                  {activeTab === 'analysis' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm space-y-6">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">Bias Stability</h4>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <p className="text-slate-500 text-xs mb-2">Current Bias</p>
                            <p className={`text-lg font-medium ${currentSymbolData.bias_stability?.bias === 'BULLISH' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {currentSymbolData.bias_stability?.bias || '—'}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-2">Active Since</p>
                            <p className="text-lg font-medium text-slate-300">{currentSymbolData.bias_stability?.active_since_minutes || 0} min</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs mb-2">Multi-TF Agreement</p>
                            <p className="text-lg font-medium text-emerald-400">{currentSymbolData.bias_stability?.multi_tf_agreement?.toFixed(0) || 0}%</p>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-slate-700/30 pt-6">
                        <h4 className="text-sm font-semibold text-slate-300 mb-3">Confidence Factors</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-slate-500 text-xs mb-2">Timeframe Agreement</p>
                            <p className="text-2xl font-light text-emerald-400">{currentSymbolData.multi_timeframe?.agreement_score?.toFixed(0) || 0}%</p>
                          </div>
                          <div className="bg-slate-900/50 rounded p-3">
                            <p className="text-slate-500 text-xs mb-2">Confluence Points</p>
                            <p className="text-2xl font-light text-slate-300">{currentSymbolData.confluence?.toFixed(0) || 0}/100</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab: Microstructure */}
                  {activeTab === 'microstructure' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-900/50 rounded p-4">
                          <p className="text-slate-500 text-xs mb-2">Bid</p>
                          <p className="text-xl font-medium text-slate-300">${currentSymbolData.microstructure?.bid?.toFixed(getDecimalPlaces(selectedSymbol))}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded p-4">
                          <p className="text-slate-500 text-xs mb-2">Ask</p>
                          <p className="text-xl font-medium text-slate-300">${currentSymbolData.microstructure?.ask?.toFixed(getDecimalPlaces(selectedSymbol))}</p>
                        </div>
                        <div className="bg-slate-900/50 rounded p-4">
                          <p className="text-slate-500 text-xs mb-2">Spread</p>
                          <p className="text-xl font-medium text-emerald-400">{currentSymbolData.microstructure?.spread_pct?.toFixed(3)}%</p>
                        </div>
                      </div>
                      <div className="bg-slate-900/50 rounded p-4">
                        <p className="text-slate-500 text-xs mb-2">Interpretation</p>
                        <p className="text-sm text-slate-300">{currentSymbolData.microstructure?.interpretation}</p>
                      </div>
                    </div>
                  )}

                  {/* Tab: Session */}
                  {activeTab === 'session' && (
                    <div className="bg-slate-800/20 border border-slate-700/30 rounded-lg p-6 backdrop-blur-sm space-y-4">
                      <div>
                        <p className="text-slate-500 text-sm mb-2">Current Session</p>
                        <p className="text-2xl font-light text-emerald-400 mb-4">{currentSymbolData.session?.current_session || '—'}</p>
                      </div>
                      <div className="bg-slate-900/50 rounded p-4">
                        <p className="text-slate-500 text-xs mb-2">Session Hours</p>
                        <p className="text-sm text-slate-300">{currentSymbolData.session?.session_hours}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-900/50 rounded p-3 text-center">
                          <p className="text-xs text-slate-500 mb-2">Typical Volatility</p>
                          <p className="text-lg font-medium text-slate-300">{currentSymbolData.session?.typical_volatility || 0}%</p>
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

export default OracleXDashboardV3;
