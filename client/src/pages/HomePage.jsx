import React from 'react';
import { BookOpen, Search, Menu, X } from 'lucide-react';

export default function HomePage() {
  // Mock data for demonstration
  const bookOfTheDay = {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    cover: "https://via.placeholder.com/200x300",
    rating: 4.5,
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived."
  };
  
  return (
    
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="w-full bg-white shadow-sm py-4">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <BookOpen className="text-blue-600 h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-gray-800">BookNest</span>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              <a href="#" className="text-blue-600 font-medium">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">Top Books</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">Top Authors</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">Genres</a>
              <a href="#" className="text-gray-500 hover:text-gray-700 font-medium">Book of the Day</a>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 px-4 w-full">
        <div className="container max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Your Next Great Read
          </h1>
          <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto">
            Find books tailored to your interests, explore new authors, and keep track of your reading journey.
          </p>
          <div className="max-w-xl mx-auto">
            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full rounded-md pl-10 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search for books, authors, or genres..."
                />
              </div>
              <button
                type="button"
                className="ml-3 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
     
      {/* Book of the Day */}
      <div className="bg-white py-12 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-base text-blue-600 font-semibold uppercase">Featured</h2>
            <p className="mt-2 text-3xl font-extrabold text-gray-900">
              Book of the Day
            </p>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row">
                <div className="md:flex-shrink-0 mb-4 md:mb-0">
                  <img className="h-64 w-auto rounded" src={bookOfTheDay.cover} alt={bookOfTheDay.title} />
                </div>
                <div className="md:ml-6">
                  <h3 className="text-2xl font-bold text-gray-900">{bookOfTheDay.title}</h3>
                  <p className="text-sm text-blue-600 mt-1">by {bookOfTheDay.author}</p>
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i}
                          className={`h-5 w-5 ${i < Math.floor(bookOfTheDay.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span className="ml-2 text-gray-600">{bookOfTheDay.rating}/5</span>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">{bookOfTheDay.description}</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* Top Authors Section */}
            {/* Top Authors Section */}
<div className="bg-gray-50 py-12">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-base text-blue-600 font-semibold uppercase">Discover</h2>
      <p className="mt-2 text-3xl font-extrabold text-gray-900">
        Top Authors
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { id: 1, name: "Jane Austen", image: "https://via.placeholder.com/100", rating: 4.8 },
        { id: 2, name: "Stephen King", image: "https://via.placeholder.com/100", rating: 4.7 },
        { id: 3, name: "Haruki Murakami", image: "https://via.placeholder.com/100", rating: 4.6 },
        { id: 4, name: "Toni Morrison", image: "https://via.placeholder.com/100", rating: 4.9 }
      ].map((author) => (
        <div key={author.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-6 flex flex-col items-center">
            <img className="h-32 w-32 rounded-full object-cover" src={author.image} alt={author.name} />
            <h3 className="mt-4 text-lg font-medium text-gray-900">{author.name}</h3>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(author.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{author.rating}</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Profile
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

        {/* Top Books Section */}
<div className="bg-white py-12">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-base text-blue-600 font-semibold uppercase">Trending</h2>
      <p className="mt-2 text-3xl font-extrabold text-gray-900">
        Top Books
      </p>
    </div>
    
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { id: 1, title: "Dune", author: "Frank Herbert", cover: "https://via.placeholder.com/150x230", rating: 4.7 },
        { id: 2, title: "Project Hail Mary", author: "Andy Weir", cover: "https://via.placeholder.com/150x230", rating: 4.8 },
        { id: 3, title: "The Song of Achilles", author: "Madeline Miller", cover: "https://via.placeholder.com/150x230", rating: 4.6 },
        { id: 4, title: "Klara and the Sun", author: "Kazuo Ishiguro", cover: "https://via.placeholder.com/150x230", rating: 4.5 }
      ].map((book) => (
        <div key={book.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 flex flex-col items-center">
            <img className="h-48 w-auto object-cover" src={book.cover} alt={book.title} />
            <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{book.title}</h3>
            <p className="text-sm text-blue-600 mt-1">by {book.author}</p>
            <div className="flex items-center mt-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{book.rating}</span>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

{/* Popular Genres */}
<div className="bg-gray-50 py-12">
  <div className="max-w-7xl mx-auto px-4">
    <div className="text-center mb-10">
      <h2 className="text-base text-blue-600 font-semibold uppercase">Explore</h2>
      <p className="mt-2 text-3xl font-extrabold text-gray-900">
        Popular Genres
      </p>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[
        { id: 1, name: "Science Fiction", count: 1245 },
        { id: 2, name: "Mystery", count: 1120 },
        { id: 3, name: "Fantasy", count: 980 },
        { id: 4, name: "Literary Fiction", count: 875 }
      ].map((genre) => (
        <div key={genre.id} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {genre.name}
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">
                      {genre.count} books
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Explore Genre
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
 
        {/* Call to Action */}
<div className="bg-blue-50">
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
      <span className="block">Ready to find your next favorite book?</span>
      <span className="block text-blue-600">Start exploring today.</span>
    </h2>
    <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
      <div className="inline-flex rounded-md shadow">
        
        <a  href="#"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Get started
        </a>
      </div>
      <div className="ml-3 inline-flex rounded-md shadow">
        
        <a  href="#"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50"
        >
          Learn more
        </a>
      </div>
    </div>
  </div>
</div>
   
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2">
              {/* Social links */}
            </div>
            <p className="mt-8 text-base text-gray-400 md:mt-0 md:order-1">
              &copy; 2025 BookNest. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>

  );
  
  
}