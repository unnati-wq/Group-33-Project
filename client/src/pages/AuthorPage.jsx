import React from 'react';
import { BookOpen, User, Calendar, MapPin, Mail, ArrowLeft, Star } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';

export default function AuthorPage() {
  // In a real app, you'd fetch this data using the ID from useParams()
  const { id } = useParams();
  
  // Mock data
  const author = {
    id: 1,
    name: "Matt Haig",
    image: "https://via.placeholder.com/200",
    bio: "Matt Haig is a British author for children and adults. His memoir Reasons to Stay Alive was a number one bestseller, staying in the British top ten for 46 weeks. His children's book A Boy Called Christmas was a runaway hit and is translated in over 40 languages.",
    birthDate: "1975",
    nationality: "British",
    website: "matthaig.com",
    email: "info@matthaig.com",
    rating: 4.7,
    bookCount: 15
  };
  
  const books = [
    {
      id: 1,
      title: "The Midnight Library",
      cover: "https://via.placeholder.com/150x230",
      rating: 4.5,
      publishDate: "2020",
      description: "Between life and death there is a library, and within that library, the shelves go on forever."
    },
    {
      id: 2,
      title: "How to Stop Time",
      cover: "https://via.placeholder.com/150x230",
      rating: 4.2,
      publishDate: "2017",
      description: "A love story across the ages - and for the ages - about a man lost in time."
    },
    {
      id: 3,
      title: "The Humans",
      cover: "https://via.placeholder.com/150x230",
      rating: 4.1,
      publishDate: "2013",
      description: "Combines science fiction, philosophy and humor to explore the meaning of life."
    }
  ];
  
  const similarAuthors = [
    { id: 2, name: "Fredrik Backman", image: "https://via.placeholder.com/100", rating: 4.6 },
    { id: 3, name: "Kazuo Ishiguro", image: "https://via.placeholder.com/100", rating: 4.5 },
    { id: 4, name: "Gail Honeyman", image: "https://via.placeholder.com/100", rating: 4.3 }
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
                <img className="h-40 w-40 rounded-full object-cover shadow" src={author.image} alt={author.name} />
              </div>
              <div className="md:ml-8">
                <h1 className="text-3xl font-bold text-gray-900 text-center md:text-left">{author.name}</h1>
                
                <div className="flex items-center mt-4 justify-center md:justify-start">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={18}
                      className={i < Math.floor(author.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                    />
                  ))}
                  <span className="ml-2 text-gray-600">{author.rating}</span>
                  <span className="ml-4 text-gray-500">{author.bookCount} books</span>
                </div>
                
                <div className="mt-6 text-center md:text-left">
                  <h2 className="text-lg font-medium text-gray-900">Biography</h2>
                  <p className="mt-2 text-gray-600">{author.bio}</p>
                </div>
                
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Born</p>
                      <p className="font-medium">{author.birthDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Nationality</p>
                      <p className="font-medium">{author.nationality}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Email</p>
                      <a href={`mailto:${author.email}`} className="font-medium text-blue-600">{author.email}</a>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User size={16} className="text-gray-400 mr-2" />
                    <div>
                      <p className="text-gray-500">Website</p>
                      <a href={`https://${author.website}`} target="_blank" rel="noreferrer" className="font-medium text-blue-600">
                        {author.website}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Books by {author.name}</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden divide-y divide-gray-200">
            {books.map(book => (
              <div key={book.id} className="p-6">
                <div className="md:flex md:items-start">
                  <div className="flex-shrink-0 flex justify-center mb-4 md:mb-0">
                    <img src={book.cover} alt={book.title} className="h-40 object-cover rounded shadow" />
                  </div>
                  <div className="md:ml-6">
                    <Link to={`/books/${book.id}`} className="text-xl font-medium text-blue-600 hover:text-blue-800">
                      {book.title}
                    </Link>
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
                    <div className="mt-4">
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
        </div>
        
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Authors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {similarAuthors.map(author => (
              <Link to={`/authors/${author.id}`} key={author.id} className="bg-white shadow rounded-lg p-6 flex flex-col items-center hover:shadow-lg transition-shadow">
                <img src={author.image} alt={author.name} className="h-24 w-24 rounded-full object-cover" />
                <h3 className="mt-4 font-medium text-gray-900">{author.name}</h3>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      size={14}
                      className={i < Math.floor(author.rating) ? "text-yellow-400 fill-current" : "text-gray-300"} 
                    />
                  ))}
                  <span className="ml-1 text-sm text-gray-600">{author.rating}</span>
                </div>
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