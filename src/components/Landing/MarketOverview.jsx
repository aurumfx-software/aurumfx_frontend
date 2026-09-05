import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import "./MarketOverview.css";

const markets = [
  { symbol: "XAU/USD", name: "Gold", price: "2,341.80", change: "+1.24%", up: true },
  { symbol: "XAG/USD", name: "Silver", price: "28.65", change: "+0.87%", up: true },
  { symbol: "EUR/USD", name: "Euro", price: "1.0842", change: "-0.18%", up: false },
  { symbol: "GBP/USD", name: "Pound", price: "1.2715", change: "+0.32%", up: true },
  { symbol: "USD/JPY", name: "Yen", price: "157.42", change: "+0.09%", up: true },
  { symbol: "AUD/USD", name: "Aussie", price: "0.6621", change: "+0.11%", up: true },
];

function MarketOverview() {
  return (
    <section className="market-overview" id="markets">
      <div className="market-container">
        <div className="section-head">
          <h2>Live Markets</h2>
          <p>Track gold, silver, and major forex pairs in real time.</p>
        </div>

        <div className="market-grid">
          {markets.map((m) => (
            <div className="market-card" key={m.symbol}>
              <div className="market-card-top">
                <div>
                  <span className="market-symbol">{m.symbol}</span>
                  <span className="market-name">{m.name}</span>
                </div>
                {m.up ? (
                  <FiArrowUpRight className="market-arrow up" />
                ) : (
                  <FiArrowDownRight className="market-arrow down" />
                )}
              </div>
              <div className="market-card-bottom">
                <span className="market-price">{m.price}</span>
                <span className={`market-change ${m.up ? "up" : "down"}`}>{m.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MarketOverview;
