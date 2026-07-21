import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <div className="logo">AurumFX</div>

        <nav>
          <a href="/">Home</a>
          <a href="/">Markets</a>
          <a href="/">Portfolio</a>
          <a href="/">Reports</a>
          <a href="/">Profile</a>
        </nav>

        <button className="logout-btn">Logout</button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Welcome to AurumFX</h1>
        <p>
          Your complete Forex Trading & Investment Dashboard.
        </p>

        <button className="primary-btn">
          Start Trading
        </button>
      </section>

      {/* Dashboard Cards */}
      <section className="cards">
        <div className="card">
          <h3>Total Balance</h3>
          <h2>$25,450.00</h2>
        </div>

        <div className="card">
          <h3>Open Trades</h3>
          <h2>12</h2>
        </div>

        <div className="card">
          <h3>Profit Today</h3>
          <h2>$845</h2>
        </div>

        <div className="card">
          <h3>Active Clients</h3>
          <h2>186</h2>
        </div>
      </section>

      {/* Recent Activity */}
      <section className="activity">
        <h2>Recent Transactions</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>21 Jul 2026</td>
              <td>Deposit</td>
              <td>$500</td>
              <td className="success">Completed</td>
            </tr>

            <tr>
              <td>20 Jul 2026</td>
              <td>Withdrawal</td>
              <td>$250</td>
              <td className="pending">Pending</td>
            </tr>

            <tr>
              <td>19 Jul 2026</td>
              <td>Trade Profit</td>
              <td>$980</td>
              <td className="success">Completed</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default Home;