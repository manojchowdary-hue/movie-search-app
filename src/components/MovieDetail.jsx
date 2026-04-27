import { X, Star, Clock, Calendar, Globe, Award, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const MovieDetail = ({ isOpen, onClose, details }) => {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="modal-overlay">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="modal-backdrop"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="modal-container custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="modal-close-btn"
          >
            <X className="modal-close-icon" />
          </button>

          {!details ? (
            <div className="modal-loading">
              <div className="loading-ring"></div>
              <p className="loading-subtext">Loading details...</p>
            </div>
          ) : (
            <div className="detail-layout">
              <div className="detail-poster-wrapper">
                <img
                  src={details.Poster !== 'N/A' ? details.Poster : 'https://via.placeholder.com/400x600'}
                  alt={details.Title}
                  className="detail-poster"
                />
                <div className="poster-gradient-desktop"></div>
                <div className="poster-gradient-mobile"></div>
              </div>

              <div className="detail-info">
                <div>
                  <div className="detail-meta-tags">
                    <span className="rating-badge">
                      {details.Rated}
                    </span>
                    <div className="imdb-rating">
                      <Star className="star-icon" />
                      <span>{details.imdbRating}</span>
                    </div>
                  </div>
                  <h2 className="movie-detail-title">
                    {details.Title}
                  </h2>
                  <p className="movie-genre">
                    {details.Genre}
                  </p>
                </div>

                <div className="key-metrics">
                  <div className="metric-item">
                    <Clock className="metric-icon" />
                    <div>
                      <p className="metric-label">Runtime</p>
                      <p className="metric-value">{details.Runtime}</p>
                    </div>
                  </div>
                  <div className="metric-item">
                    <Calendar className="metric-icon" />
                    <div>
                      <p className="metric-label">Released</p>
                      <p className="metric-value">{details.Released}</p>
                    </div>
                  </div>
                </div>

                <div className="synopsis-section">
                  <h3 className="section-title">Synopsis</h3>
                  <p className="plot-text">
                    {details.Plot}
                  </p>
                </div>

                <div className="cast-awards-section">
                  <div className="cast-award-item">
                    <User className="cast-award-icon" />
                    <p className="cast-award-text">
                      <span className="bold-label">Cast:</span> {details.Actors}
                    </p>
                  </div>
                  <div className="cast-award-item">
                    <Award className="cast-award-icon" />
                    <p className="cast-award-text">
                      <span className="bold-label">Awards:</span> {details.Awards}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default MovieDetail
