// src/components/Search/Search.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './search.module.css'; // Ensure this path is correct

const Search = ({
  searchRoute = '/search/',
  defaultRoute = '/',
  margin,
  placeholder = 'Search Food Hunt!',
}) => {
  const [term, setTerm] = useState('');
  const navigate = useNavigate();
  const { searchTerm } = useParams();

  useEffect(() => {
    setTerm(searchTerm ?? '');
  }, [searchTerm]);

  const search = () => {
    term ? navigate(searchRoute + term) : navigate(defaultRoute);
  };

  return (
    <div className={styles.container} style={{ margin }}>
      <input
        type="text"
        placeholder={placeholder}
        onChange={e => setTerm(e.target.value)}
        onKeyUp={e => e.key === 'Enter' && search()}
        value={term}
      />
      <button onClick={search}>Search</button>
    </div>
  );
};

export default Search;
