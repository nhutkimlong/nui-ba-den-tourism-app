const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Sample data
const services = [
  {
    id: 1,
    name: 'Cáp treo Núi Bà Đen',
    description: 'Trải nghiệm cáp treo với tầm nhìn toàn cảnh núi Bà Đen.',
    price: 200000,
    image: 'https://example.com/images/cap-treo.jpg',
  },
  {
    id: 2,
    name: 'Hướng dẫn viên du lịch',
    description: 'Tour tham quan lịch sử, văn hoá địa phương.',
    price: 500000,
    image: 'https://example.com/images/huong-dan-vien.jpg',
  },
  {
    id: 3,
    name: 'Thuê xe điện',
    description: 'Di chuyển thuận tiện quanh khu du lịch.',
    price: 150000,
    image: 'https://example.com/images/xe-dien.jpg',
  },
];

const events = [
  {
    id: 1,
    name: 'Lễ hội Xuân Núi Bà',
    date: '2025-02-15',
    description: 'Lễ hội truyền thống với nhiều hoạt động văn hoá đặc sắc.',
    image: 'https://example.com/images/le-hoi-xuan.jpg',
  },
  {
    id: 2,
    name: 'Giải leo núi Bà Đen',
    date: '2025-06-10',
    description: 'Sự kiện thể thao dành cho người yêu leo núi.',
    image: 'https://example.com/images/leo-nui.jpg',
  },
];

const mapPoints = [
  {
    id: 1,
    name: 'Chùa Bà',
    description: 'Điểm hành hương nổi tiếng trên Núi Bà Đen.',
    lat: 11.3127,
    lng: 106.1303,
  },
  {
    id: 2,
    name: 'Đỉnh Núi Bà Đen',
    description: 'Đỉnh núi cao nhất Nam Bộ với phong cảnh hùng vĩ.',
    lat: 11.3047,
    lng: 106.1355,
  },
  {
    id: 3,
    name: 'Nhà ga cáp treo',
    description: 'Điểm xuất phát tuyến cáp treo.',
    lat: 11.3091,
    lng: 106.1278,
  },
];

// Load JSON data from files
const loadJsonData = (filename) => {
  try {
    const filePath = path.join(__dirname, 'data', filename);
    if (fs.existsSync(filePath)) {
      const text = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(text);
    }
  } catch (e) {
    console.error(`Error loading ${filename}:`, e.message);
  }
  return [];
};

// Routes
app.get('/api/info', (req, res) => {
  res.json({ name: 'Núi Bà Đen Tourism App', status: 'Running' });
});

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.get('/api/events', (req, res) => {
  res.json(events);
});

app.get('/api/map', (req, res) => {
  res.json(mapPoints);
});

// Return GeoJSON from remote URL or local file
app.get('/api/map/geojson', async (req, res) => {
  const remoteUrl = process.env.MAP_DATA_URL;
  if (remoteUrl) {
    https.get(remoteUrl, (r) => {
      let data = '';
      r.on('data', (chunk) => (data += chunk));
      r.on('end', () => {
        try {
          const json = JSON.parse(data);
          res.json(json);
        } catch (e) {
          res.status(500).json({ error: 'Invalid JSON from MAP_DATA_URL' });
        }
      });
    }).on('error', () => res.status(502).json({ error: 'Failed to fetch MAP_DATA_URL' }));
    return;
  }

  const filePath = path.join(__dirname, 'data', 'map.geojson');
  if (fs.existsSync(filePath)) {
    try {
      const text = fs.readFileSync(filePath, 'utf8');
      return res.json(JSON.parse(text));
    } catch (e) {
      return res.status(500).json({ error: 'Failed to read local GeoJSON' });
    }
  }
  res.status(404).json({ error: 'No GeoJSON source configured' });
});

// API endpoints for tourism data
app.get('/api/tours', (req, res) => {
  res.json(loadJsonData('tours.json'));
});

app.get('/api/restaurants', (req, res) => {
  res.json(loadJsonData('restaurants.json'));
});

app.get('/api/accommodations', (req, res) => {
  res.json(loadJsonData('accommodations.json'));
});

app.get('/api/specialties', (req, res) => {
  res.json(loadJsonData('specialties.json'));
});

app.get('/api/poi', (req, res) => {
  res.json(loadJsonData('poi.json'));
});

app.get('/api/activities', (req, res) => {
  res.json(loadJsonData('giohoatdong.json'));
});

// Health check
app.get('/', (_req, res) => {
  res.send('Backend is running');
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});


