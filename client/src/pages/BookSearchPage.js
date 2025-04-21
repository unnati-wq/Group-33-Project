import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Slider, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import BookCard from '../components/BookCard';
const config = require('../config.json');

// Helper function to format decimal numbers
const formatDecimal = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? 'N/A' : numValue.toFixed(decimalPlaces);
};

export default function SimpleSearchPage() {
  // Search parameters
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [price, setPrice] = useState([0, 100]);
  const [rating, setRating] = useState([0, 5]);
  
  // Search results and state
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [searched, setSearched] = useState(false);
  
  // Common genres for dropdown
  const commonGenres = [
    'Fiction', 'Fantasy', 'Science Fiction', 'Mystery', 'Romance', 'Thriller',
    'Horror', 'Historical Fiction', 'Biography', 'Self-Help', 'Business',
    'Cooking', 'Art', 'History', 'Travel', 'Religion', 'Science', 'Poetry'
  ];
  
  const handleSearch = () => {
    setLoading(true);
    setError(null);
    setSearched(true);
    
    // Construct search query
    const queryParams = new URLSearchParams();
    if (title) queryParams.append('title', title);
    if (author) queryParams.append('author', author);
    if (genre) queryParams.append('genre', genre);
    queryParams.append('price_low', price[0]);
    queryParams.append('price_high', price[1]);
    queryParams.append('rating_low', rating[0]);
    queryParams.append('rating_high', rating[1]);
    
    // Log the query for debugging
    console.log(`Searching with query: ${queryParams.toString()}`);
    
    // Fetch search results
    fetch(`http://${config.server_host}:${config.server_port}/search_books?${queryParams.toString()}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Search results:', data);
        setResults(data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Search error:', err);
        setError(err.message);
        setLoading(false);
      });
  };
  
  const handleBookClick = (bookId) => {
    console.log(`Opening book details for ID: ${bookId}`);
    setSelectedBookId(bookId);
  };
  
  const handleCloseBookCard = () => {
    setSelectedBookId(null);
  };
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Book details modal */}
      {selectedBookId && <BookCard bookId={selectedBookId} handleClose={handleCloseBookCard} />}
      
      <Typography variant="h4" component="h1" gutterBottom>
        Search Books
      </Typography>
      
      {/* Search Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Title and Author */}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Book Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Author"
              variant="outlined"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </Grid>
          
          {/* Genre dropdown */}
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="genre-select-label">Genre</InputLabel>
              <Select
                labelId="genre-select-label"
                id="genre-select"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                label="Genre"
              >
                <MenuItem value="">
                  <em>Any Genre</em>
                </MenuItem>
                {commonGenres.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Price Slider */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Price Range: ${price[0]} - ${price[1]}
            </Typography>
            <Slider
              value={price}
              onChange={(e, newValue) => setPrice(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
              step={1}
              valueLabelFormat={(value) => `$${value}`}
            />
          </Grid>
          
          {/* Rating Slider */}
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>
              Rating Range: {rating[0]} - {rating[1]}
            </Typography>
            <Slider
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.5}
            />
          </Grid>
          
          {/* Search Button */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search Books'}
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Error Message */}
      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: '#ffebee' }}>
          <Typography color="error">
            Error: {error}
          </Typography>
        </Paper>
      )}
      
      {/* Results */}
      {searched && (
        <>
          <Typography variant="h5" component="h2" gutterBottom>
            Search Results {results.length > 0 && `(${results.length} books found)`}
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : results.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="search results table">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Genre</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((book, index) => (
                    <TableRow 
                      key={index} 
                      hover
                      onClick={() => handleBookClick(book.bookid)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell component="th" scope="row">
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {book.image && (
                            <img 
                              src={book.image}
                              alt={book.title}
                              style={{ 
                                height: 60, 
                                marginRight: 16,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                              }}
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <Typography color="primary">{book.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{book.authorname}</TableCell>
                      <TableCell>{book.genre}</TableCell>
                      <TableCell>
                        {book.price ? `$${parseFloat(book.price).toFixed(2)}` : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating 
                            value={parseFloat(book.averagerating) || 0} 
                            precision={0.5} 
                            readOnly 
                            size="small" 
                          />
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {formatDecimal(book.averagerating)}
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body1">
                No books found matching your search criteria.
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
}