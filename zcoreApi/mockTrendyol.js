const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Basic Auth Middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base64 = authHeader.split(' ')[1];
  const [key, secret] = Buffer.from(base64, 'base64').toString().split(':');

  if (key !== 'test-api-key' || secret !== 'test-api-secret') {
    return res.status(401).json({ error: 'Invalid API Key or Secret' });
  }
  next();
};

app.get('/integration/order/sellers/:sellerId/orders', authMiddleware, (req, res) => {
  const sellerId = req.params.sellerId;
  const userAgent = req.headers['user-agent'];

  if (!userAgent || !userAgent.includes(sellerId)) {
    return res.status(403).json({ error: 'Forbidden: Invalid User-Agent' });
  }

  // Generate some mock orders
  const mockOrders = Array.from({ length: 5 }).map((_, i) => ({
    orderNumber: `MOCK-${Date.now()}-${i}`,
    status: i % 2 === 0 ? 'Created' : 'Shipped',
    grossAmount: (100 + i * 10.5),
    totalPrice: (100 + i * 10.5),
    currencyCode: 'TRY',
    orderDate: Date.now() - i * 1000 * 60 * 60 * 24, // past days
    lines: [
      {
        productName: `Mock Product ${i + 1}`,
        productCode: 1000 + i,
        quantity: i + 1,
        amount: 50,
        price: 50,
        sku: `SKU-${i}`,
      }
    ],
    shipmentAddress: {
      firstName: 'Mock',
      lastName: 'User ' + i,
      city: 'Istanbul',
      district: 'Kadikoy',
      address1: 'Test Address ' + i,
      countryCode: 'TR'
    }
  }));

  res.json({
    totalElements: 5,
    totalPages: 1,
    page: 0,
    size: 50,
    content: mockOrders
  });
});

app.listen(port, () => {
  console.log(`[Mock Trendyol API] running at http://localhost:${port}`);
  console.log('Test Credentials:');
  console.log('Supplier ID: 12345');
  console.log('API Key: test-api-key');
  console.log('API Secret: test-api-secret');
});
