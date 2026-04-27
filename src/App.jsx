import { useState, useEffect } from 'react'
import SearchBar from './components/SearchBar'
import MovieCard from './components/MovieCard'
import MovieDetail from './components/MovieDetail'
import { searchMovies, getMovieDetails } from './utils/api'
import { Loader2, Film, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [details, setDetails] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showWatchlist, setShowWatchlist] = useState(false)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [loadingMore, setLoadingMore] = useState(false)
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('movie-watchlist')
    return saved ? JSON.parse(saved) : []
  })

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('movie-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  const toggleWatchlist = (e, movie) => {
    e.stopPropagation()
    setWatchlist(prev => {
      const isExist = prev.find(m => m.imdbID === movie.imdbID)
      if (isExist) {
        return prev.filter(m => m.imdbID !== movie.imdbID)
      } else {
        return [...prev, movie]
      }
    })
  }

  // Debounced search logic
  useEffect(() => {
    const fetchMovies = async () => {
      if (query.trim().length < 3) {
        setMovies([])
        setError(null)
        setTotalResults(0)
        setPage(1)
        return
      }
      
      setLoading(true)
      setError(null)
      try {
        const data = await searchMovies(query, 1)
        if (data.Response === 'True') {
          setMovies(data.Search)
          setTotalResults(parseInt(data.totalResults))
          setPage(1)
        } else {
          setError(data.Error || 'No movies found')
          setMovies([])
          setTotalResults(0)
        }
      } catch (err) {
        setError('Failed to fetch movies. Please check your connection.')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchMovies, 500)
    return () => clearTimeout(timer)
  }, [query])

  const handleLoadMore = async () => {
    if (loadingMore) return
    
    setLoadingMore(true)
    const nextPage = page + 1
    try {
      const data = await searchMovies(query, nextPage)
      if (data.Response === 'True') {
        setMovies(prev => [...prev, ...data.Search])
        setPage(nextPage)
      }
    } catch (err) {
      console.error('Failed to load more:', err)
    } finally {
      setLoadingMore(false)
    }
  }

  const handleMovieClick = async (id) => {
    setSelectedId(id)
    setIsModalOpen(true)
    setDetails(null) // Clear previous details while loading new ones
    try {
      const data = await getMovieDetails(id)
      setDetails(data)
    } catch (err) {
      console.error('Failed to fetch details:', err)
      setError('Could not load movie details.')
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo-container">
              <Film className="logo-icon" />
            </div>
            <h1 className="logo-text">
              Movie<span className="logo-accent">Search</span>
            </h1>
          </div>
          <SearchBar value={query} onChange={(val) => {
            setQuery(val)
            if (val.trim()) setShowWatchlist(false)
          }} />
          
          <button 
            className={`watchlist-toggle-btn ${showWatchlist ? 'active' : ''}`}
            onClick={() => setShowWatchlist(!showWatchlist)}
          >
            <Star className={`watchlist-btn-icon ${showWatchlist ? 'fill-current' : ''}`} />
            <span>Watchlist ({watchlist.length})</span>
          </button>
        </div>
      </header>

      <main className="app-main">
        {loading && (
          <div className="status-container">
            <Loader2 className="loading-spinner" />
            <p className="loading-text">Scanning the multiverse...</p>
          </div>
        )}

        {error && !loading && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="error-container"
          >
            <div className="error-icon-wrapper">
              <span className="error-emoji">🎬</span>
            </div>
            <h2 className="error-title">{error}</h2>
            <p className="error-description">Try searching for high-rated movies like "Interstellar" or "Inception".</p>
          </motion.div>
        )}

        {showWatchlist && watchlist.length === 0 && (
          <div className="empty-state">
            <Star className="empty-icon" />
            <p className="empty-text">Your watchlist is empty. Add some movies!</p>
          </div>
        )}

        {!showWatchlist && !loading && !error && movies.length === 0 && (
          <div className="empty-state">
            <Film className="empty-icon" />
            <p className="empty-text">Enter a movie title to begin</p>
          </div>
        )}

        <div className="view-title-container">
           <h2 className="view-title">
             {showWatchlist ? 'Your Watchlist' : query ? `Search results for "${query}"` : 'Discover Movies'}
           </h2>
        </div>

        <motion.div 
          layout
          className="movie-grid"
        >
          <AnimatePresence mode="popLayout">
            {(showWatchlist ? watchlist : movies).map((movie) => (
              <MovieCard 
                key={movie.imdbID} 
                movie={movie} 
                isWatchlisted={watchlist.some(m => m.imdbID === movie.imdbID)}
                onWatchlistToggle={(e) => toggleWatchlist(e, movie)}
                onClick={() => handleMovieClick(movie.imdbID)} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {!showWatchlist && movies.length > 0 && movies.length < totalResults && (
          <div className="pagination-container">
            <button 
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loadingMore}
            >
              {loadingMore ? (
                <>
                  <Loader2 className="btn-spinner" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Load More Results</span>
              )}
            </button>
            <p className="results-count">Showing {movies.length} of {totalResults} movies</p>
          </div>
        )}
      </main>

      <MovieDetail 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        details={details} 
      />
      
      <footer className="app-footer">
        <p>&copy; 2026 MovieSearch Explorer. Premium Cinema Experience.</p>
        <p style={{ marginTop: '0.5rem', opacity: 0.5 }}>Powered by OMDb API</p>
      </footer>
    </div>
  )
}

export default App
