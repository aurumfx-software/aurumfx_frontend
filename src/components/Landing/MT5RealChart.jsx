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
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef(null);
  const sectionRef = useRef(null);

  // Trigger heading/badge animation when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // animate once
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    widget.style.width = "100%";
    widget.style.height = "100%";

    container.appendChild(widget);

    const isMobile = window.innerWidth <= 600;

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
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      hide_top_toolbar: false,
      hide_side_toolbar: isMobile,
      hide_legend: isMobile,
      save_image: false,
      backgroundColor: "#0a0a0a",
      gridColor: "rgba(255,255,255,0.06)",
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
    <section
      ref={sectionRef}
      className={`mt5-section ${isFullscreen ? "fullscreen-mode" : ""} ${isVisible ? "in-view" : ""}`}
      id="mt5-chart"
    >
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
          <div className="mt5-control-bar">
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

          <div className="mt5-stats-bar"></div>

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