import { useState, useEffect, useRef } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiMaximize2,
  FiMinimize2,
  FiActivity,
  FiDollarSign,
  FiClock,
  FiZap,
  FiCheckCircle,
} from "react-icons/fi";
import "./MT5RealChart.css";

const SYMBOLS = [
  { id: "XAUUSD", name: "Gold / USD", tvSymbol: "OANDA:XAUUSD", price: "2,341.80", change: "+1.24%", up: true, category: "Metals", spread: "0.20", bid: "2,341.70", ask: "2,341.90" },
  { id: "XAGUSD", name: "Silver / USD", tvSymbol: "OANDA:XAGUSD", price: "28.65", change: "+0.87%", up: true, category: "Metals", spread: "0.02", bid: "28.64", ask: "28.66" },
  { id: "EURUSD", name: "EUR / USD", tvSymbol: "FX:EURUSD", price: "1.0842", change: "-0.18%", up: false, category: "Forex", spread: "0.0001", bid: "1.0841", ask: "1.0843" },
  { id: "GBPUSD", name: "GBP / USD", tvSymbol: "FX:GBPUSD", price: "1.2715", change: "+0.32%", up: true, category: "Forex", spread: "0.0002", bid: "1.2714", ask: "1.2716" },
  { id: "USDJPY", name: "USD / JPY", tvSymbol: "FX:USDJPY", price: "157.42", change: "+0.09%", up: true, category: "Forex", spread: "0.02", bid: "157.41", ask: "157.43" },
  { id: "BTCUSD", name: "Bitcoin / USD", tvSymbol: "BINANCE:BTCUSDT", price: "67,420.50", change: "-0.54%", up: false, category: "Crypto", spread: "1.50", bid: "67,419.75", ask: "67,421.25" },
];

const TIMEFRAMES = [
  { label: "1m", value: "1" },
  { label: "5m", value: "5" },
  { label: "15m", value: "15" },
  { label: "1h", value: "60" },
  { label: "4h", value: "240" },
  { label: "1D", value: "D" },
];

