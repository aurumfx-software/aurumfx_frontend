import "./TickerBar.css";

const tickers = [
  { pair: "XAU/USD", price: "2,341.80", change: "+1.24%", up: true },
  { pair: "EUR/USD", price: "1.0842", change: "-0.18%", up: false },
  { pair: "GBP/USD", price: "1.2715", change: "+0.32%", up: true },
  { pair: "USD/JPY", price: "157.42", change: "+0.09%", up: true },
  { pair: "XAG/USD", price: "28.65", change: "+0.87%", up: true },
  { pair: "BTC/USD", price: "67,420", change: "-0.54%", up: false },
  { pair: "AUD/USD", price: "0.6621", change: "+0.11%", up: true },
];

function TickerBar() {
  const items = [...tickers, ...tickers];

  return (
    <div className="ticker-bar">
      <div className="ticker-track">
        {items.map((t, i) => (
          <div className="ticker-item" key={`${t.pair}-${i}`}>
            <span className="ticker-pair">{t.pair}</span>
            <span className="ticker-price">{t.price}</span>
            <span className={`ticker-change ${t.up ? "up" : "down"}`}>{t.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TickerBar;
