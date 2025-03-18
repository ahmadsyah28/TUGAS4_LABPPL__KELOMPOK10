const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Path to our JSON database
const dbPath = path.resolve("..", "server", "data", "anime.json");

// Helper function to read the database
const readDatabase = () => {
  const rawData = fs.readFileSync(dbPath);
  return JSON.parse(rawData);
};

// Helper function to write to the database
const writeDatabase = (data) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET - Fetch all anime
router.get('/', (req, res) => {
  try {
    const data = readDatabase();
    res.json({
      status: 'success',
      data: data.anime
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch anime data',
      error: error.message
    });
  }
});

// GET - Fetch a specific anime by ID
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = readDatabase();
    const anime = data.anime.find(item => item.id === id);
    
    if (!anime) {
      return res.status(404).json({
        status: 'error',
        message: 'Anime not found'
      });
    }
    
    res.json({
      status: 'success',
      data: anime
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch anime data',
      error: error.message
    });
  }
});

// POST - Add a new anime
router.post('/', (req, res) => {
  try {
    const { title, genre, episodes, rating, studio } = req.body;
    
    // Validation
    if (!title || !genre || !episodes) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, genre, and episodes are required fields'
      });
    }
    
    // Read current database
    const data = readDatabase();
    
    // Create new anime object
    const newId = data.anime.length > 0 ? Math.max(...data.anime.map(item => item.id)) + 1 : 1;
    const newAnime = {
      id: newId,
      title,
      genre,
      episodes,
      rating: rating || null,
      studio: studio || 'Unknown'
    };
    
    // Add to collection
    data.anime.push(newAnime);
    
    // Write updated data back to file
    writeDatabase(data);
    
    res.status(201).json({
      status: 'success',
      message: 'Anime added successfully',
      data: newAnime
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to add anime',
      error: error.message
    });
  }
});

// PUT - Update an existing anime
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, genre, episodes, rating, studio } = req.body;
    
    // Read current database
    const data = readDatabase();
    
    // Find anime index
    const animeIndex = data.anime.findIndex(item => item.id === id);
    
    if (animeIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Anime not found'
      });
    }
    
    // Update anime
    data.anime[animeIndex] = {
      ...data.anime[animeIndex],
      title: title || data.anime[animeIndex].title,
      genre: genre || data.anime[animeIndex].genre,
      episodes: episodes || data.anime[animeIndex].episodes,
      rating: rating !== undefined ? rating : data.anime[animeIndex].rating,
      studio: studio || data.anime[animeIndex].studio
    };
    
    // Write updated data back to file
    writeDatabase(data);
    
    res.json({
      status: 'success',
      message: 'Anime updated successfully',
      data: data.anime[animeIndex]
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to update anime',
      error: error.message
    });
  }
});

// DELETE - Remove an anime
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    // Read current database
    const data = readDatabase();
    
    // Find anime index
    const animeIndex = data.anime.findIndex(item => item.id === id);
    
    if (animeIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Anime not found'
      });
    }
    
    // Remove anime
    const deletedAnime = data.anime[animeIndex];
    data.anime = data.anime.filter(item => item.id !== id);
    
    // Write updated data back to file
    writeDatabase(data);
    
    res.json({
      status: 'success',
      message: 'Anime deleted successfully',
      data: deletedAnime
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete anime',
      error: error.message
    });
  }
});

// GET - Search anime by title, genre, or studio
router.get('/search/query', (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
    }
    
    const data = readDatabase();
    const searchResults = data.anime.filter(anime => 
      anime.title.toLowerCase().includes(q.toLowerCase()) || 
      anime.genre.toLowerCase().includes(q.toLowerCase()) ||
      (anime.studio && anime.studio.toLowerCase().includes(q.toLowerCase()))
    );
    
    res.json({
      status: 'success',
      results: searchResults.length,
      data: searchResults
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to search anime',
      error: error.message
    });
  }
});

// GET - Get stats about the collection
router.get('/stats/summary', (req, res) => {
  try {
    const data = readDatabase();
    const animeList = data.anime;
    
    // Calculate stats
    const stats = {
      totalAnime: animeList.length,
      averageEpisodes: Math.round(animeList.reduce((acc, curr) => acc + curr.episodes, 0) / animeList.length),
      averageRating: parseFloat((animeList.reduce((acc, curr) => acc + (curr.rating || 0), 0) / animeList.length).toFixed(2)),
      genreBreakdown: {},
      studioBreakdown: {}
    };
    
    // Process genres
    animeList.forEach(anime => {
      const genres = anime.genre.split(', ');
      genres.forEach(genre => {
        stats.genreBreakdown[genre] = (stats.genreBreakdown[genre] || 0) + 1;
      });
      
      // Process studios
      const studio = anime.studio || 'Unknown';
      stats.studioBreakdown[studio] = (stats.studioBreakdown[studio] || 0) + 1;
    });
    
    res.json({
      status: 'success',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to get stats',
      error: error.message
    });
  }
});

module.exports = router;