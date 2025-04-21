import React, { useEffect, useState } from 'react';
import { useParams, NavLink, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Rating, 
  Divider, 
  Card, 
  CardContent, 
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Link
} from '@mui/material';
import BookCard from '../components/BookCard';  // Assuming you have this component
const config = require('../config.json');

// Helper function to format decimal numbers
const formatDecimal = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? 'N/A' : numValue.toFixed(decimalPlaces);
};

export default function SimpleAuthorPage() {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('rating');
  const [selectedBookId, setSelectedBookId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    
    fetch(`http://${config.server_host}:${config.server_port}/profile/author?id=${authorId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(resJson => {
        console.log("Author data:", resJson);
        if (resJson && resJson.length > 0) {
          setAuthorData(resJson);
        } else {
          throw new Error("No author data found");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching author:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [authorId]);

  // Get the author information from the first book
  const getAuthorInfo = () => {
    if (authorData.length === 0) return {};
    return {
      authorId: authorData[0].authorid,
      name: authorData[0].authorname,
      totalBooks: authorData[0].totalbooks,
      averageRating: authorData[0].authoraveragerating
    };
  };

  // Sort the books based on the selected sort option
  const getSortedBooks = () => {
    if (!authorData || authorData.length === 0) return [];
    
    const sortedData = [...authorData];
    
    switch(sortBy) {
      case 'rating':
        return sortedData.sort((a, b) => 
          parseFloat(b.bookrating || 0) - parseFloat(a.bookrating || 0)
        );
      case 'title':
        return sortedData.sort((a, b) => 
          (a.title || '').localeCompare(b.title || '')
        );
      case 'reviews':
        return sortedData.sort((a, b) => 
          parseInt(b.reviewcount || 0) - parseInt(a.reviewcount || 0)
        );
      default:
        return sortedData;
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleBookClick = (bookId) => {
    setSelectedBookId(bookId);
  };

  const handleCloseBookCard = () => {
    setSelectedBookId(null);
  };

  const authorInfo = getAuthorInfo();
  const sortedBooks = getSortedBooks();

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Book details card - shown when a book is selected */}
      {selectedBookId && <BookCard bookId={selectedBookId} handleClose={handleCloseBookCard} />}
      
      <Container maxWidth="lg" style={{ paddingTop: 40 }}>
        {/* Simple navigation */}
        <Box mb={4}>
          <Button 
            component={RouterLink} 
            to="/" 
            variant="text" 
            color="primary"
            style={{ marginRight: '8px' }}
          >
            Back to Home
          </Button>
        </Box>
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center" mt={8}>
            <Typography variant="h5" color="error" gutterBottom>
              Error Loading Author
            </Typography>
            <Typography variant="body1">
              {error}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Author Header */}
            <Box mb={6} p={3} bgcolor="white" borderRadius={2} boxShadow={1}>
              <Typography variant="h3" component="h1" gutterBottom>
                {authorInfo.name}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={2}>
                <Rating 
                  value={parseFloat(authorInfo.averageRating) || 0} 
                  precision={0.1} 
                  readOnly 
                />
                <Typography variant="body1" style={{ marginLeft: 12 }}>
                  {formatDecimal(authorInfo.averageRating)} average rating
                </Typography>
              </Box>
              
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {authorInfo.totalBooks} {authorInfo.totalBooks === 1 ? 'book' : 'books'} in database
              </Typography>
            </Box>
            
            {/* Books by Author */}
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3,
                p: 2,
                bgcolor: 'white',
                borderRadius: 2,
                boxShadow: 1
              }}
            >
              <Typography variant="h4" component="h2">
                Books by {authorInfo.name}
              </Typography>
              
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="sort-select-label">Sort By</InputLabel>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortBy}
                  onChange={handleSortChange}
                  label="Sort By"
                >
                  <MenuItem value="rating">Highest Rating</MenuItem>
                  <MenuItem value="title">Title (A-Z)</MenuItem>
                  <MenuItem value="reviews">Most Reviews</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Grid container spacing={4}>
              {sortedBooks.map((book, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card 
                    elevation={2} 
                    sx={{ 
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                      },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleBookClick(book.bookid)}
                  >
                    <Box 
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        padding: '16px',
                        backgroundColor: '#f5f5f5'
                      }}
                    >
                      <img
                        src={book.image || "https://via.placeholder.com/200x300?text=No+Cover"}
                        alt={book.title}
                        style={{ 
                          width: 'auto',
                          height: 180,
                          objectFit: 'contain',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          borderRadius: '4px'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/200x300?text=No+Cover";
                        }}
                      />
                    </Box>
                    
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" gutterBottom>
                        {book.title}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <Rating 
                          value={parseFloat(book.bookrating) || 0} 
                          precision={0.1} 
                          size="small"
                          readOnly 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {formatDecimal(book.bookrating)}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary">
                        {book.reviewcount} {book.reviewcount === 1 ? 'review' : 'reviews'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {sortedBooks.length === 0 && (
              <Box textAlign="center" mt={4} p={3} bgcolor="white" borderRadius={2}>
                <Typography variant="body1">
                  No books found for this author.
                </Typography>
              </Box>
            )}
          </>
        )}
        
        {/* Simple footer */}
        <Box mt={6} pt={3} textAlign="center" borderTop={1} borderColor="divider">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} BookNest. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </div>
  );
}