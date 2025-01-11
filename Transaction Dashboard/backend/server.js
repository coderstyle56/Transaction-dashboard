const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());

// Fetch JSON Data
const DATA_URL = 'https://s3.amazonaws.com/roxiler.com/product_transaction.json';
let transactions = [];

// Fetch data on server start
axios.get(DATA_URL)
  .then(response => {
    transactions = response.data;
    console.log('Data fetched successfully');
  })
  .catch(error => console.error('Error fetching data:', error));

// Utility to filter data by month
function filterByMonth(data, month) {
  return data.filter(item => {
    const saleMonth = new Date(item.dateOfSale).getMonth();
    return saleMonth === month;
  });
}

// List Transactions API
app.get('/api/transactions', (req, res) => {
  const { month = 'March', search = '', page = 1, perPage = 10 } = req.query;
  const monthIndex = new Date(`${month} 1`).getMonth();
  const filteredData = filterByMonth(transactions, monthIndex);

  const searchedData = filteredData.filter(item => 
    item.title.includes(search) ||
    item.description.includes(search) ||
    item.price.toString().includes(search)
  );

  const startIndex = (page - 1) * perPage;
  const paginatedData = searchedData.slice(startIndex, startIndex + parseInt(perPage));

  res.json({ data: paginatedData, total: searchedData.length });
});

// Statistics API
app.get('/api/statistics', (req, res) => {
  const { month = 'March' } = req.query;
  const monthIndex = new Date(`${month} 1`).getMonth();
  const filteredData = filterByMonth(transactions, monthIndex);

  const totalSaleAmount = filteredData.reduce((sum, item) => sum + (item.sold ? item.price : 0), 0);
  const totalSoldItems = filteredData.filter(item => item.sold).length;
  const totalNotSoldItems = filteredData.filter(item => !item.sold).length;

  res.json({ totalSaleAmount, totalSoldItems, totalNotSoldItems });
});

// Bar Chart API
app.get('/api/bar-chart', (req, res) => {
  const { month = 'March' } = req.query;
  const monthIndex = new Date(`${month} 1`).getMonth();
  const filteredData = filterByMonth(transactions, monthIndex);

  const priceRanges = {
    '0-100': 0,
    '101-200': 0,
    '201-300': 0,
    '301-400': 0,
    '401-500': 0,
    '501-600': 0,
    '601-700': 0,
    '701-800': 0,
    '801-900': 0,
    '901+': 0
  };

  filteredData.forEach(item => {
    if (item.price <= 100) priceRanges['0-100']++;
    else if (item.price <= 200) priceRanges['101-200']++;
    else if (item.price <= 300) priceRanges['201-300']++;
    else if (item.price <= 400) priceRanges['301-400']++;
    else if (item.price <= 500) priceRanges['401-500']++;
    else if (item.price <= 600) priceRanges['501-600']++;
    else if (item.price <= 700) priceRanges['601-700']++;
    else if (item.price <= 800) priceRanges['701-800']++;
    else if (item.price <= 900) priceRanges['801-900']++;
    else priceRanges['901+']++;
  });

  res.json(priceRanges);
});

// Pie Chart API
app.get('/api/pie-chart', (req, res) => {
  const { month = 'March' } = req.query;
  const monthIndex = new Date(`${month} 1`).getMonth();
  const filteredData = filterByMonth(transactions, monthIndex);

  const categoryCounts = {};
  filteredData.forEach(item => {
    categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
  });

  res.json(categoryCounts);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
