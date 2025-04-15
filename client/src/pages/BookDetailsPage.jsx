import React from 'react';
import { BookOpen, User, Calendar, Clock, Star, ArrowLeft } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function BookDetailsPage() {
  // In a real app, you'd fetch this data using the ID from useParams()
  const { id } = useParams();
  
  // Mock data
  const book = {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    authorId: 1,
    cover: "https://via.placeholder.com/300x450",
    rating: 4.5,
    reviewCount: 1247,
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    publishDate: "August 13, 2020",
    publisher: "Viking",
    publisherId: 3,
    categories: ["Fiction", "Fantasy", "Contemporary"],
    pages: 304,
    price: "$14.99"
  };
  
  const reviews = [
    {
      id: 1,
      user: "Alex Johnson",
      rating: 5,
      date: "March 15, 2023",
      content: "This book completely changed my perspective on life choices and regrets. Nora's journey through the different versions of her life is both thought-provoking and emotionally resonant."
    },
    {
      id: 2,
      user: "Jamie Smith",
      rating: 4,
      date: "February 28, 2023",
      content: "A beautiful meditation on regret and possibility. The concept is fascinating, though I felt the ending was a bit predictable."
    }
  ];
  
  const similarBooks = [
    { id: 2, title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab", cover: "https://via.placeholder.com/150x230" },
    { id: 3, title: "Project Hail Mary", author: "Andy Weir", cover: "https://via.placeholder.com/150x230" },
    { id: 4, title: "The House in the Cerulean Sea", author: "TJ Klune", cover: "https://via.placeholder.com/150x230" }
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
          <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft size={16} className="mr-1" />
            <span>Back to search results</span>
          </Link>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="md:flex">
              <div className="md:flex-shrink-0 flex justify-center mb-6 md:mb-0">
                <img className="h-80 object-cover rounded shadow" src={book.cover} alt={book.title} />
              </div>
              <div className="md:ml-8">
                <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">{book.title}</h1>
                <Link to={`/authors/${book.authorId}`} className="mt-2 text-blue-600 block text-center md:text-left">
                  by {book.author}
                </Link>
                
                <div className="flex items-center mt-4 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={18}
                      className={i < Math.floor(book.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{book.rating}</span>
                  <span className="ml-2 text-gray-500">({book.reviewCount} reviews)</span>
                </div>
                
                <div className="mt-6 text-center md:text-left">
                  <p className="text-gray-600">{book.description}</p>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Publication Date</p>
                      <p className="font-medium">{book.publishDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Publisher</p>
                      <Link to={`/publishers/${book.publisherId}`} className="font-medium text-blue-600">
                        {book.publisher}
                      </Link>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Pages</p>
                      <p className="font-medium">{book.pages}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">{book.price}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="text-sm text-gray-500 mb-2">Categories:</div>
                  <div className="flex flex-wrap gap-2">
                    {book.categories.map((category, index) => (
                      <Link 
                        key={index}
                        to={`/genres/${category.toLowerCase()}`}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden divide-y divide-gray-200">
            {reviews.map(review => (
              <div key={review.id} className="p-6">
                <div className="flex items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{review.user}</h3>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          size={16}
                          className={i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"} 
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="mt-3 text-gray-600">{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-gray-50">
              <button className="w-full py-2 text-blue-600 font-medium hover:text-blue-800">
                View all {book.reviewCount} reviews
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Books</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-6">
            {similarBooks.map(book => (
              <Link to={`/books/${book.id}`} key={book.id} className="bg-white shadow rounded-lg p-4 flex flex-col items-center hover:shadow-lg transition-shadow">
                <img src={book.cover} alt={book.title} className="h-48 object-cover" />
                <h3 className="mt-4 font-medium text-gray-900 text-center">{book.title}</h3>
                <p className="text-sm text-blue-600">by {book.author}</p>
              </Link>
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