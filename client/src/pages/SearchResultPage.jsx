import React, { useState } from 'react';
import { BookOpen, Search, Star, Filter, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function SearchResultsPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  
  // State for filters
  const [activeFilters, setActiveFilters] = useState([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // Mock data for search results
  const results = [
    {
      id: 1,
      type: 'book',
      title: "The Midnight Library",
      author: "Matt Haig",
      authorId: 1,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.5,
      price: "$14.99",
      publishDate: "2020",
      genres: ["Fiction", "Fantasy", "Contemporary"],
      description: "Between life and death there is a library, and within that library, the shelves go on forever."
    },
    {
      id: 2,
      type: 'book',
      title: "Project Hail Mary",
      author: "Andy Weir",
      authorId: 5,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.8,
      price: "$16.99",
      publishDate: "2021",
      genres: ["Science Fiction", "Adventure"],
      description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller."
    },
    {
      id: 1,
      type: 'author',
      name: "Matt Haig",
      image: "https://via.placeholder.com/100",
      rating: 4.7,
      bookCount: 15,
      genres: ["Fiction", "Fantasy", "Self Help"],
      description: "British author for children and adults. His memoir Reasons to Stay Alive was a number one bestseller."
    },
    {
      id: 3,
      type: 'book',
      title: "The House in the Cerulean Sea",
      author: "TJ Klune",
      authorId: 3,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.7,
      price: "$13.99",
      publishDate: "2020",
      genres: ["Fantasy", "LGBTQ+", "Fiction"],
      description: "A magical island. A dangerous task. A burning secret."
    }
  ];
  
  // Filter options
  const categories = ["Books", "Authors", "Publishers"];
  const genres = ["Fiction", "Fantasy", "Science Fiction", "Contemporary", "Adventure", "LGBTQ+"];
  const ratings = ["4 stars & up", "3 stars & up", "2 stars & up"];
  
  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const clearFilters = () => {
    setActiveFilters([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <BookOpen className="text-blue-600 h-8 w-8" />
            <span className="ml-2 text-xl font-bold text-gray-800">BookNest</span>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              <Link to="/books" className="text-gray-500 hover:text-gray-700">Top Books</Link>
              <Link to="/authors" className="text-gray-500 hover:text-gray-700">Top Authors</Link>
              <Link to="/genres" className="text-gray-500 hover:text-gray-700">Genres</Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <form action="/search" method="GET" className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="q"
                className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search for books, authors, or genres..."
                defaultValue={query}
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-wrap items-center">
            <h1 className="text-2xl font-bold text-gray-900 mr-4 mb-2 sm:mb-0">
              Search results for "{query}"
            </h1>
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter size={16} className="mr-1" />
              Filter
            </button>
            
            {activeFilters.length > 0 && (
              <div className="w-full mt-3 flex flex-wrap items-center">
                <span className="text-sm text-gray-600 mr-2">Active filters:</span>
                {activeFilters.map(filter => (
                  <span 
                    key={filter}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-2 mb-2"
                  >
                    {filter}
                    <button
                      type="button"
                      onClick={() => toggleFilter(filter)}
                      className="ml-1 flex-shrink-0 inline-flex text-blue-400 hover:text-blue-500 focus:outline-none"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
        
        {showFilterMenu && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600"
                        checked={activeFilters.includes(category)}
                        onChange={() => toggleFilter(category)}
                      />
                      <span className="ml-2 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Genre</h3>
                <div className="space-y-2">
                  {genres.map(genre => (
                    <label key={genre} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600"
                        checked={activeFilters.includes(genre)}
                        onChange={() => toggleFilter(genre)}
                      />
                      <span className="ml-2 text-sm text-gray-600">{genre}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
                <div className="space-y-2">
                  {ratings.map(rating => (
                    <label key={rating} className="flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded text-blue-600"
                        checked={activeFilters.includes(rating)}
                        onChange={() => toggleFilter(rating)}
                      />
                      <span className="ml-2 text-sm text-gray-600">{rating}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-700">
              {results.length} results found
            </p>
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sort by:</span>
              <select className="border-gray-300 rounded-md text-sm">
                <option value="relevance">Relevance</option>
                <option value="rating">Rating (High to Low)</option>
                <option value="date-new">Newest First</option>
                <option value="date-old">Oldest First</option>
              </select>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {results.map((result, index) => (
              <div key={`${result.type}-${result.id}-${index}`} className="p-6">
                {result.type === 'book' ? (
                  <div className="md:flex">
                    <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0">
                      <img src={result.cover} alt={result.title} className="h-48 object-cover rounded shadow" />
                    </div>
                    <div className="md:ml-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link to={`/books/${result.id}`} className="text-xl font-medium text-blue-600 hover:text-blue-800">
                            {result.title}
                          </Link>
                          <p className="mt-1">
                            <Link to={`/authors/${result.authorId}`} className="text-sm text-blue-600 hover:text-blue-800">
                              by {result.author}
                            </Link>
                          </p>
                        </div>
                        <span className="font-medium text-gray-900">{result.price}</span>
                      </div>
                      
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            size={16}
                            className={i < Math.floor(result.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                          />
                        ))}
                        <span className="ml-2 text-gray-600">{result.rating}</span>
                        <span className="ml-2 text-gray-500">Published {result.publishDate}</span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap">
                        {result.genres.map((genre, i) => (
                          <Link 
                            key={i}
                            to={`/genres/${genre.toLowerCase()}`}
                            className="mr-2 mb-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200"
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                      
                      <p className="mt-3 text-gray-600">{result.description}</p>
                      
                      <div className="mt-4">
                        <Link 
                          to={`/books/${result.id}`} 
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : result.type === 'author' ? (
                  <div className="md:flex">
                    <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0">
                      <img src={result.image} alt={result.name} className="h-24 w-24 rounded-full object-cover shadow" />
                    </div>
                    <div className="md:ml-6">
                      <Link to={`/authors/${result.id}`} className="text-xl font-medium text-blue-600 hover:text-blue-800">
                        {result.name}
                      </Link>
                      
                      <div className="flex items-center mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i}
                            size={16}
                            className={i < Math.floor(result.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                          />
                        ))}
                        <span className="ml-2 text-gray-600">{result.rating}</span>
                        <span className="ml-2 text-gray-500">{result.bookCount} books</span>
                      </div>
                      
                      <div className="mt-2 flex flex-wrap">
                        {result.genres.map((genre, i) => (
                          <Link 
                            key={i}
                            to={`/genres/${genre.toLowerCase()}`}
                            className="mr-2 mb-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs hover:bg-blue-200"
                          >
                            {genre}
                          </Link>
                        ))}
                      </div>
                      
                      <p className="mt-3 text-gray-600">{result.description}</p>
                      
                      <div className="mt-4">
                        <Link 
                          to={`/authors/${result.id}`} 
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <p className="text-gray-400 text-center">&copy; 2025 BookNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}