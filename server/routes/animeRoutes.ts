import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Define interfaces
interface Anime {
  id: number;
  title: string;
  genre: string;
  episodes: number;
  rating: number | null;
  studio: string;
}

interface Database {
  anime: Anime[];
}

interface GenreBreakdown {
  [key: string]: number;
}

interface StudioBreakdown {
  [key: string]: number;
}

interface Stats {
  totalAnime: number;
  averageEpisodes: number;
  averageRating: number;
  genreBreakdown: GenreBreakdown;
  studioBreakdown: StudioBreakdown;
}

const router = express.Router();

// Path to our JSON database
const dbPath: string = path.join(__dirname, "..", "data", "anime.json");
console.log('Database path:', dbPath);
console.log('File exists:', fs.existsSync(dbPath));

// Helper function to read the database
const readDatabase = (): Database => {
  try {
    const rawData = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Error reading or parsing database:', error);
    // Kembalikan database kosong sebagai fallback
    return { anime: [] };
  }
};

// Helper function to write to the database
const writeDatabase = (data: Database): void => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
};

// GET - Fetch all anime
router.get('/', (req: Request, res: Response): void => {
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET - Fetch a specific anime by ID
router.get('/:id', (req: Request, res: Response): void => {
  try {
    const id: number = parseInt(req.params.id);
    const data = readDatabase();
    const anime = data.anime.find(item => item.id === id);
    
    if (!anime) {
      res.status(404).json({
        status: 'error',
        message: 'Anime not found'
      });
      return;
    }
    
    res.json({
      status: 'success',
      data: anime
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch anime data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST - Add a new anime
router.post('/', (req: Request, res: Response): void => {
  try {
    const { title, genre, episodes, rating, studio } = req.body;
    
    // Validation
    if (!title || !genre || !episodes) {
      res.status(400).json({
        status: 'error',
        message: 'Title, genre, and episodes are required fields'
      });
      return;
    }
    
    // Read current database
    const data = readDatabase();
    
    // Create new anime object
    const newId: number = data.anime.length > 0 ? Math.max(...data.anime.map(item => item.id)) + 1 : 1;
    const newAnime: Anime = {
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// PUT - Update an existing anime
router.put('/:id', (req: Request, res: Response): void => {
  try {
    const id: number = parseInt(req.params.id);
    const { title, genre, episodes, rating, studio } = req.body;
    
    // Read current database
    const data = readDatabase();
    
    // Find anime index
    const animeIndex: number = data.anime.findIndex(item => item.id === id);
    
    if (animeIndex === -1) {
      res.status(404).json({
        status: 'error',
        message: 'Anime not found'
      });
      return;
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE - Remove an anime
router.delete('/:id', (req: Request, res: Response): void => {
  try {
    const id: number = parseInt(req.params.id);
    
    // Read current database
    const data = readDatabase();
    
    // Find anime index
    const animeIndex: number = data.anime.findIndex(item => item.id === id);
    
    if (animeIndex === -1) {
      res.status(404).json({
        status: 'error',
        message: 'Anime not found'
      });
      return;
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET - Search anime by title, genre, or studio
router.get('/search/query', (req: Request, res: Response): void => {
  try {
    const q = req.query.q as string;
    
    if (!q) {
      res.status(400).json({
        status: 'error',
        message: 'Search query is required'
      });
      return;
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET - Get stats about the collection
router.get('/stats/summary', (req: Request, res: Response): void => {
  try {
    const data = readDatabase();
    const animeList = data.anime;
    
    // Calculate stats
    const stats: Stats = {
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
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;