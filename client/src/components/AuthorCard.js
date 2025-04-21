import { useEffect, useState } from 'react';
import { Box, Button, Modal, Typography, Grid, Rating, Divider } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';
import { formatDecimal } from './NumberFormatting';
const config = require('../config.json');

export default function AuthorCard({ authorId, handleClose }) {
  const [authorData, setAuthorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
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

  // Function to navigate to full author page
  const viewFullProfile = () => {
    handleClose();
    navigate(`/authors/${authorId}`);
  };

  const authorInfo = getAuthorInfo();

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
          <Typography variant="h6">Loading author details...</Typography>
        ) : error ? (
          <Typography variant="h6" color="error">Error: {error}</Typography>
        ) : (
          <Grid container spacing={3}>
            {/* Author Info */}
            <Grid item xs={12}>
              <Typography variant="h4" component="h1" gutterBottom>{authorInfo.name}</Typography>
              
              <Box display="flex" alignItems="center" mb={1}>
                <Rating 
                  value={parseFloat(authorInfo.averageRating) || 0} 
                  precision={0.1} 
                  readOnly 
                />
                <Typography variant="body2" style={{ marginLeft: 8 }}>
                  {formatDecimal(authorInfo.averageRating)} average rating
                </Typography>
              </Box>
              
              <Typography variant="body1" gutterBottom>
                Total Books: {authorInfo.totalBooks || 0}
              </Typography>
              
              <Divider style={{ margin: '16px 0' }} />
            </Grid>

            {/* Books by Author - Top 5 */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Books by {authorInfo.name}
                
              </Typography>
              
              <Grid container spacing={2}>
                {authorData.slice(0, 5).map((book, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box 
                      p={2} 
                      style={{ 
                        border: '1px solid #eee', 
                        borderRadius: '8px',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <Box 
                        style={{ 
                          display: 'flex', 
                          justifyContent: 'center',
                          marginBottom: '12px' 
                        }}
                      >
                        <img 
                          src={book.image || "https://via.placeholder.com/100x140?text=No+Cover"} 
                          alt={book.title}
                          style={{ 
                            maxWidth: '100px', 
                            maxHeight: '140px',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            borderRadius: '4px'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/100x140?text=No+Cover";
                          }}
                        />
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        component={NavLink} 
                        to={`/books/${book.bookid}`}
                        style={{ 
                          color: '#1976d2', 
                          textDecoration: 'none',
                          fontWeight: 'medium'
                        }}
                      >
                        {book.title}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mt={1}>
                        <Rating 
                          value={parseFloat(book.bookrating) || 0} 
                          precision={0.1} 
                          size="small"
                          readOnly 
                        />
                        <Typography variant="body2" style={{ marginLeft: 4 }}>
                          ({book.reviewcount || 0})
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              {authorData.length > 5 && (
                <Box mt={2} textAlign="center">
                  <Button 
                    variant="outlined" 
                    color="primary"
                    onClick={viewFullProfile}
                  >
                    View All {authorInfo.totalBooks} Books
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        )}
        
        <Box mt={3} textAlign="center" display="flex" justifyContent="center" gap={2}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={viewFullProfile}
          >
            View Full Profile
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}