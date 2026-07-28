import { useState, useEffect, useRef } from "react";
import {
  FiMaximize2,
  FiMinimize2,
  FiActivity,
  FiClock,
  FiZap,
} from "react-icons/fi";
import "./MT5RealChart.css";

const SYMBOLS = [
  { id: "XAUUSD", name: "Gold / USD", tvSymbol: "OANDA:XAUUSD", price: "2,341.80", change: "+1.24%", up: true, category: "Metals", spread: "0.20", bid: "2,341.70", ask: "2,341.90" }
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

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.width = "100%";
    widget.style.height = "100%";

    container.appendChild(widget);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: selectedSymbol.tvSymbol,
      interval: selectedInterval,
      timezone: "Etc/UTC",
      theme: "light",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_side_toolbar: false,
      hide_legend: false,
      save_image: false,
      backgroundColor: "#ffffff",
      gridColor: "rgba(0,0,0,0.05)",
      support_host: "https://www.tradingview.com",
    });

    widget.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = "";
      }
    };
  }, [selectedSymbol, selectedInterval]);

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
              Professional candlestick charting with real-time liquidity, spread monitoring, and technical indicators.
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
            {/* <div className="stat-main">
              <span className="stat-symbol">{selectedSymbol.name}</span>
              <div className="stat-price-wrap">
                <span className="stat-price">${selectedSymbol.price}</span>
                <span className={`stat-badge ${selectedSymbol.up ? "up" : "down"}`}>
                  {selectedSymbol.up ? <FiTrendingUp /> : <FiTrendingDown />}
                  {selectedSymbol.change}
                </span>
              </div>
            </div> */}

            {/* <div className="stat-grid">
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
            </div> */}
          </div>

          {/* Chart Viewport */}
          <div className="mt5-chart-layout">
            <div className="mt5-chart-viewport" ref={containerRef}>
              <p>Loading MT5 Real-Time Data Stream for {selectedSymbol.id}...</p>
              <div className="mt5-chart-placeholder">
                <FiActivity className="spin-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MT5RealChart;
