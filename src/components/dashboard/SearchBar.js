import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
const SearchBar = ({ keyword, onChange }) => {
  return (
    <div class="search-box">
      <input
        class="search-input"
        type="text"
        value={keyword}
        placeholder={"search"}
        onChange={(e) => onChange(e.target.value)}
      />
      <button class="search-btn">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </div>
  );
};

export default SearchBar;
