import "../styles/UnifiedSearchBar.css";

function UnifiedSearchBar({ value, onChange, onSubmit, placeholder }) {
  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmit) onSubmit(value);
  };

  return (
    <form className="unified-search" onSubmit={handleSubmit} role="search">
      <div className="unified-search-inner">
        <span className="unified-search-icon" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          type="search"
          className="unified-search-input"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={
            placeholder ||
            "Search notes by title, subject, branch, semester, or uploader..."
          }
          aria-label="Search study notes"
        />
        <button type="submit" className="unified-search-btn">
          Search
        </button>
      </div>
    </form>
  );
}

export default UnifiedSearchBar;
