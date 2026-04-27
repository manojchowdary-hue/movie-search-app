import { Star, Calendar, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const MovieCard = ({ movie, onClick, isWatchlisted, onWatchlistToggle }) => {
  const hasPoster = movie.Poster && movie.Poster !== 'N/A'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="movie-card"
    >
      <div className="poster-wrapper">
        {hasPoster ? (
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="movie-poster"
          />
        ) : (
          <div className="no-poster">
            <span className="no-poster-text">No Poster Available</span>
          </div>
        )}
        <div className="poster-overlay"></div>
        
        <button 
          className={`card-watchlist-btn ${isWatchlisted ? 'active' : ''}`}
          onClick={onWatchlistToggle}
          title={isWatchlisted ? "Remove from watchlist" : "Add to watchlist"}
        >
          <Star className={`card-watchlist-icon ${isWatchlisted ? 'fill-current' : ''}`} />
        </button>

        <div className="play-button-wrapper">
           <div className="play-button">
             <PlayCircle className="play-icon" />
           </div>
        </div>
      </div>

      <div className="card-content">
        <div className="meta-info">
          <Calendar className="meta-icon" />
          <span>{movie.Year}</span>
          <span className="type-badge">{movie.Type}</span>
        </div>
        <h3 className="movie-title-card">
          {movie.Title}
        </h3>
      </div>
    </motion.div>
  )
}

export default MovieCard
