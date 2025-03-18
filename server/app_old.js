const express = require('express');
const path = require('path');
const fs = require('fs');
const animeRoutes = require('./routes/animeRoutes');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// Check if database file exists, create it if not
const dbPath = path.join(__dirname, '/data/anime.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(dbPath)) {
  const initialData = {
    anime: [
      {
        id: 1,
        title: "Attack on Titan",
        genre: "Action, Drama, Fantasy",
        episodes: 75,
        rating: 9.0,
        studio: "MAPPA"
      },
      {
        id: 2,
        title: "My Hero Academia",
        genre: "Action, Comedy",
        episodes: 113,
        rating: 8.4,
        studio: "Bones"
      },
      {
        id: 3,
        title: "Demon Slayer",
        genre: "Action, Fantasy",
        episodes: 44,
        rating: 8.9,
        studio: "ufotable"
      }
    ]
  };
  fs.writeFileSync(dbPath, JSON.stringify(initialData, null, 2));
  console.log('Database file created with initial data');
}

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to Anime API! Go to /api/anime to get started.');
});

// API routes
app.use('/api/anime', animeRoutes);

// 404 route
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});