function MT5RealChart() {
  const [selectedSymbol, setSelectedSymbol] = useState(SYMBOLS[0]);
  const [selectedInterval, setSelectedInterval] = useState("D");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orderVolume, setOrderVolume] = useState("0.10");
  const [orderNotification, setOrderNotification] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container__widget";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";
    containerRef.current.appendChild(widgetContainer);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: selectedSymbol.tvSymbol,
      interval: selectedInterval,
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      enable_publishing: false,
      backgroundColor: "rgba(255, 255, 255, 1)",
      gridColor: "rgba(0, 0, 0, 0.05)",
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      calendar: false,
      hide_side_toolbar: false,
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    });

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [selectedSymbol, selectedInterval]);

  const handleOrder = (type) => {
    const actionText = type === "buy" ? "BUY" : "SELL";
    setOrderNotification({
      type,
      message: `Demo ${actionText} order executed: ${orderVolume} Lot(s) of ${selectedSymbol.id} @ ${type === "buy" ? selectedSymbol.ask : selectedSymbol.bid}`,
    });

    setTimeout(() => {
      setOrderNotification(null);
    }, 4000);
  };

  return (
    <section className={`mt5-section ${isFullscreen ? "fullscreen-mode" : ""}`} id="mt5-chart">
      <div className="mt5-container">
        {/* Header */}
        <div className="mt5-header">
          <div className="mt5-header-left">
            <div className="mt5-badge">
              <FiZap /> MetaTrader 5 Engine
            </div>
            <h2>
              MT5 <span>Live Terminal Chart</span>
            </h2>
            <p>
              Professional candlestick charting with real-time liquidity, spread monitoring, and instant order execution.
            </p>
          </div>

          <div className="mt5-fullscreen-btn-wrap">
            <button
              type="button"
              className="mt5-icon-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
            >
              {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
              <span>{isFullscreen ? "Exit Fullscreen" : "Fullscreen"}</span>
            </button>
          </div>
        </div>

        {/* Terminal Wrapper */}
        <div className="mt5-terminal-wrapper">
          {/* Top Control Bar */}
          <div className="mt5-control-bar">
            {/* Symbol Selector Tabs */}
            <div className="mt5-symbols-scroll">
              {SYMBOLS.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className={`mt5-symbol-tab ${selectedSymbol.id === s.id ? "active" : ""}`}
                  onClick={() => setSelectedSymbol(s)}
                >
                  <span className="tab-symbol">{s.id}</span>
                  <span className={`tab-change ${s.up ? "up" : "down"}`}>{s.change}</span>
                </button>
              ))}
            </div>

            {/* Timeframe Buttons */}
            <div className="mt5-tf-group">
              <span className="tf-label">
                <FiClock /> Timeframe:
              </span>
              {TIMEFRAMES.map((tf) => (
                <button
                  type="button"
                  key={tf.value}
                  className={`mt5-tf-btn ${selectedInterval === tf.value ? "active" : ""}`}
                  onClick={() => setSelectedInterval(tf.value)}
                >
                  {tf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Bar & Live Ticker */}
          <div className="mt5-stats-bar">
            <div className="stat-main">
              <span className="stat-symbol">{selectedSymbol.name}</span>
              <div className="stat-price-wrap">
                <span className="stat-price">${selectedSymbol.price}</span>
                <span className={`stat-badge ${selectedSymbol.up ? "up" : "down"}`}>
                  {selectedSymbol.up ? <FiTrendingUp /> : <FiTrendingDown />}
                  {selectedSymbol.change}
                </span>
              </div>
            </div>

            <div className="stat-grid">
              <div className="stat-box">
                <span className="stat-title">Bid Price</span>
                <strong className="stat-val bid">${selectedSymbol.bid}</strong>
              </div>
              <div className="stat-box">
                <span className="stat-title">Ask Price</span>
                <strong className="stat-val ask">${selectedSymbol.ask}</strong>
              </div>
              <div className="stat-box">
                <span className="stat-title">Spread</span>
                <strong className="stat-val">{selectedSymbol.spread} pts</strong>
              </div>
              <div className="stat-box">
                <span className="stat-title">Execution</span>
                <strong className="stat-val instant">STP / ECN Live</strong>
              </div>
            </div>
          </div>

          {/* Notification Alert */}
          {orderNotification && (
            <div className={`mt5-order-toast ${orderNotification.type}`}>
              <FiCheckCircle />
              <span>{orderNotification.message}</span>
            </div>
          )}

          {/* Chart & Execution Panel Split */}
          <div className="mt5-chart-layout">
            {/* Real TradingView MT5 Chart Container */}
            <div className="mt5-chart-viewport" ref={containerRef}>
              <div className="mt5-chart-placeholder">
                <FiActivity className="spin-icon" />
                <p>Loading MT5 Real-Time Data Stream for {selectedSymbol.id}...</p>
              </div>
            </div>

            {/* Quick Order Panel */}
            <div className="mt5-order-panel">
              <div className="panel-head">
                <FiDollarSign />
                <h3>Quick Order</h3>
              </div>

              <div className="panel-body">
                <div className="form-group">
                  <label htmlFor="volume-select">Lot Size (Volume)</label>
                  <div className="volume-selector">
                    {["0.01", "0.10", "0.50", "1.00"].map((v) => (
                      <button
                        type="button"
                        key={v}
                        className={`vol-btn ${orderVolume === v ? "active" : ""}`}
                        onClick={() => setOrderVolume(v)}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="price-quote-box">
                  <div className="quote-col sell">
                    <span className="q-label">SELL</span>
                    <span className="q-price">${selectedSymbol.bid}</span>
                  </div>
                  <div className="quote-divider" />
                  <div className="quote-col buy">
                    <span className="q-label">BUY</span>
                    <span className="q-price">${selectedSymbol.ask}</span>
                  </div>
                </div>

                <div className="order-action-buttons">
                  <button
                    type="button"
                    className="btn-order btn-sell"
                    onClick={() => handleOrder("sell")}
                  >
                    SELL {orderVolume} Lot
                  </button>
                  <button
                    type="button"
                    className="btn-order btn-buy"
                    onClick={() => handleOrder("buy")}
                  >
                    BUY {orderVolume} Lot
                  </button>
                </div>

                <div className="panel-footer-info">
                  <div>
                    <span>Margin Req:</span>
                    <strong>${(parseFloat(orderVolume) * 200).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>Leverage:</span>
                    <strong>1:500</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MT5RealChart;
