import axios from 'axios';

// Use environment variable for OMDb API Key
const API_KEY = import.meta.env.VITE_OMDB_API_KEY;
const BASE_URL = 'https://www.omdbapi.com/';

const mockMovies = [
  { Title: "Interstellar", Year: "2014", imdbID: "tt0816692", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg" },
  { Title: "The Dark Knight", Year: "2008", imdbID: "tt0468569", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg" },
  { Title: "Inception", Year: "2010", imdbID: "tt1375666", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg" },
  { Title: "The Matrix", Year: "1999", imdbID: "tt0133093", Type: "movie", Poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg" }
];

const api = axios.create({
  baseURL: BASE_URL,
});

export const searchMovies = async (query, page = 1) => {
  if (!API_KEY || API_KEY === 'your_actual_api_key_here') {
    // Return mock results that match query or just some samples
    await new Promise(r => setTimeout(r, 800));
    const normalizedQuery = query.toLowerCase();
    const filtered = mockMovies.filter(m => m.Title.toLowerCase().includes(normalizedQuery));
    
    // Simple mock pagination
    if (page > 1) return { Search: [], Response: "False", Error: "No more results" };
    
    return { 
      Search: filtered.length ? filtered : mockMovies, 
      Response: "True", 
      totalResults: filtered.length ? filtered.length.toString() : "4" 
    };
  }
  
  try {
    const response = await api.get('', {
      params: {
        s: query,
        page: page,
        apikey: API_KEY,
      },
    });
    
    if (response.data.Response === 'False') {
      return response.data; // Return the OMDb error object
    }
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    return { Response: 'False', Error: 'Connection error. Please try again.' };
  }
};

export const getMovieDetails = async (id) => {
  if (!API_KEY || API_KEY === 'your_actual_api_key_here') {
    await new Promise(r => setTimeout(r, 800));
    return {
      Title: "Interstellar",
      Year: "2014",
      Rated: "PG-13",
      Released: "07 Nov 2014",
      Runtime: "169 min",
      Genre: "Adventure, Drama, Sci-Fi",
      Director: "Christopher Nolan",
      Actors: "Matthew McConaughey, Anne Hathaway, Jessica Chastain, Ellen Burstyn",
      Plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival. In a near future earth is being devastated by drought and famine...",
      Awards: "Won 1 Oscar. Another 43 wins & 148 nominations.",
      Poster: "https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg",
      imdbRating: "8.7",
      Response: "True"
    };
  }

  try {
    const response = await api.get('', {
      params: {
        i: id,
        plot: 'full',
        apikey: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Network error');
  }
};
