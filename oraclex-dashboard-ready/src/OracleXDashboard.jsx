import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Eye, BarChart3, Clock, AlertCircle, Info, ChevronRight } from 'lucide-react';

const OracleXDashboard = () => {
  const [marketData, setMarketData] = useState(null);
  const [selectedSymbol, setSelectedSymbol] = useState('XAUUSD');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('market-state');
  const [hoveredIndicator, setHoveredIndicator] = useState(null);

  const symbols = ['XAUUSD', 'BTCUSD', 'SOLUSD', 'GBPJPY', 'ETHUSD', 'XAGUSD'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://oraclex-relay-production.up.railway.app/get-market-state');
        const data = await response.json();
        setMarketData(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch market data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const currentSymbolData = marketData?.market_data?.find(s => s.symbol === selectedSymbol);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full"></div>
          </div>
          <p className="text-slate-400">Connecting to OracleX...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-emerald-500/10 bg-slate-950/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-emerald-400">OracleX</h1>
            <p className="text-xs text-slate-500">Market Intelligence Dashboard</p>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-right">
              <div className="text-emerald-400">Live</div>
              <div className="text-slate-500 text-xs">{symbols.length} pairs monitored</div>
            </div>
            <button className="px-4 py-2 rounded border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-400 text-sm transition-colors">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Watchlist */}
          <div className="col-span-3">
            <div className="sticky top-32 space-y-6">
              {/* Symbol Selector */}
              <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Watchlist</h3>
                <div className="space-y-2">
                  {symbols.map((sym) => {
                    const data = marketData?.market_data?.find(s => s.symbol === sym);
                    const isSelected = sym === selectedSymbol;
                    return (
                      <button
                        key={sym}
                        onClick={() => setSelectedSymbol(sym)}
                        className={`w-full text-left px-3 py-2 rounded transition-all text-sm ${
                          isSelected
                            ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-400'
                            : 'border border-slate-700 text-slate-300 hover:border-emerald-500/30 hover:text-emerald-400/70'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{sym}</span>
                          <Eye className="w-3 h-3" />
                        </div>
                        {data && (
                          <div className="text-xs text-slate-500 mt-1">
                            {data.confidence ? `${Math.round(data.confidence)}% conf.` : 'Analyzing...'}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-4">Quick Context</h3>
                {currentSymbolData && (
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-slate-500 text-xs">Current Session</div>
                      <div className="text-emerald-400 font-medium">{currentSymbolData.current_session || 'Unknown'}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs">Data Age</div>
                      <div className="text-slate-300 font-medium">Fresh</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            {!currentSymbolData ? (
              <div className="text-center py-12 text-slate-400">
                <p>No data available for this symbol</p>
              </div>
            ) : (
              <>
                {/* Symbol Header */}
                <div className="border-b border-emerald-500/10 pb-6">
                  <h2 className="text-4xl font-bold text-slate-100 mb-2">{currentSymbolData.symbol}</h2>
                  <div className="flex items-baseline gap-4">
                    <div className="text-4xl font-light text-emerald-400">{currentSymbolData.price?.toFixed(5)}</div>
                    <div className={`text-lg ${currentSymbolData.price_change_1h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {currentSymbolData.price_change_1h >= 0 ? '+' : ''}{currentSymbolData.price_change_1h?.toFixed(2)}% (1H)
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-1 border-b border-slate-700">
                  {[
                    { id: 'market-state', label: 'Market State', icon: TrendingUp },
                    { id: 'bias-stability', label: 'Bias Stability', icon: Clock },
                    { id: 'context', label: 'Recent Context', icon: BarChart3 },
                    { id: 'interpretation', label: 'Interpretation', icon: Info },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === tab.id
                          ? 'border-emerald-500 text-emerald-400'
                          : 'border-transparent text-slate-400 hover:text-emerald-400/60'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-6">
                  {/* Market State Tab */}
                  {activeTab === 'market-state' && (
                    <div className="space-y-6">
                      <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                          What Kind of Market?
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                          {/* Trend */}
                          <div className="bg-slate-800/50 rounded p-4 border border-slate-700/50">
                            <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">Trend</div>
                            <div className="text-2xl font-light text-emerald-400 mb-2">
                              {currentSymbolData.market_regime?.trend || 'Unknown'}
                            </div>
                            <div className="text-xs text-slate-400">
                              {currentSymbolData.market_regime?.trend === 'Strong'
                                ? 'Clear directional movement with separation from key moving averages.'
                                : currentSymbolData.market_regime?.trend === 'Weak'
                                ? 'Price action near key averages; directional commitment unclear.'
                                : 'Price consolidated within a defined zone; no clear direction.'}
                            </div>
                          </div>

                          {/* Volatility */}
                          <div className="bg-slate-800/50 rounded p-4 border border-slate-700/50">
                            <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">Volatility</div>
                            <div className="text-2xl font-light text-emerald-400 mb-2">
                              {currentSymbolData.market_regime?.volatility || 'Normal'}
                            </div>
                            <div className="text-xs text-slate-400">
                              {currentSymbolData.market_regime?.volatility === 'Expanding'
                                ? 'Price swings widening; breakout or reversal likely near.'
                                : currentSymbolData.market_regime?.volatility === 'Contracting'
                                ? 'Bollinger Bands tightening; quiet before movement.'
                                : 'Volatility within normal range for this instrument.'}
                            </div>
                          </div>

                          {/* Structure */}
                          <div className="bg-slate-800/50 rounded p-4 border border-slate-700/50">
                            <div className="text-xs text-slate-500 uppercase tracking-wide mb-3">Structure</div>
                            <div className="text-2xl font-light text-emerald-400 mb-2">
                              {currentSymbolData.market_regime?.structure || 'Unknown'}
                            </div>
                            <div className="text-xs text-slate-400">
                              {currentSymbolData.market_regime?.structure === 'Clean'
                                ? 'Price action forming clear patterns and support/resistance.'
                                : 'Reversals frequent; price action lacks clarity.'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bias Stability Tab */}
                  {activeTab === 'bias-stability' && (
                    <div className="space-y-6">
                      {/* Bias Duration */}
                      <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-emerald-500" />
                          How Stable Is This Bias?
                        </h3>

                        <div className="space-y-6">
                          {/* Current Bias */}
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-sm text-slate-400">Current Bias</span>
                              <span className={`px-3 py-1 rounded text-sm font-medium ${
                                currentSymbolData.bias === 'BULLISH'
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : currentSymbolData.bias === 'BEARISH'
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-slate-700/50 text-slate-300 border border-slate-600'
                              }`}>
                                {currentSymbolData.bias || 'NEUTRAL'}
                              </span>
                            </div>
                            <div className="text-2xl font-light text-slate-100">
                              {currentSymbolData.bias_stability?.active_since_minutes?.toFixed(0) || 0} minutes active
                            </div>
                            <div className="text-xs text-slate-400 mt-2">
                              Long-held biases are more reliable. Recent reversals suggest caution.
                            </div>
                          </div>

                          {/* Last Flip */}
                          {currentSymbolData.bias_stability?.last_flip_minutes_ago && (
                            <div className="pt-4 border-t border-slate-700">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-400">Last bias flip</span>
                                <span className="text-slate-300 font-medium">
                                  {currentSymbolData.bias_stability.last_flip_minutes_ago.toFixed(0)} minutes ago
                                </span>
                              </div>
                              <div className="text-xs text-slate-400 mt-2">
                                Recent flips indicate weakness in the current bias. Higher probability of continuation after multiple days.
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Confluence Breakdown */}
                      <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6">
                          What's Driving This Bias?
                        </h3>

                        <div className="space-y-4">
                          {currentSymbolData.confluence_breakdown && Object.entries(currentSymbolData.confluence_breakdown).map(([key, component]) => (
                            <div key={key}>
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium text-slate-100">{component.name}</div>
                                  <div className="text-xs text-slate-500">{component.weight}% of confluence</div>
                                </div>
                                <div className="text-sm font-medium text-emerald-400">{component.active || 0} signal{(component.active || 0) !== 1 ? 's' : ''}</div>
                              </div>
                              <div className="w-full bg-slate-800/50 rounded h-2">
                                <div
                                  className="bg-emerald-500 h-2 rounded transition-all"
                                  style={{ width: `${((component.active || 0) / 3) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-6 p-4 bg-slate-800/50 rounded border border-slate-700 text-xs text-slate-400">
                          <strong>What this means:</strong> Confluence measures how many independent factors agree on the current bias.
                          High agreement = higher confidence in the state. Low agreement = states likely to flip.
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Context Tab */}
                  {activeTab === 'context' && (
                    <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-6">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-500" />
                        How Did We Get Here? (Last 90 Minutes)
                      </h3>

                      {currentSymbolData.context_history && currentSymbolData.context_history.length > 0 ? (
                        <div className="space-y-2">
                          {currentSymbolData.context_history.slice(-12).map((entry, idx) => (
                            <div key={idx} className="flex items-center gap-4 text-sm py-2 border-b border-slate-700/50 last:border-0">
                              <div className="w-20 text-slate-500 text-xs">
                                {entry.time_minutes_ago?.toFixed(0) || 0}m ago
                              </div>
                              <div className={`px-2 py-1 rounded text-xs font-medium ${
                                entry.bias === 'BULLISH'
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : entry.bias === 'BEARISH'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-slate-700 text-slate-300'
                              }`}>
                                {entry.bias}
                              </div>
                              <div className="flex-1 text-slate-400 text-xs">
                                Vol: {entry.volatility || 'Unknown'} • Conf: {entry.confluence || 0}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-slate-400 text-sm py-8 text-center">
                          Not enough history yet. Check back in a few minutes.
                        </div>
                      )}

                      <div className="mt-6 p-4 bg-slate-800/50 rounded border border-slate-700 text-xs text-slate-400">
                        <strong>What to look for:</strong> Patterns in this history teach you about the market's tendencies.
                        How often does volatility expand before flips? How long do biases typically hold? This is pattern recognition training.
                      </div>
                    </div>
                  )}

                  {/* Interpretation Tab */}
                  {activeTab === 'interpretation' && (
                    <div className="space-y-6">
                      {/* Why This Matters */}
                      <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6 flex items-center gap-2">
                          <Info className="w-4 h-4 text-emerald-500" />
                          Why This Matters (No Advice — Just Analysis)
                        </h3>

                        <div className="space-y-4 text-sm text-slate-300">
                          <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                            <div className="font-medium text-slate-100 mb-2">Current Market State</div>
                            <p>
                              {currentSymbolData.market_regime?.trend === 'Strong' && currentSymbolData.market_regime?.volatility === 'Expanding'
                                ? 'The market is trending with expanding volatility. Historically, this leads to breakouts more often than reversals.'
                                : currentSymbolData.market_regime?.trend === 'Weak'
                                ? 'The trend is weak and commitment is low. Reversals are common in this state.'
                                : currentSymbolData.market_regime?.structure === 'Choppy'
                                ? 'Structure is choppy. Price action lacks clarity, which typically precedes sharper moves.'
                                : 'The market shows mixed signals. More data needed before strong directional moves.'}
                            </p>
                          </div>

                          <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                            <div className="font-medium text-slate-100 mb-2">What Usually Happens Next</div>
                            <p>
                              {currentSymbolData.state_statistics?.continuation ? (
                                <>
                                  In similar market states, we observe:<br/>
                                  • Continuation: {currentSymbolData.state_statistics.continuation}%<br/>
                                  • Mean Reversion: {currentSymbolData.state_statistics.reversal}%<br/>
                                  • Consolidation: {currentSymbolData.state_statistics.consolidation}%<br/>
                                  <span className="text-xs text-slate-500 mt-2 block">
                                    (These are outcomes observed historically — not predictions or guarantees.)
                                  </span>
                                </>
                              ) : 'Insufficient historical data for this specific state.'}
                            </p>
                          </div>

                          <div className="p-4 bg-slate-800/50 rounded border border-slate-700">
                            <div className="font-medium text-slate-100 mb-2">Session Intelligence</div>
                            <p>
                              Current session: <strong>{currentSymbolData.current_session}</strong><br/>
                              Typical volatility: {currentSymbolData.session_intelligence?.volatility || 'Medium'}<br/>
                              Common setup: {currentSymbolData.session_intelligence?.best_setup || 'Mixed'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Indicator Transparency */}
                      <div className="bg-slate-900/50 border border-emerald-500/10 rounded-lg p-6">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-6">
                          Technical Factors (Inspect the Logic)
                        </h3>

                        <div className="space-y-3">
                          {currentSymbolData.indicators && Object.entries(currentSymbolData.indicators).map(([name, value]) => (
                            <button
                              key={name}
                              onMouseEnter={() => setHoveredIndicator(name)}
                              onMouseLeave={() => setHoveredIndicator(null)}
                              className="w-full text-left p-3 rounded border border-slate-700 hover:border-emerald-500/30 transition-colors bg-slate-800/30 hover:bg-slate-800/60"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full ${value?.toString().includes('🟢') ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                                  <span className="font-medium text-slate-100">{name}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                              </div>

                              {hoveredIndicator === name && (
                                <div className="text-xs text-slate-400 mt-2 pt-2 border-t border-slate-700">
                                  <div className="mb-1"><strong>Status:</strong> {value}</div>
                                  <div className="mb-1"><strong>What it measures:</strong> Price momentum and directional strength</div>
                                  <div><strong>Discounted when:</strong> Divergences appear or value reaches extremes</div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Info Box */}
                <div className="mt-8 p-4 bg-slate-900/50 border border-slate-700 rounded-lg text-xs text-slate-400">
                  <div className="font-medium text-slate-300 mb-2">About This Dashboard</div>
                  <p>
                    OracleX exists to support thinking — not replace it. The analysis you see reflects market conditions, historical patterns,
                    and confluence analysis. All interpretations are educational in nature. Trading decisions remain entirely your responsibility.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OracleXDashboard;
