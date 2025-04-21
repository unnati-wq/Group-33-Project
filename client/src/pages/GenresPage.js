import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardActionArea,
  CircularProgress,
  Paper,
  Button,
  Divider,
  Rating,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
const config = require('../config.json');

// Helper function to format decimal numbers
const formatDecimal = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? 'N/A' : numValue.toFixed(decimalPlaces);
};

export default function GenresPage() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genreBooks, setGenreBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const navigate = useNavigate();

  // Fetch popular genres
  useEffect(() => {
    setLoading(true);
    fetch(`http://${config.server_host}:${config.server_port}/popular_genre`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(resJson => {
        console.log("Genres data:", resJson);
        setGenres(resJson || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching genres:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Function to fetch books for a specific genre
  const fetchBooksByGenre = (genre) => {
    setLoadingBooks(true);
    setGenreBooks([]);
    // Using search_books endpoint with genre filter
    fetch(`http://${config.server_host}:${config.server_port}/search_books?genre=${encodeURIComponent(genre)}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(resJson => {
        console.log(`Books for genre ${genre}:`, resJson);
        // Sort by average rating
        const sortedBooks = resJson.sort((a, b) => {
          const ratingA = parseFloat(a.averagerating || 0);
          const ratingB = parseFloat(b.averagerating || 0);
          return ratingB - ratingA;
        });
        setGenreBooks(sortedBooks || []);
        setLoadingBooks(false);
      })
      .catch(err => {
        console.error(`Error fetching books for genre ${genre}:`, err);
        setLoadingBooks(false);
      });
  };

  // Handle genre selection
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    fetchBooksByGenre(genre.genre);
    setTabValue(0); // Reset to Books tab
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle book click
  const handleBookClick = (bookId) => {
    console.log(`Opening book details for ID:`, bookId);
    console.log(`Type of bookId:`, typeof bookId);
  
    setSelectedBookId(bookId);
  };

  // Handle close book card
  const handleCloseBookCard = () => {
    setSelectedBookId(null);
  };

  // Extract unique authors from genre books
  const getTopAuthorsInGenre = () => {
    const authorsMap = new Map();
    
    genreBooks.forEach(book => {
      if (book.authorname) {
        const authorName = book.authorname;
        const authorRating = parseFloat(book.averagerating || 0);
        
        if (authorsMap.has(authorName)) {
          const current = authorsMap.get(authorName);
          authorsMap.set(authorName, {
            name: authorName,
            bookCount: current.bookCount + 1,
            totalRating: current.totalRating + authorRating,
            books: [...current.books, book]
          });
        } else {
          authorsMap.set(authorName, {
            name: authorName,
            bookCount: 1,
            totalRating: authorRating,
            books: [book]
          });
        }
      }
    });
    
    // Calculate average rating and sort by it
    return Array.from(authorsMap.values())
      .map(author => ({
        ...author,
        averageRating: author.totalRating / author.bookCount
      }))
      .sort((a, b) => b.averageRating - a.averageRating);
  };

  // Get color based on rating
  const getRatingColor = (rating) => {
    if (rating >= 4.5) return '#388e3c'; // Green
    if (rating >= 4.0) return '#689f38'; // Light green
    if (rating >= 3.5) return '#ffa000'; // Amber
    if (rating >= 3.0) return '#f57c00'; // Orange
    return '#d32f2f'; // Red
  };

  const topAuthors = getTopAuthorsInGenre();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* BookCard Modal */}
      {selectedBookId && <BookCard bookId={selectedBookId} handleClose={handleCloseBookCard} />}
      
      <Typography variant="h4" component="h1" gutterBottom>
        Popular Genres
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Paper sx={{ p: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">Error: {error}</Typography>
        </Paper>
      ) : (
        <>
          {/* Genres Grid */}
          {!selectedGenre && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {genres.map((genre, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    elevation={3}
                    sx={{
                      height: '100%',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleGenreClick(genre)} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {genre.genre}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Rating 
                            value={parseFloat(genre.averagerating) || 0} 
                            precision={0.1} 
                            readOnly 
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {formatDecimal(genre.averagerating)}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary">
                          {genre.bookcount} books
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mt: 2, color: 'primary.main' }}>
                          Click to explore →
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          
          {/* Genre Detail View */}
          {selectedGenre && (
            <Box>
              <Button 
                variant="text" 
                onClick={() => setSelectedGenre(null)}
                sx={{ mb: 2 }}
              >
                ← Back to All Genres
              </Button>
              
              <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {selectedGenre.genre}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Rating 
                    value={parseFloat(selectedGenre.averagerating) || 0} 
                    precision={0.1} 
                    readOnly 
                    size="large"
                  />
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {formatDecimal(selectedGenre.averagerating)}
                  </Typography>
                </Box>
                
                <Typography variant="body1">
                  {selectedGenre.bookcount} books in this genre
                </Typography>
              </Paper>
              
              {/* Tabs for Books and Authors */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="genre content tabs">
                  <Tab label="Top Books" id="tab-0" />
                  <Tab label="Top Authors" id="tab-1" />
                </Tabs>
              </Box>
              
              {/* Books Tab */}
              <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-0" sx={{ py: 3 }}>
                {loadingBooks ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : genreBooks.length === 0 ? (
                  <Typography>No books found for this genre.</Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="top books table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Title</TableCell>
                          <TableCell>Author</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Reviews</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {genreBooks.slice(0, 10).map((book, index) => (
                          <TableRow 
                            key={index}
                            sx={{ 
                              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' },
                              cursor: 'pointer'
                            }}
                            onClick={() => handleBookClick(book.bookid)}
                          >
                            <TableCell component="th" scope="row">
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <img 
                                  src={book.image || "https://via.placeholder.com/40x60?text=No+Cover"} 
                                  alt={book.title}
                                  style={{ 
                                    height: 60,
                                    width: 'auto',
                                    marginRight: 16,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://via.placeholder.com/40x60?text=No+Cover";
                                  }}
                                />
                                <Typography 
                                  variant="body1" 
                                  color="primary"
                                  sx={{ fontWeight: 'medium' }}
                                >
                                  {book.title}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{book.authorname}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Rating 
                                  value={parseFloat(book.averagerating) || 0} 
                                  precision={0.1} 
                                  readOnly 
                                  size="small"
                                />
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    ml: 1,
                                    color: getRatingColor(parseFloat(book.averagerating) || 0)
                                  }}
                                >
                                  {formatDecimal(book.averagerating)}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{book.reviewcount || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
              
              {/* Authors Tab */}
              <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-1" sx={{ py: 3 }}>
                {loadingBooks ? (
                  <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                  </Box>
                ) : topAuthors.length === 0 ? (
                  <Typography>No authors found for this genre.</Typography>
                ) : (
                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="top authors table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Author</TableCell>
                          <TableCell>Books in Genre</TableCell>
                          <TableCell>Average Rating</TableCell>
                          <TableCell>Top Book</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topAuthors.slice(0, 10).map((author, index) => {
                          // Find top book by this author
                          const topBook = author.books.sort((a, b) => 
                            parseFloat(b.averagerating || 0) - parseFloat(a.averagerating || 0)
                          )[0];
                          
                          return (
                            <TableRow 
                              key={index}
                              sx={{ 
                                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' }
                              }}
                            >
                              <TableCell component="th" scope="row">
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                  {author.name}
                                </Typography>
                              </TableCell>
                              <TableCell>{author.bookCount}</TableCell>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Rating 
                                    value={author.averageRating || 0} 
                                    precision={0.1} 
                                    readOnly 
                                    size="small"
                                  />
                                  <Typography 
                                    variant="body2" 
                                    sx={{ 
                                      ml: 1,
                                      color: getRatingColor(author.averageRating || 0)
                                    }}
                                  >
                                    {formatDecimal(author.averageRating)}
                                  </Typography>
                                </Box>
                              </TableCell>
                              <TableCell>
                                <Typography 
                                  variant="body2" 
                                  color="primary"
                                  sx={{ cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleBookClick(topBook.bookid);
                                  }}
                                >
                                  {topBook?.title || 'N/A'}
                                </Typography>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}