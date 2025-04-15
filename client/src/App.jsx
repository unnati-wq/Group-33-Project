// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TopBooksPage from './pages/BookDetailsPage';
import AuthorPage from './pages/AuthorPage';
import GenrePage from './pages/GenrePage';
import SearchResultPage from './pages/SearchResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/books/:id" element={<TopBooksPage />} />
        <Route path="/authors/:id" element={<AuthorPage />} />
        <Route path="/genres/:name" element={<GenrePage />} />
        <Route path="/search" element={<SearchResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;