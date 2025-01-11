import axios from "axios";
import React, { useEffect, useState } from "react";
import "./App.css";
import BarChart from "./BarChart"; // Assuming BarChart is in a separate component
import PieChart from "./Paichart"; // Assuming PieChart is in a separate component

const App = () => {
  const [month, setMonth] = useState("March"); // Default month
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [barData, setBarData] = useState({});
  const [pieData, setPieData] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10); // Fixed per-page value

  const fetchTransactions = async () => {
    const response = await axios.get("http://localhost:5000/api/transactions", {
      params: { month, search, page, perPage },
    });
    setTransactions(response.data.data);
  };

  const fetchStatistics = async () => {
    const response = await axios.get("http://localhost:5000/api/statistics", {
      params: { month },
    });
    setStatistics(response.data);
  };

  const fetchBarData = async () => {
    const response = await axios.get("http://localhost:5000/api/bar-chart", {
      params: { month },
    });
    setBarData(response.data);
  };

  const fetchPieData = async () => {
    const response = await axios.get("http://localhost:5000/api/pie-chart", {
      params: { month },
    });
    setPieData(response.data);
  };

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarData();
    fetchPieData();
  }, [month, search, page]);

  return (
    <div className="App">
      <h1>Transaction Dashboard</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search transaction"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="month-select"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics Section */}
      <div className="statistics">
        <h2>Statistics - {month}</h2>
        <p>Total Sale: ${statistics.totalSaleAmount}</p>
        <p>Total Sold Items: {statistics.totalSoldItems}</p>
        <p>Total Not Sold Items: {statistics.totalNotSoldItems}</p>
      </div>

      {/* Transactions Table */}
      <div className="transactions">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Category</th>
              <th>Sold</th>
              <th>Image</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>${transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? "Yes" : "No"}</td>
                  <td>
                    {transaction.image ? (
                      <img
                        src={transaction.image}
                        alt={transaction.title}
                        className="transaction-image"
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <p>Page No: {page}</p>
          <div>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <button onClick={() => setPage(page + 1)}>Next</button>
          </div>
          <p>Per Page: {perPage}</p>
        </div>
      </div>

      {/* Charts Section */}
      {/* <div className="charts">
        <h2>Bar Chart</h2>
        <BarChart data={barData} />

        <h2>Pie Chart</h2>
        <PieChart data={pieData} />
      </div> */}
      <div className="charts">
        <div className="chart-container">
          <h2>Bar Chart</h2>
          <BarChart data={barData} />
        </div>
        <div className="chart-container">
          <h2>Pie Chart</h2>
          <PieChart data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default App;
