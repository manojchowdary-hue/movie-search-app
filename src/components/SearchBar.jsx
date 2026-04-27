import { Search, X } from 'lucide-react'

const SearchBar = ({ value, onChange }) => {
  return (
    <div className="search-wrapper">
      <div className="search-icon-container">
        <Search className="search-icon" />
      </div>
      <input
        type="text"
        className="search-input"
        placeholder="Search for movies, series..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="search-clear-btn"
        >
          <X className="search-clear-icon" />
        </button>
      )}
      <div className="search-glow"></div>
    </div>
  )
}

export default SearchBar
