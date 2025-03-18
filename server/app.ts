import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import animeRoutes from './routes/animeRoutes';
import cors from 'cors';

// Define anime interface
interface Anime {
  id: number;
  title: string;
  genre: string;
  episodes: number;
  rating: number;
  studio: string;
}

interface Database {
  anime: Anime[];
}

// Initialize express app
const app = express();
const PORT = process.env.PORT ||3000;
app.use(cors());

// Middleware
app.use(cors());
app.use(express.json());

// Check if database file exists, create it if not
const dbPath: string = path.join(__dirname, '/data/anime.json');
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(dbPath)) {
  const initialData: Database = {
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
app.get('/', (req: Request, res: Response): void => {
  res.send('Welcome to Anime API! Go to /api/anime to get started.');
});

// API routes
app.use('/api/anime', animeRoutes);

// 404 route
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start the server
app.listen(PORT, (): void => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 