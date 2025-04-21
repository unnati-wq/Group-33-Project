import { useEffect, useState } from 'react';
import { 
  Box, 
  Button, 
  Chip, 
  Modal, 
  Typography, 
  Grid, 
  Rating, 
  Link as MuiLink,
  Divider,
  Paper,
  CircularProgress,
  Collapse
} from '@mui/material';
import { NavLink } from 'react-router-dom';
const config = require('../config.json');

// Helper function to format decimal numbers
const formatDecimal = (value, decimalPlaces = 2) => {
  if (value === undefined || value === null) return 'N/A';
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return isNaN(numValue) ? 'N/A' : numValue.toFixed(decimalPlaces);
};

export default function BookCard({ bookId, handleClose }) {
  const [bookData, setBookData] = useState({});
  const [reviewsData, setReviewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [error, setError] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  // Fetch the book data when the component mounts or when bookId changes
  useEffect(() => {
    setLoading(true);
    fetch(`http://${config.server_host}:${config.server_port}/profile/book?id=${bookId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(resJson => {
        console.log("Book data:", resJson);
        if (resJson && resJson.length > 0) {
          setBookData(resJson[0]);
        } else {
          throw new Error("No book data found");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching book:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [bookId]);

  // Function to fetch reviews
  const fetchReviews = () => {
    if (reviewsData) {
      // If we already have reviews data, just toggle visibility
      setShowReviews(!showReviews);
      return;
    }

    setLoadingReviews(true);
    fetch(`http://${config.server_host}:${config.server_port}/review/${bookId}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then(resJson => {
        console.log("Reviews data:", resJson);
        setReviewsData(resJson);
        setShowReviews(true);
        setLoadingReviews(false);
      })
      .catch(err => {
        console.error("Error fetching reviews:", err);
        setLoadingReviews(false);
      });
  };

  // Parse the recommendations string into an array
  const getRecommendations = () => {
    if (!bookData.recommendations || bookData.recommendations === "No recommendations available") {
      return [];
    }
    
    try {
      return bookData.recommendations.split(', ')
        .map(rec => {
          // Extract title and rating from format "Title (Rating: X)"
          const match = rec.match(/(.*) \(Rating: (.*)\)/);
          return match ? { title: match[1], rating: match[2] } : { title: rec, rating: "N/A" };
        });
    } catch (e) {
      console.error("Error parsing recommendations:", e);
      return [];
    }
  };

  // Format the published date
  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (e) {
      return "Invalid date";
    }
  };

  // Split genres string into array
  const getGenres = () => {
    if (!bookData.genres) return [];
    return bookData.genres.split(', ');
  };

  return (
    <Modal
      open={true}
      onClose={handleClose}
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
    >
      <Box
        p={3}
        style={{ 
          background: 'white', 
          borderRadius: '16px', 
          border: '2px solid #000', 
          width: 800,
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {loading ? (
          <Typography variant="h6">Loading book details...</Typography>
        ) : error ? (
          <Typography variant="h6" color="error">Error: {error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Book Image */}
            <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
              <img 
                src={bookData.image || "https://via.placeholder.com/200x300?text=No+Cover"} 
                alt={bookData.title}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  borderRadius: '8px'
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/200x300?text=No+Cover";
                }}
              />
              
              {/* Reviews Button */}
              <Button 
                variant="outlined" 
                color="primary"
                fullWidth
                onClick={fetchReviews}
                disabled={loadingReviews}
                sx={{ mt: 2 }}
              >
                {loadingReviews ? 'Loading...' : (showReviews ? 'Hide Reviews ▲' : 'View Reviews ▼')}
              </Button>
            </Grid>

            {/* Book Details */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" component="h1" gutterBottom>{bookData.title}</Typography>
              
              <Typography variant="h6" gutterBottom>
                By {bookData.authors || "Unknown Author"}
              </Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <Rating 
                  value={parseFloat(bookData.averagerating) || 0} 
                  precision={0.1} 
                  readOnly 
                />
                <Typography variant="body2" style={{ marginLeft: 8 }}>
                  {formatDecimal(bookData.averagerating)} ({bookData.reviewcount || 0} reviews)
                </Typography>
              </Box>

              <Typography variant="body2" gutterBottom>
                <strong>Publisher:</strong> {bookData.publishername || "Unknown"}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Published:</strong> {formatDate(bookData.publisheddate)}
              </Typography>
              
              <Typography variant="body2" gutterBottom>
                <strong>Price:</strong> {bookData.price ? `$${bookData.price}` : "Not available"}
              </Typography>
              
              <Box mt={2} mb={2}>
                <Typography variant="body2" gutterBottom><strong>Genres:</strong></Typography>
                <Box>
                  {getGenres().map((genre, index) => (
                    <Chip 
                      key={index} 
                      label={genre} 
                      style={{ margin: '0 4px 4px 0' }}
                      component={NavLink}
                      to={`/genres/${encodeURIComponent(genre.toLowerCase())}`}
                      clickable
                    />
                  ))}
                </Box>
              </Box>
              
              <Box mt={2}>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  href={bookData.infolink} 
                  target="_blank"
                  style={{ marginRight: 8 }}
                >
                  More Info
                </Button>
                
                <Button 
                  variant="outlined" 
                  color="secondary" 
                  href={bookData.previewlink} 
                  target="_blank"
                >
                  Preview
                </Button>
              </Box>
            </Grid>
            
            {/* Reviews Section */}
            <Grid item xs={12}>
              <Collapse in={showReviews} timeout="auto" unmountOnExit>
                <Box my={3}>
                  <Divider sx={{ mb: 3 }} />
                  <Typography variant="h5" gutterBottom>
                    Reader Reviews
                  </Typography>
                  
                  {loadingReviews ? (
                    <Box display="flex" justifyContent="center" my={4}>
                      <CircularProgress />
                    </Box>
                  ) : reviewsData ? (
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Rating 
                            value={parseFloat(reviewsData.average_rating) || 0} 
                            precision={0.1} 
                            readOnly 
                            size="large"
                          />
                          <Typography variant="h6" sx={{ ml: 1 }}>
                            {formatDecimal(reviewsData.average_rating)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({reviewsData.number_of_ratings} ratings)
                          </Typography>
                        </Box>
                      </Grid>
                      
                      {reviewsData.random_review_1 && (
                        <Grid item xs={12} md={6}>
                          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="body1" sx={{ mb: 1, fontStyle: 'italic' }}>
                              "{reviewsData.random_review_1}"
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                      
                      {reviewsData.random_review_2 && (
                        <Grid item xs={12} md={6}>
                          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                            <Typography variant="body1" sx={{ mb: 1, fontStyle: 'italic' }}>
                              "{reviewsData.random_review_2}"
                            </Typography>
                          </Paper>
                        </Grid>
                      )}
                    </Grid>
                  ) : (
                    <Typography>No reviews available for this book.</Typography>
                  )}
                </Box>
              </Collapse>
            </Grid>
            
            {/* Recommendations */}
            <Grid item xs={12}>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" gutterBottom>
                Recommended Books
              </Typography>
              
              {getRecommendations().length > 0 ? (
                <Grid container spacing={2}>
                  {getRecommendations().map((rec, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                        <Typography variant="body1">{rec.title}</Typography>
                        {rec.rating !== "0" && rec.rating !== "N/A" && (
                          <Box display="flex" alignItems="center" mt={1}>
                            <Rating 
                              value={parseFloat(rec.rating) || 0} 
                              precision={0.1} 
                              size="small"
                              readOnly 
                            />
                            <Typography variant="body2" style={{ marginLeft: 4 }}>
                              {rec.rating}
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2">No recommendations available</Typography>
              )}
            </Grid>
          </Grid>
        )}
        
        <Box mt={3} textAlign="center">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}