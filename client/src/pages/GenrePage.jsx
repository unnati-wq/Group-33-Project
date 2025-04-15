import React from 'react';
import { BookOpen, ArrowLeft, Star, Filter } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function GenrePage() {
  // In a real app, you'd fetch this data using the name from useParams()
  const { name } = useParams();

  // Format the genre name for display (e.g., "science-fiction" to "Science Fiction")
  const formattedGenreName = name
    ? name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "Genre";

  // Mock data
  const genre = {
    id: 1,
    name: formattedGenreName,
    description: "Science fiction is a genre of speculative fiction that typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.",
    bookCount: 1245
  };

  const books = [
    {
      id: 1,
      title: "Project Hail Mary",
      author: "Andy Weir",
      authorId: 5,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.8,
      price: "$15.99",
      publishDate: "2021",
      description: "A lone astronaut must save the earth from disaster in this incredible new science-based thriller from the #1 New York Times bestselling author of The Martian."
    },
    {
      id: 2,
      title: "Dune",
      author: "Frank Herbert",
      authorId: 6,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.7,
      price: "$13.99",
      publishDate: "1965",
      description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the spice melange."
    },
    {
      id: 3,
      title: "The Three-Body Problem",
      author: "Liu Cixin",
      authorId: 7,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.3,
      price: "$16.99",
      publishDate: "2014",
      description: "Set against the backdrop of China's Cultural Revolution, a secret military project sends signals into space to establish contact with aliens."
    },
    {
      id: 4,
      title: "Klara and the Sun",
      author: "Kazuo Ishiguro",
      authorId: 8,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.5,
      price: "$14.99",
      publishDate: "2021",
      description: "From the bestselling author of Never Let Me Go and The Remains of the Day, a stunning new novel that asks, what does it mean to love?"
    },
    {
      id: 5,
      title: "The Martian",
      author: "Andy Weir",
      authorId: 5,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.6,
      price: "$12.99",
      publishDate: "2014",
      description: "Six days ago, astronaut Mark Watney became one of the first people to walk on Mars. Now, he's sure he'll be the first person to die there."
    },
    {
      id: 6,
      title: "Hyperion",
      author: "Dan Simmons",
      authorId: 9,
      cover: "https://via.placeholder.com/150x230",
      rating: 4.5,
      price: "$11.99",
      publishDate: "1989",
      description: "On the world called Hyperion, beyond the reach of galactic law, waits a creature called the Shrike. There are those who worship it. There are those who fear it."
    }
  ];
  
  const topAuthors = [
    { id: 5, name: "Andy Weir", bookCount: 3 },
    { id: 6, name: "Frank Herbert", bookCount: 6 },
    { id: 10, name: "Ursula K. Le Guin", bookCount: 8 },
    { id: 11, name: "Isaac Asimov", bookCount: 12 }
  ];

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
          <Link to="/genres" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to all genres</span>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900">{genre.name}</h1>
            <p className="mt-4 text-gray-600">{genre.description}</p>
            <p className="mt-2 text-gray-500">{genre.bookCount} books in this genre</p>
          </div>
        </div>
        
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/4 mb-6 md:mb-0">
            <div className="bg-white shadow rounded-lg overflow-hidden p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Filter size={18} className="mr-2" />
                Filters
              </h2>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Rating</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">4 stars & up</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">3 stars & up</span>
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Under $10</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">$10 to $15</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">$15 to $20</span>
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Publication Year</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Last 2 years</span>
                  </label>
                    <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Last 5 years</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Last 10 years</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Classics (older than 20 years)</span>
                  </label>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Top Authors in {genre.name}</h3>
                <div className="space-y-2">
                  {topAuthors.map(author => (
                    <Link 
                      key={author.id} 
                      to={`/authors/${author.id}`}
                      className="block p-2 hover:bg-gray-50 rounded"
                    >
                      <span className="text-blue-600">{author.name}</span>
                      <span className="text-xs text-gray-500 ml-1">({author.bookCount} books)</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-3/4">
            <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-medium text-gray-900 mb-2 sm:mb-0">Books in {genre.name}</h2>
                <div className="flex items-center">
                  <span className="text-sm text-gray-600 mr-2">Sort by:</span>
                  <select className="border-gray-300 rounded-md text-sm">
                    <option value="rating">Rating (High to Low)</option>
                    <option value="date-new">Newest First</option>
                    <option value="date-old">Oldest First</option>
                    <option value="price-low">Price (Low to High)</option>
                    <option value="price-high">Price (High to Low)</option>
                  </select>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {books.map(book => (
                  <div key={book.id} className="p-6">
                    <div className="md:flex">
                      <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0">
                        <img src={book.cover} alt={book.title} className="h-48 object-cover rounded shadow" />
                      </div>
                      <div className="md:ml-6">
                        <Link to={`/books/${book.id}`} className="text-xl font-medium text-blue-600 hover:text-blue-800">
                          {book.title}
                        </Link>
                        <p className="mt-1">
                          <Link to={`/authors/${book.authorId}`} className="text-sm text-blue-600 hover:text-blue-800">
                            by {book.author}
                          </Link>
                        </p>
                        
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i}
                              size={16}
                              className={i < Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                            />
                          ))}
                          <span className="ml-2 text-gray-600">{book.rating}</span>
                          <span className="ml-2 text-gray-500">Published {book.publishDate}</span>
                        </div>
                        
                        <p className="mt-3 text-gray-600">{book.description}</p>
                        
                        <div className="mt-4 flex items-center justify-between">
                          <span className="font-medium text-gray-900">{book.price}</span>
                          <Link 
                            to={`/books/${book.id}`} 
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of <span className="font-medium">{genre.bookCount}</span> results
                </div>
                <div className="flex-1 flex justify-end">
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    
                    <a  href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ArrowLeft size={16} />
                    </a>
                    
                    <a  href="#"
                      aria-current="page"
                      className="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      1
                    </a>
                    
                    <a  href="#"
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      2
                    </a>
                    
                    <a  href="#"
                      className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                    >
                      3
                    </a>
                    <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                      ...
                    </span>
                    
                    <a  href="#"
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      10
                    </a>
                    
                    <a  href="#"
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
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